import {
  Account,
  Address,
  Chain,
  erc20Abi,
  getContract,
  type Hex,
  maxUint256,
  parseAbi,
  parseEventLogs,
  type Prettify,
  PublicClient,
  toHex,
  Transport,
  WalletClient,
} from "viem";
import { DecentralizedStorage } from "../data";
import coordinatorAbi from "./abi";
import { contractBytesToString, logger, stringToContractBytes } from "../utilities";
import { RequestModels, TaskParameters, TaskRequest, TaskResponse, TaskResponseProcessed, TaskStatus } from "./types";

export class Oracle<T extends Transport, C extends Chain> {
  public coordinator?: Oracle.Coordinator;
  public token?: Oracle.Token;
  public taskParameters: TaskParameters = {
    difficulty: 2,
    numGenerations: 1,
    numValidations: 1,
  };
  public protocol = "oracle-js-sdk/0.1.0";

  constructor(
    readonly client: {
      public: PublicClient<T, C>;
      wallet: WalletClient<T, C, Account>;
    },
    readonly storage?: DecentralizedStorage<string>
  ) {}

  /**
   * Initialize the oracle client by setting up contract instances.
   * @param coordinatorAddress coordinator contract address
   */
  async init(coordinatorAddress: Address) {
    this.coordinator = this.Coordinator(coordinatorAddress);

    const tokenAddr = await this.coordinator.read.feeToken();
    this.token = this.Token(tokenAddr);
  }

  withOptions(opts: Partial<TaskParameters>) {
    this.taskParameters = {
      ...this.taskParameters,
      ...opts,
    };

    return this;
  }

  withProtocol(protocol: string) {
    this.protocol = toHex(protocol, { size: 32 });

    return this;
  }

  /** Returns a new instance of coordinator contract. */
  Coordinator(address: Address) {
    return getContract({
      address,
      abi: coordinatorAbi,
      client: this.client as {
        public: PublicClient;
        wallet: WalletClient;
      },
    });
  }

  /** Returns a new instance of token contract. */
  Token(address: Address) {
    return getContract({
      address,
      abi: erc20Abi,
      client: this.client as {
        public: PublicClient;
        wallet: WalletClient;
      },
    });
  }

  /**
   *
   * @param input input string
   * @param models requested models
   * @param opts optional arguments
   * @returns task id
   */
  async request(
    input: string,
    models: RequestModels,
    opts: {
      taskParameters?: Partial<TaskParameters>;
      protocol?: string;
    } = {}
  ): Promise<bigint> {
    if (this.coordinator === undefined) {
      throw new Error("Coordinator not initialized.");
    }
    const modelsString = Array.isArray(models) ? models.join(",") : (models as string);
    const inputBytes = await stringToContractBytes(input, this.storage);
    const modelBytes = await stringToContractBytes(modelsString, this.storage);
    const protocolBytes = toHex(opts.protocol ?? this.protocol, { size: 32 }); // bytes32 type

    // make the request
    const txHash = await this.coordinator.write.request(
      [protocolBytes, inputBytes, modelBytes, { ...this.taskParameters, ...opts.taskParameters }],
      { chain: this.client.wallet.chain, account: this.client.wallet.account }
    );
    logger.debug(`Request transaction hash: ${txHash}`);

    // wait for receipt & parse event
    const receipt = await this.client.public.waitForTransactionReceipt({ hash: txHash });
    const logs = parseEventLogs({
      abi: parseAbi(["event Request(uint256 indexed taskId, address indexed requester, bytes32 indexed protocol)"]),
      logs: receipt.logs,
      eventName: "Request",
    });
    if (logs.length === 0) {
      logger.error(`Could not find request event in: ${logs}`);
      throw new Error("Request event not found in logs.");
    }

    const taskId = logs[0].args.taskId;
    return taskId;
  }

  /**
   * Alias for `readResponse` and `processResponse`.
   *
   * @param taskId task id
   * @returns processed task response
   */
  async read(taskId: bigint): Promise<Prettify<TaskResponseProcessed>> {
    const response = await this.readResponse(taskId);
    return this.processResponse(response);
  }

  /**
   * Reads the request of a task.
   * @param taskId task id
   * @returns task response
   */
  async readRequest(taskId: bigint): Promise<Prettify<TaskRequest>> {
    if (this.coordinator === undefined) {
      throw new Error("Coordinator not initialized.");
    }

    const requestRaw = await this.coordinator.read.requests([taskId]);
    const request: TaskRequest = {
      requester: requestRaw[0],
      protocol: requestRaw[1],
      parameters: requestRaw[2],
      status: requestRaw[3],
      generatorFee: requestRaw[4],
      validatorFee: requestRaw[5],
      platformFee: requestRaw[6],
      input: requestRaw[7],
      models: requestRaw[8],
    };

    return request;
  }

  /**
   * Reads the response of a task.
   * @param taskId task id
   * @param idx index of the response, if not provided, the best & completed response is returned
   * @returns task response
   */
  async readResponse(taskId: bigint, idx?: bigint): Promise<Prettify<TaskResponse>> {
    if (this.coordinator === undefined) {
      throw new Error("Coordinator not initialized.");
    }

    if (idx === undefined) {
      return await this.coordinator.read.getBestResponse([taskId]);
    } else {
      const responseRaw = await this.coordinator.read.responses([taskId, idx]);
      const response: TaskResponse = {
        responder: responseRaw[0],
        nonce: responseRaw[1],
        score: responseRaw[2],
        output: responseRaw[3],
        metadata: responseRaw[4],
      };
      return response;
    }
  }

  /**
   *
   * @param response existing response object
   * @returns response object with processed `output` and `metadata`
   */
  async processResponse(response: TaskResponse): Promise<Prettify<TaskResponseProcessed>> {
    return {
      ...response,
      output: await contractBytesToString(response.output, this.storage),
      metadata: await contractBytesToString(response.metadata, this.storage),
    };
  }

  /**
   * Waits for a task to be completed.
   * @param taskId task id
   */
  async wait(taskId: bigint): Promise<Hex> {
    if (this.coordinator === undefined) {
      throw new Error("Coordinator not initialized.");
    }

    return new Promise<Hex>((resolve, reject) => {
      const unwatch = this.coordinator!.watchEvent.StatusUpdate(
        {
          taskId,
          protocol: undefined,
        },
        {
          onLogs: (logs) => {
            const status = logs[0].args.statusAfter;
            if (status === TaskStatus.Completed) {
              logger.debug(`Task ${taskId} completed.`);
              unwatch();
              resolve(logs[0].transactionHash);
            }
          },
          onError: (err) => reject(err),
        }
      );
    });
  }

  /** Returns the allowance of the client for the coordinator. */
  async allowance(): Promise<bigint> {
    if (this.token === undefined) {
      throw new Error("Token not initialized.");
    }

    return this.token.read.allowance([this.client.wallet.account.address, this.coordinator!.address]);
  }

  /**
   * Approves the coordinator to spend the client's tokens.
   * @param amount amount to approve, defaults to max uint256 (infinite)
   */
  async approve(amount?: bigint): Promise<Hex> {
    if (this.token === undefined) {
      throw new Error("Token not initialized.");
    }
    amount = amount ?? maxUint256;

    return this.token.write.approve([this.coordinator!.address, amount], {
      chain: this.client.wallet.chain,
      account: this.client.wallet.account,
    });
  }
}

export namespace Oracle {
  export type Token = ReturnType<InstanceType<typeof Oracle<Transport, Chain>>["Token"]>;
  export type Coordinator = ReturnType<InstanceType<typeof Oracle<Transport, Chain>>["Coordinator"]>;
}
