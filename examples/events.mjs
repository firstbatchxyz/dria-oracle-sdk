// Usage: node ./view.mjs
import "dotenv/config";
import { inspect } from "util";
import { setupOracle } from "./common/index.mjs";

async function main() {
  const oracle = await setupOracle();

  const protocol = process.argv[2] ?? "swan-agent-state/0.1.0";
  console.log("Viewing events for protocol:", protocol);

  const taskEvents = await oracle.getTaskEvents({ protocol, from: 20781080n });
  console.log(
    inspect(taskEvents, {
      showHidden: true,
      depth: null,
      colors: true,
    })
  );
}

main().catch(console.error);
