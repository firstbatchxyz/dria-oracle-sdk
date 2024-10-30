import {
  Account,
  Address,
  Chain,
  getContract,
  PublicClient,
  Transport,
  WalletClient,
} from "viem";
import { DecentralizedStorage } from "./data";
import llmCoordinatorAbi from "./abis/llmCoordinator";

export class Oracle<T extends Transport, C extends Chain> {
  public coordinator: ReturnType<typeof this.LLMCoordinator>;

  constructor(
    address: Address,
    readonly client: {
      public: PublicClient<T, C>;
      wallet: WalletClient<T, C, Account>;
    },
    readonly storage?: DecentralizedStorage<string>
  ) {
    this.coordinator = this.LLMCoordinator(address);
  }

  /** Returns a new instance of coordinator contract. */
  LLMCoordinator(address: Address) {
    return getContract({
      address,
      abi: llmCoordinatorAbi,
      client: this.client as {
        public: PublicClient;
        wallet: WalletClient;
      },
    });
  }

  write(input: string, models: string) {
    // TODO: !!!
  }

  read(taskId: bigint) {
    // TODO: !!!
  }
}
