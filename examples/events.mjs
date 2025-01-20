// Usage: node ./view.mjs
import "dotenv/config";
import { inspect } from "util";
import { setupOracle } from "./common/index.mjs";

async function main() {
  const oracle = await setupOracle();

  const protocol = process.argv[2] ?? "swan-purchase-protocol/0.1.0";
  console.log("Viewing events for protocol:", protocol);

  const taskEvents = await oracle.getEvents({ protocol });
  console.log(
    inspect(taskEvents, {
      showHidden: true,
      depth: null,
      colors: true,
    })
  );
}

main().catch(console.error);
