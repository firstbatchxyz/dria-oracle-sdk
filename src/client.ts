import { erc20Abi, getContract, maxUint256, parseAbi, parseEventLogs, toHex } from "viem";
import type { Address, Hex, Prettify, Account, Chain, PublicClient, Transport, WalletClient } from "viem";
import { DecentralizedStorage } from "./storage";
import coordinatorAbi from "./abis/coordinator";
import type {
  ChatHistoryRequest,
  ChatHistoryResponse,
  OracleModels,
  RequestOpts,
  RequestReturnType,
  TaskParameters,
  TaskResponse,
  TaskValidation,
  TaskValidationScores,
} from "./types";
import { TaskStatus } from "./types";
import { contractBytesToStringWithStorage, stringToContractBytesWithStorage } from "./utils";

/**
 * The Oracle client is used to interact with the Dria Oracles. It allows you to make requests, read responses, and process them.
 *
 * It can be instantiated with a `storage` as well, which can be used to store large data in a decentralized manner.
 * If the data to be written to contract is large, we can instead store that data in the storage and pass the key to the contract.
 * This key can then be used to fetch the data from the storage.
 *
 * @template T transport type, e.g. HTTP or WebSocket (usually inferred)
 * @template C chain type, e.g. Ethereum or Binance Smart Chain (usually inferred)
 * @template K storage key type, e.g. `ArweaveKey` (usually inferred)
 * @example
 * // without storage
 * const oracle = new Oracle({ public, wallet });
 * await oracle.init(coordinatorAddress);
 *
 * @example
 * // with storage (Arweave)
 * const wallet = JSON.parse(readFileSync("./path/to/wallet.json", "utf-8"));
 * const arweave = new ArweaveStorage(wallet);
 * const oracle = new Oracle({ public, wallet }, arweave);
 * await oracle.init(coordinatorAddress);
 */
export class Oracle<T extends Transport, C extends Chain, K = unknown> {
  public coordinator?: ReturnType<InstanceType<typeof Oracle<Transport, Chain, K>>["Coordinator"]>;
  public token?: ReturnType<InstanceType<typeof Oracle<Transport, Chain, K>>["Token"]>;

  // defaults
  public taskParameters: TaskParameters = { difficulty: 2, numGenerations: 2, numValidations: 2 };
  public protocol = "oracle-js-sdk/0.1.0";

  constructor(
    readonly client: {
      public: PublicClient<T, C>;
      wallet: WalletClient<T, C, Account>;
    },
    readonly storage?: DecentralizedStorage<Buffer, K>
  ) {}

