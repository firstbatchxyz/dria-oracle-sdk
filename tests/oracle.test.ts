import { createPublicClient, createWalletClient, formatEther, http, HttpTransport } from "viem";
import type { Address, Hex } from "viem";
import { Oracle } from "../src";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import "dotenv/config";

describe("oracle", () => {
  let oracle: Oracle<HttpTransport, typeof baseSepolia>;
  let taskId: bigint;

  const PRIVATE_KEY =
    (process.env.PRIVATE_KEY! as Hex) ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const RPC_URL = process.env.RPC_URL ?? "https://base-sepolia-rpc.publicnode.com	";
  const COORDINATOR_ADDRESS =
    (process.env.COORDINATOR_ADDRESS as Address) ?? "0x362fDBB20191ba22d53bF3b09646AA387Cd6dF75";

  beforeAll(async () => {
    const walletClient = createWalletClient({
      account: privateKeyToAccount(PRIVATE_KEY),
      chain: baseSepolia,
      transport: http(RPC_URL),
    });
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(RPC_URL),
    });

    // logger.info("Initializing Oracle client...");
    oracle = new Oracle({
      public: publicClient,
      wallet: walletClient,
    });
  });

  it("should initialize oracle", async () => {
    await oracle.init(COORDINATOR_ADDRESS);
  });

  it("should check approvals", async () => {
    const allowance = await oracle.allowance();
    expect(allowance).toBeGreaterThan(0n);
  });

  it("should request a task", async () => {
    taskId = await oracle.request("What is 2+2?", "*");
    expect(taskId).toBeGreaterThan(0n);
    console.log({ taskId });
  });

  test.skip("should wait for task completion", async () => {
    await oracle.wait(taskId);
  });

  test.skip("should read task request", async () => {
    const request = await oracle.read(taskId);
    expect(request).toBeDefined();
    expect(request.output).toBeDefined();
  });
});
