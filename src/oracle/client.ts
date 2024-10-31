import {
  Account,
  bytesToString,
  Chain,
  erc20Abi,
  getContract,
  maxUint256,
  parseAbi,
  parseEventLogs,
  PublicClient,
  stringToBytes,
  toHex,
  Transport,
  WalletClient,
} from "viem";
import type { Address, Hex, Prettify } from "viem";
import { Storage } from "../data";
import coordinatorAbi from "./abi";
// import { contractBytesToString, logger, stringToContractBytes } from "../utilities";
import { RequestModels, TaskParameters, TaskRequest, TaskResponse, TaskResponseProcessed, TaskStatus } from "./types";

/**
 * The Oracle client is used to interact with the Dria Oracles. It allows you to make requests, read responses, and process them.
 *
 * @example
 * const oracle = new Oracle({ public, wallet });
 * await oracle.init(coordinatorAddress);
 */
export class Oracle<T extends Transport, C extends Chain> {
  public coordinator?: Oracle.Coordinator;
  public token?: Oracle.Token;

  // defaults
  public taskParameters: TaskParameters = { difficulty: 2, numGenerations: 1, numValidations: 1 };
  public protocol = "oracle-js-sdk/0.1.0";

  constructor(
    readonly client: {
      public: PublicClient<T, C>;
      wallet: WalletClient<T, C, Account>;
    },
    readonly storage?: Storage<string>
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

  /**
   * Change the underlying default task parameters.
   * @param opts new default task parameters
   */
  withParameters(opts: Partial<TaskParameters>) {
    this.taskParameters = {
      ...this.taskParameters,
      ...opts,
    };

    return this;
  }

  /**
   * Change the underlying default protocol.
   * @param protocol protocol name
   */
  withProtocol(protocol: string) {
    this.protocol = protocol;
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
   * Make an oracle request.
   * @param input input string
   * @param models requested models, can be any of the following:
   * - `*` for all models
   * - `!` for first model of the responder
   * - `["model1", "model2", ...]` for specific models
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
    const inputBytes = await this.stringToContractBytes(input);
    const modelBytes = await this.stringToContractBytes(modelsString);
    const protocolBytes = toHex(opts.protocol ?? this.protocol, { size: 32 }); // bytes32 type

    // make the request
    const txHash = await this.coordinator.write.request(
      [protocolBytes, inputBytes, modelBytes, { ...this.taskParameters, ...opts.taskParameters }],
      { chain: this.client.wallet.chain, account: this.client.wallet.account }
    );
    // logger.debug(`Request transaction hash: ${txHash}`);

    // wait for receipt & parse event
    const receipt = await this.client.public.waitForTransactionReceipt({ hash: txHash });
    const logs = parseEventLogs({
      abi: parseAbi(["event Request(uint256 indexed taskId, address indexed requester, bytes32 indexed protocol)"]),
      logs: receipt.logs,
      eventName: "Request",
    });
    if (logs.length === 0) {
      // logger.error(`Could not find request event in: ${logs}`);
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
      output: await this.contractBytesToString(response.output),
      metadata: await this.contractBytesToString(response.metadata),
    };
  }

  /**
   * Waits for a task to be completed.
   * @param taskId task id
   */
  async wait(taskId: bigint): Promise<void> {
    if (this.coordinator === undefined) {
      throw new Error("Coordinator not initialized.");
    }

    // check if its completed already
    const requestRaw = await this.coordinator.read.requests([taskId]);
    if (requestRaw[3] === TaskStatus.Completed) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const unwatch = this.coordinator!.watchEvent.StatusUpdate(
        {
          taskId,
          protocol: undefined,
        },
        {
          onLogs: (logs) => {
            const status = logs[0].args.statusAfter;
            if (status === TaskStatus.Completed) {
              // logger.debug(`Task ${taskId} completed.`);
              unwatch();
              resolve();
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

  /**
   * Given a string, converts it to a `Hex` string and then:
   * - If `storage` is given, uploads the string to the storage if its large enough and returns the key
   * - Otherwise, returns the `Hex` string, equivalent to a `bytes` type in Solidity.
   *
   * @param bytes input string
   * @param storage decentralized storage, optional
   * @returns a `Hex` string, with 0x prefix
   */
  async stringToContractBytes(input: string): Promise<Hex> {
    const inputBytes = stringToBytes(input);
    if (this.storage && inputBytes.length > this.storage.bytesLimit) {
      const key = await this.storage.put(input);
      // we have to encode the key again, so that it when decoded it is a string of 64 character
      return `0x${Buffer.from(stringToBytes(key)).toString("hex")}`;
    } else {
      return `0x${Buffer.from(inputBytes).toString("hex")}`;
    }
  }

  /**
   * Given a `bytes` Solidity type, converts it to a string:
   * - If `storage` is given, downloads the string from storage if it is matching a key.
   * - Otherwise, converts the bytes to a string.
   *
   * @param input bytes
   * @param storage decentralized storage, optional
   * @returns parsed string
   */
  async contractBytesToString(input: Hex): Promise<string> {
    const inputStr = bytesToString(Buffer.from(input.slice(2), "hex"));
    if (this.storage && this.storage.isKey(inputStr)) {
      return (await this.storage.get(input)) ?? ""; // FIXME: !!!
    } else {
      return inputStr;
    }
  }
}

export namespace Oracle {
  export type Token = ReturnType<InstanceType<typeof Oracle<Transport, Chain>>["Token"]>;
  export type Coordinator = ReturnType<InstanceType<typeof Oracle<Transport, Chain>>["Coordinator"]>;
}
