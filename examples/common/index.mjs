import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { Oracle, ArweaveStorage } from "dria-oracle-sdk";
import { readFileSync } from "fs";

/** Setup an oracle & initialize it using env variables. */
export async function setupOracle() {
  const SECRET_KEY = process.env.SECRET_KEY;
  const RPC_URL = "https://base-sepolia-rpc.publicnode.com";
  const COORDINATOR_ADDRESS = process.env.COORDINATOR_ADDRESS ?? "0x13f977bde221b470d3ae055cde7e1f84debfe202";
  const ARWEAVE_WALLET_PATH = process.env.ARWEAVE_WALLET_PATH;

  // initialize storage
  const storage = new ArweaveStorage();
  if (ARWEAVE_WALLET_PATH) {
    console.log("Using Arweave wallet at:", ARWEAVE_WALLET_PATH);
    storage.init(JSON.parse(readFileSync(ARWEAVE_WALLET_PATH, "utf-8")));
  }

  // create oracle client
  const account = privateKeyToAccount(SECRET_KEY);
  const oracle = new Oracle(
    {
      public: createPublicClient({
        chain: baseSepolia,
        transport: http(RPC_URL),
      }),
      wallet: createWalletClient({
        account: account,
        chain: baseSepolia,
        transport: http(RPC_URL),
      }),
    },
    storage
  );

  console.log("Your address:", account.address);
  console.log("Initializing oracle for coordinator:", COORDINATOR_ADDRESS);
  await oracle.init(COORDINATOR_ADDRESS);

  return oracle;
}

/** Checks if the oracle has been given allowance, and approves it if not. */
export async function allowIfRequired(oracle) {
  const allowance = await oracle.allowance();
  if (allowance === 0n) {
    console.log("Making allowance");
    const txHash = await oracle.approve();
    console.log({ txHash });
  }
}
