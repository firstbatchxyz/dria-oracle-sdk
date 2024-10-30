import { createPublicClient, createWalletClient, formatEther, http } from "viem";
import { Oracle } from "./oracle";
import { logger } from "./utilities";
import config from "./configurations";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

async function main() {
  const walletClient = createWalletClient({
    account: privateKeyToAccount(config.PRIVATE_KEY),
    chain: baseSepolia,
    transport: http(),
  });
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  logger.info("Initializing Oracle client...");
  const oracle = new Oracle({
    public: publicClient,
    wallet: walletClient,
  });
  await oracle.init(config.COORDINATOR_ADDRESS);
  logger.info("Oracle client initialized.");

  logger.info("Checking approvals.");
  const allowance = await oracle.allowance();
  logger.info("Allowance: " + formatEther(allowance));

  logger.info("Requesting task...");
  // const taskId = await oracle.request("What is 2+2?", "*");
  const taskId = 14175n;
  logger.info("Task requested with id: " + taskId);

  // logger.info("Waiting for task completion...");
  // await oracle.wait(taskId);

  logger.info("Reading task request...");
  const request = await oracle.read(taskId);
  logger.info(request.output);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.exit(1);
  });
