import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { Oracle } from "dria-oracle-sdk";

async function main() {
  const SECRET_KEY = process.env.SECRET_KEY;
  const RPC_URL = process.env.RPC_URL ?? "https://base-sepolia-rpc.publicnode.com";
  const COORDINATOR_ADDRESS = process.env.COORDINATOR_ADDRESS ?? "0x1deaca041f094ec67baa4fb36d333cb652e6b7a7";

  // create oracle instance
  const oracle = new Oracle({
    public: createPublicClient({
      chain: baseSepolia,
      transport: http(RPC_URL),
    }),
    wallet: createWalletClient({
      account: privateKeyToAccount(SECRET_KEY),
      chain: baseSepolia,
      transport: http(RPC_URL),
    }),
  });

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
  const input = "What is the result of 2+2?";
  const model = "*";
  const requestTxHash = await oracle.request(input, model, {
    taskParameters: {
      numValidations: 0,
    },
  });
  const taskId = await oracle.waitRequest(requestTxHash);

  // wait for the result
  await oracle.wait(taskId);

  // read best result
  const response = await oracle.read(taskId);
  console.log({ response });

  // read validations
  const validations = await oracle.getValidations(taskId);
  console.log({ validations });
}

main().catch(console.error);
