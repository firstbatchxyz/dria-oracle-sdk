// Usage: node ./view.mjs
import "dotenv/config";
import { inspect } from "util";
import { setupOracle } from "./common/index.mjs";

async function main() {
  const oracle = await setupOracle();

  // task id from command line
  const taskId = BigInt(process.argv[2] ?? 1);
  console.log("Viewing task:", taskId);

  // TODO: add request here

  console.log("\nGenerations:");
  const responses = await oracle.getResponses(taskId);
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

  console.log("\nValidations:");
  const validations = await oracle.getValidations(taskId);
  if (!validations.length) {
    console.log("No validations made.");
  } else {
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

  console.log("\nBest Response:");
  const bestResponse = await oracle.getBestResponse(taskId);
  console.log(
    inspect(bestResponse, {
      showHidden: true,
      depth: null,
      colors: true,
    })
  );
}

main().catch(console.error);
