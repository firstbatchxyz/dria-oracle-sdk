// Usage: node example/index.mjs
import "dotenv/config";
import { inspect } from "util";
import { setupOracle, allowIfRequired } from "./common/index.mjs";

async function main() {
  const oracle = await setupOracle();
  await allowIfRequired(oracle);

  console.log("Preparing chat request");
  const input = process.argv[2];
  if (!input) {
    throw new Error("Provide an input.");
  }
  let historyId = process.argv[3] ?? "4"; // task 4 has a basic response
  if (!historyId) {
    throw new Error("Provide a task id.");
  }
  historyId = parseInt(historyId);
  const model = "*";
  const requestObj = await oracle.request({ history_id: historyId, content: input }, model, {
    taskParameters: { difficulty: 2, numGenerations: 1, numValidations: 1 },
  });

  console.log("Making a request:", requestObj);
  const taskId = await oracle.waitRequest(requestObj.txHash);

  console.log(`Waiting for completions on task: ${taskId}`);
  await oracle.wait(taskId);

  const response = await oracle.read(taskId);
  console.log("Reading best result:");
  console.log(response);

  console.log("Validations:");
  const validations = await oracle.getValidations(taskId);
  for (const validationRaw of validations) {
    const validation = await oracle.processValidation(validationRaw);
    console.log(inspect(validation, { showHidden: true, depth: null, colors: true }));
  }
}

main().catch(console.error);
