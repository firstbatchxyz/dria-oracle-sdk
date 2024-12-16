import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { Oracle, ArweaveStorage } from "dria-oracle-sdk";

/** Setup an oracle & initialize it using env variables. */
export async function setupOracle() {
  const SECRET_KEY = process.env.SECRET_KEY;
  const RPC_URL = process.env.RPC_URL ?? "https://base-sepolia-rpc.publicnode.com";
  const COORDINATOR_ADDRESS = process.env.COORDINATOR_ADDRESS ?? "0x13f977bde221b470d3ae055cde7e1f84debfe202";

  const oracle = new Oracle(
    {
      public: createPublicClient({
        chain: baseSepolia,
        transport: http(RPC_URL),
      }),
      wallet: createWalletClient({
        account: privateKeyToAccount(SECRET_KEY),
        chain: baseSepolia,
        transport: http(RPC_URL),
      }),
    },
    new ArweaveStorage()
  );

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
