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
import type { Address, Hex, Prettify, WriteContractReturnType } from "viem";
import { Storage } from "../data";
import coordinatorAbi from "./abi";
import {
  ChatHistoryRequest,
  ChatHistoryResponse,
  RequestModels,
  TaskParameters,
  TaskResponse,
  TaskStatus,
  TaskValidation,
} from "./types";

/**
 * The Oracle client is used to interact with the Dria Oracles. It allows you to make requests, read responses, and process them.
 *
 * @example
 * const oracle = new Oracle({ public, wallet });
 * await oracle.init(coordinatorAddress);
 */
export class Oracle<T extends Transport, C extends Chain> {
  public coordinator?: ReturnType<InstanceType<typeof Oracle<Transport, Chain>>["Coordinator"]>;
  public token?: ReturnType<InstanceType<typeof Oracle<Transport, Chain>>["Token"]>;

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
   * @param input input string, or a chat input
   * - a string input can be anything, like "What is 2+2?"
   * - a chat input is an object `{historyId: number, content: string}` where
   * the `historyId` is a task id the output of which is to be used as history
   * @param models requested models, can be any of the following:
   * - `*` for all models
   * - `!` for first model of the responder
   * - `["model1", "model2", ...]` for specific models
   * @param opts optional arguments
   * @returns task transaction hash
   */
  async request(
    input: string,
    models: RequestModels,
    opts?: {
      taskParameters?: Partial<TaskParameters>;
      protocol?: string;
    }
  ): Promise<WriteContractReturnType>;
  async request(
    input: Prettify<ChatHistoryRequest>,
    models: RequestModels,
    opts?: {
      taskParameters?: Partial<TaskParameters>;
      protocol?: string;
    }
  ): Promise<WriteContractReturnType>;
  async request(
    input: string | Prettify<ChatHistoryRequest>,
    models: RequestModels,
    opts: {
      taskParameters?: Partial<TaskParameters>;
      protocol?: string;
    } = {}
  ): Promise<WriteContractReturnType> {
    if (this.coordinator === undefined) {
      throw new Error("Coordinator not initialized.");
    }
    // models are comma-separated
    const modelsString = Array.isArray(models) ? models.join(",") : (models as string);
    if (typeof input !== "string") {
      // this is chat input, check historyId
      if (!(await this.isCompleted(input.history_id))) {
        throw new Error("Chat history task is not completed.");
      }
      // non-string inputs are stringified
      input = JSON.stringify(input);
    }

    const inputBytes = await this.stringToContractBytes(input);
    const modelBytes = await this.stringToContractBytes(modelsString);
    const protocolBytes = toHex(opts.protocol ?? this.protocol, { size: 32 }); // bytes32 type

    // make the request
    return await this.coordinator.write.request(
      [protocolBytes, inputBytes, modelBytes, { ...this.taskParameters, ...opts.taskParameters }],
      { chain: this.client.wallet.chain, account: this.client.wallet.account }
    );
  }

  /**
   * Alias for `getBestResponse` followed by `processResponse`.
   * @param taskId task id
   * @param kind task kind, e.g. `chat` for conversational models
   * @returns processed task response
   */
  async read(taskId: bigint) {
    const response = await this.getBestResponse(taskId);
    return this.processResponse(response);
  }

  /**
   *
   * @param txHash transaction hash for the request (see `request`)
   * @returns taskId
   */
  async waitRequest(txHash: Hex) {
    const receipt = await this.client.public.waitForTransactionReceipt({ hash: txHash });
    const logs = parseEventLogs({
      abi: parseAbi(["event Request(uint256 indexed taskId, address indexed requester, bytes32 indexed protocol)"]),
      logs: receipt.logs,
      eventName: "Request",
    });
    if (logs.length === 0) {
      throw new Error(`Request event not found in logs: ${JSON.stringify(logs)}`);
    }

    const taskId = logs[0].args.taskId;
    return taskId;
  }

  /**
   * Returns a boolean indicating if the task is completed.
   * @param taskId task id
   * @returns true if the task is completed, or `taskId` is 0
   */
  async isCompleted(taskId: bigint | number): Promise<boolean> {
    // 0 is always accepted
    if (Number(taskId) === 0) {
      return true;
    }

    if (this.coordinator === undefined) {
      throw new Error("Coordinator not initialized.");
    }
    const requestRaw = await this.coordinator.read.requests([BigInt(taskId)]);
    return requestRaw[3] === TaskStatus.Completed;
  }

  /**
   * Returns the highest scored response of a task.
   * Will throw an error if the task is not completed yet!
   *
   * @param taskId task id
   * @returns task response with the highest score
   */
  async getBestResponse(taskId: bigint): Promise<Prettify<TaskResponse>> {
    if (this.coordinator === undefined) {
      throw new Error("Coordinator not initialized.");
    }
    return await this.coordinator.read.getBestResponse([taskId]);
  }

  /**
   * Reads the request of a task.
   * @param taskId task id
   * @returns task response
   */
  async getValidations(taskId: bigint): Promise<readonly Prettify<TaskValidation>[]> {
    if (this.coordinator === undefined) {
      throw new Error("Coordinator not initialized.");
    }
    return this.coordinator.read.getValidations([taskId]);
  }

  /**
   * Read the validations of a task.
   * @param taskId task id
   * @param idx index of the response, if not provided, the best & completed response is returned
   * @returns task response
   */
  async readResponses(taskId: bigint): Promise<readonly Prettify<TaskResponse>[]> {
    if (this.coordinator === undefined) {
      throw new Error("Coordinator not initialized.");
    }
    return await this.coordinator.read.getResponses([taskId]);
  }

  /**
   * Process the `output` and `metadata` of a task, with respect to the given storage.
   * @param response existing response object
   * @returns response object with processed `output` and `metadata`
   */
  async processResponse(response: TaskResponse) {
    const output = await this.contractBytesToString(response.output);
    const metadata = await this.contractBytesToString(response.metadata);

    return {
      ...response,
      output,
      metadata,
    };
  }

  /** Shorthand to parse a string to a chat history response. */
  toChatHistory(str: string): Prettify<ChatHistoryResponse>[] {
    return JSON.parse(str);
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
    if (await this.isCompleted(taskId)) {
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
              unwatch();
              resolve();
            }
          },
          // onError: (err) => reject(err), // TODO: should we handle any stuff here?
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
   * @returns transaction hash
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
   * If no value is found at the storage, it returns `null`.
   *
   * @param input bytes
   * @param storage decentralized storage, optional
   * @returns parsed string
   */
  async contractBytesToString(input: Hex): Promise<string> {
    const inputStr = bytesToString(Buffer.from(input.slice(2), "hex"));
    if (this.storage && this.storage.isKey(inputStr)) {
      const data = await this.storage.get(input);
      if (data == null) {
        throw new Error(`No data found for key: ${input}`);
      }
      return data;
    } else {
      return inputStr;
    }
  }
}