  /**
   * Initialize the oracle client by setting up contract instances.
   * @param coordinatorAddress coordinator contract address
   * @returns initialized oracle client
   */
  async init(coordinatorAddress: Address) {
    this.coordinator = this.Coordinator(coordinatorAddress);

    const tokenAddr = await this.coordinator.read.feeToken();
    this.token = this.Token(tokenAddr);

    return this;
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

  /** Returns a new instance of the LLM coordinator contract.
   * @warning This is an internal method, and making it `private` will break
   * the type export due to the size of ABI-inferred types.
   */
  private Coordinator(address: Address) {
    return getContract({
      address,
      abi: coordinatorAbi,
      client: this.client as {
        public: PublicClient;
        wallet: WalletClient;
      },
    });
  }

  /** Returns a new instance of an ERC20 token contract.
   * @warning This is an internal method, and making it `private` will break
   * the type export due to the size of ABI-inferred types.
   */
  private Token(address: Address) {
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
   *
   * (defaults to `*`)
   * @param opts optional request arguments, such as `protocol` and `taskParameters`
   * @returns task transaction hash
   */
  async request(input: string, models: OracleModels, opts?: RequestOpts): Promise<RequestReturnType>;
  async request(
    input: Prettify<ChatHistoryRequest>,
    models: OracleModels,
    opts?: RequestOpts
  ): Promise<RequestReturnType>;
  async request(
    input: string | Prettify<ChatHistoryRequest>,
    models: OracleModels = "*",
    opts: RequestOpts = {}
  ): Promise<RequestReturnType> {
    if (this.coordinator === undefined) {
      throw new Error("SDK not initialized.");
    }

    // check task parameter
    const taskParameters = { ...this.taskParameters, ...opts.taskParameters };
    if (taskParameters.numGenerations === 0) {
      throw new Error("Number of generations cant be 0.");
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

    const inputBytes = await stringToContractBytesWithStorage(input, this.storage);
    const modelBytes = await stringToContractBytesWithStorage(modelsString, undefined); // we dont use arweave for models

    const protocol = opts.protocol ?? this.protocol;
    const protocolBytes = toHex(protocol, { size: 32 }); // bytes32 type

    // make the request
    const txHash = await this.coordinator.write.request([protocolBytes, inputBytes, modelBytes, taskParameters], {
      chain: this.client.wallet.chain,
      account: this.client.wallet.account,
    });

    return {
      txHash,
      protocol,
      input,
      models,
      taskParameters,
    };
  }

  /**
   * Waits until the request transaction is mined and returns the task id.
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
   * Returns a boolean indicating if the task is completed.
   * @param taskId task id
   * @returns true if the task is completed, or `taskId` is 0
   */
  async isCompleted(taskId: bigint | number): Promise<boolean> {
    // 0 is always accepted
    // TODO: explain why
    if (BigInt(taskId) === 0n) {
      return true;
    }

    if (this.coordinator === undefined) {
      throw new Error("SDK not initialized.");
    }
    const requestRaw = await this.coordinator.read.requests([BigInt(taskId)]);
    return requestRaw[3] === TaskStatus.Completed;
  }

  /**
   * Returns the highest scored response of a task.
   * Will throw an error if the task is not completed yet!
   * @param taskId task id
   * @returns task response with the highest score
   */
  async getBestResponse(taskId: bigint | number): Promise<Prettify<TaskResponse>> {
    if (this.coordinator === undefined) {
      throw new Error("SDK not initialized.");
    }
    return await this.coordinator.read.getBestResponse([BigInt(taskId)]);
  }

  /**
   * Reads the request of a task.
   * @param taskId task id
   * @returns task validations
   */
  async getValidations(taskId: bigint | number): Promise<readonly Prettify<TaskValidation>[]> {
    if (this.coordinator === undefined) {
      throw new Error("SDK not initialized.");
    }
    return this.coordinator.read.getValidations([BigInt(taskId)]);
  }

  /**
   * Read the validations of a task.
   * @param taskId task id
   * @param idx index of the response, if not provided, the best & completed response is returned
   * @returns task response
   */
  async readResponses(taskId: bigint | number): Promise<readonly Prettify<TaskResponse>[]> {
    if (this.coordinator === undefined) {
      throw new Error("SDK not initialized.");
    }
    return await this.coordinator.read.getResponses([BigInt(taskId)]);
  }

  /**
   * Process the `output` and `metadata` of a task, with respect to the given storage.
   * @param response existing response object
   * @returns response object with processed `output` and `metadata`
   */
  async processResponse(response: TaskResponse): Promise<TaskResponse<string | null, string | null>> {
    const output = await contractBytesToStringWithStorage(response.output, this.storage);
    const metadata = await contractBytesToStringWithStorage(response.metadata, this.storage);

    return {
      ...response,
      output,
      metadata,
    };
  }

  /**
   * Process the `metadata` of a task, with respect to the given storage.
   * @param response existing validation object
   * @returns validation object with processed `metadata`
   */
  async processValidation(validation: TaskValidation): Promise<TaskValidation<TaskValidationScores[]>> {
    const metadata = await contractBytesToStringWithStorage(validation.metadata, this.storage);
    if (!metadata) {
      throw new Error("Validation metadata not found.");
    }

    try {
      return {
        ...validation,
        metadata: JSON.parse(metadata) as TaskValidationScores[],
      };
    } catch (err) {
      console.error("Error parsing metadata:", err);
      throw err;
    }
  }

  /** Shorthand to parse a string to a chat history response. */
  toChatHistory(str: string): Prettify<ChatHistoryResponse>[] {
    return JSON.parse(str);
  }

  /**
   * Waits for a task to be completed, i.e. it should have all the required
   * generations and validations be done.
   * @param taskId task id
   */
  async wait(taskId: bigint | number): Promise<void> {
    if (this.coordinator === undefined) {
      throw new Error("SDK not initialized.");
    }

    // check if its completed already
    if (await this.isCompleted(taskId)) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const unwatch = this.coordinator!.watchEvent.StatusUpdate(
        {
          taskId: BigInt(taskId),
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

  /** Returns the allowance of the client for the coordinator.
   * @returns allowance amount
   */
  async allowance(): Promise<bigint> {
    if (this.token === undefined) {
      throw new Error("SDK not initialized.");
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
      throw new Error("SDK not initialized.");
    }
    amount = amount ?? maxUint256;

    return this.token.write.approve([this.coordinator!.address, amount], {
      chain: this.client.wallet.chain,
      account: this.client.wallet.account,
    });
  }
}
