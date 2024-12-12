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
  const COORDINATOR_ADDRESS = process.env.COORDINATOR_ADDRESS ?? "0x13f977bde221b470d3ae055cde7e1f84debfe202";

  // create oracle instance
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

  await oracle.init(COORDINATOR_ADDRESS);

  // check approval (you only need to do this once)
  // you can ignore if you have gave allowance already
  const allowance = await oracle.allowance();
  if (allowance === 0n) {
    console.log("Making allowance");
    const txHash = await oracle.approve();
    console.log({ txHash });
  }

  // make a request
  console.log("Preparing request");
  const input = process.argv[2];
  if (!input) {
    throw new Error("Provide an input.");
  }
  const model = "*";
  const requestObj = await oracle.request(input, model, {
    taskParameters: {
      difficulty: 2,
      numGenerations: 2,
      numValidations: 1,
    },
  });

  console.log("Making a request:", requestObj);
  const taskId = await oracle.waitRequest(requestObj.txHash);

  // wait for the result
  console.log(`Waiting for completions on task: ${taskId}`);
  await oracle.wait(taskId);

  // read best result
  const response = await oracle.read(taskId);
  console.log("Reading best result:");
  console.log(response);

  // read validations
  console.log("Validations:");
  const validations = await oracle.getValidations(taskId);
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
}

main().catch(console.error);
