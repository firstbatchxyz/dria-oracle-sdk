import { createPublicClient, createWalletClient, formatEther, http, HttpTransport, isHex } from "viem";
import type { Address, Hex } from "viem";
import { Oracle } from "../src";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import "dotenv/config";

describe.only("oracle", () => {
  let oracle: Oracle<HttpTransport, typeof baseSepolia>;
  let requestTxHash: Hex;
  let taskId: bigint;

  const PRIVATE_KEY =
    (process.env.PRIVATE_KEY! as Hex) ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // anvil #0
  const RPC_URL = process.env.RPC_URL ?? "https://base-sepolia-rpc.publicnode.com"; // public URL
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

    oracle = new Oracle({
      public: publicClient,
      wallet: walletClient,
    });

    await oracle.init(COORDINATOR_ADDRESS);
  });

  it("should check approvals", async () => {
    const allowance = await oracle.allowance();
    expect(allowance).toBeGreaterThan(0n);
  });

  it("should request a task", async () => {
    requestTxHash = await oracle.request("What is 2+2?", "*");
    expect(isHex(requestTxHash)).toBeTruthy();
    console.log({ requestTxHash });
  });

  it("should wait for request transaction", async () => {
    taskId = await oracle.waitRequest(requestTxHash);
    expect(taskId).toBeGreaterThan(0n);
    console.log({ taskId });
  });

  it("should wait for task completion", async () => {
    await oracle.wait(taskId);
  });

  it("should read task request", async () => {
    const request = await oracle.read(taskId);
    expect(request).toBeDefined();
    expect(request.output).toBeDefined();
  });
});
