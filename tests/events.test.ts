import { createPublicClient, createWalletClient, http, HttpTransport } from "viem";
import { ArweaveStorage, Oracle } from "../src";
import { base as baseMainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

describe("events", () => {
  let oracle: Oracle<HttpTransport, typeof baseMainnet>;

  beforeAll(async () => {
    const RPC_URL = "https://base.llamarpc.com"; // "https://mainnet.base.org";
    const SECRET_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // anvil #0
    const COORDINATOR_ADDRESS = "0x17b6d1eddcd5f9ca19bb2ffed2f3deb6bd74bd20";

    const chain = baseMainnet;
    const transport = http(RPC_URL);

    const walletClient = createWalletClient({ account: privateKeyToAccount(SECRET_KEY), chain, transport });
    const publicClient = createPublicClient({ chain, transport });

    oracle = new Oracle(
      {
        public: publicClient,
        wallet: walletClient,
      },
      new ArweaveStorage()
    );

    await oracle.init(COORDINATOR_ADDRESS);
  });

  it("should get events from previous blocks", async () => {
    // test should be for mainnet for coordinator "0x17b6d1eddcd5f9ca19bb2ffed2f3deb6bd74bd20"
    expect(oracle.coordinator!.address).toBe("0x17b6d1eddcd5f9ca19bb2ffed2f3deb6bd74bd20");

    // between these specific blocks
    const [from, to] = [24660077n, 24670077n]; // 10k blocks

    // there are 14 tasks specifically for the purchase requests
    const purchaseTasks = await oracle.getEvents({ protocol: "swan-agent-purchase/0.1.0", from, to });
    expect(purchaseTasks.length).toBe(2);

    // there are 84 tasks specifically for the state updates
    const stateTasks = await oracle.getEvents({ protocol: "swan-agent-state/0.1.0", from, to });
    expect(stateTasks.length).toBe(19);
  });
});
