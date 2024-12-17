import "dotenv/config";
import { createPublicClient, createWalletClient, http, HttpTransport, isHex } from "viem";
import type { Address, Hex } from "viem";
import { Oracle } from "../src";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

// this test uses the live network, not a fork!
describe.only("oracle", () => {
  let oracle: Oracle<HttpTransport, typeof baseSepolia>;
  let requestTxHash: Hex;

  beforeAll(async () => {
    const SECRET_KEY =
      (process.env.SECRET_KEY! as Hex) ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // anvil #0
    const RPC_URL = process.env.RPC_URL ?? "https://base-sepolia-rpc.publicnode.com"; // public URL
    const COORDINATOR_ADDRESS =
      (process.env.COORDINATOR_ADDRESS as Address) ?? "0x362fDBB20191ba22d53bF3b09646AA387Cd6dF75";

    const walletClient = createWalletClient({
      account: privateKeyToAccount(SECRET_KEY),
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

  describe("basic request", () => {
    let taskId: bigint;

    it("should request a task", async () => {
      const { txHash } = await oracle.request("What is 2+2?", "*");
      requestTxHash = txHash;

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

    it("should read task response", async () => {
      const response = await oracle.read(taskId);
      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
    });

    it("should read task validations", async () => {
      const validations = await oracle.getValidations(taskId);
      expect(validations).toBeDefined();
    });
  });

  describe("chat request", () => {
    let taskId: bigint;

    it("should start a new chat session", async () => {
      const { txHash } = await oracle.request({ history_id: 0, content: "What is 2+2?" }, "*");
      requestTxHash = txHash;

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

    it("should read task response", async () => {
      const response = await oracle.read(taskId);
      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
      expect(response.output!.includes("4")).toBeTruthy();
      console.log(response.output);
    });

    it("should continue a chat", async () => {
      const { txHash } = await oracle.request(
        {
          history_id: taskId,
          content: "What is the square of the number that is the answer to previous question?",
        },
        "*"
      );
      requestTxHash = txHash;

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

    it("should read task response", async () => {
      const response = await oracle.read(taskId);
      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
      expect(response.output!.includes("16")).toBeTruthy();
      console.log(response.output);
    });
  });
});
