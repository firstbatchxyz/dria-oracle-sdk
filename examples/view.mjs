// Usage: node example/index.mjs
import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { Oracle, ArweaveStorage } from "dria-oracle-sdk";
import { inspect } from "util";

async function main() {
  const SECRET_KEY = process.env.SECRET_KEY;
  const RPC_URL = process.env.RPC_URL ?? "https://base-sepolia-rpc.publicnode.com";
  const COORDINATOR_ADDRESS = process.env.COORDINATOR_ADDRESS ?? "0x1deaca041f094ec67baa4fb36d333cb652e6b7a7";

  // create oracle instance
  const storage = new ArweaveStorage();
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
    storage
  );
  await oracle.init(COORDINATOR_ADDRESS);

  const taskId = BigInt(process.argv[2] ?? 1);

  // read responses
  const responses = await oracle.readResponses(taskId);
  console.log("\nGenerations:");
  for (const responseRaw of responses) {
    const response = await oracle.processResponse(responseRaw);
    console.log(
      inspect(response, {
        showHidden: false,
        depth: null,
        colors: true,
      })
    );
  }

  // read validations
  const validations = await oracle.getValidations(taskId);
  console.log("\nValidations:");
  for (const validationRaw of validations) {
    const validation = await oracle.processValidation(validationRaw);
    console.log(
      inspect(validation, {
        showHidden: true,
        depth: null,
        colors: true,
      })
    );
  }

  // read best response
  const bestResponse = await oracle.getBestResponse(taskId);
  console.log("\nBest Response:");
  console.log(
    inspect(bestResponse, {
      showHidden: true,
      depth: null,
      colors: true,
    })
  );
}

main().catch(console.error);
