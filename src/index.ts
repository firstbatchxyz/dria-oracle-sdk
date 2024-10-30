import { logger } from "./utilities";

async function main() {
  logger.info("Hello, world!");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    process.exit(1);
  });
