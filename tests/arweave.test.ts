import { readFileSync } from "fs";
import { ArweaveStorage } from "../src/data/arweave";

// skip this unless you want to test explicitly
describe.only("arweave", () => {
  // example at: https://gateway.irys.xyz/jJbabD9VNDIaPTlWaCUZbdlFgbTvL1uY-4605ryuGKg
  // encoded hex key is: 8c96da6c3f5534321a3d39566825196dd94581b4ef2f5b98fb8eb4e6bcae18a8
  const data = "Hello, Arweave!";

  let key: string;
  let arweave: ArweaveStorage<string>;

  beforeAll(async () => {
    const walletPath = "./tests/secrets/testing.json";
    const wallet = JSON.parse(readFileSync(walletPath, "utf-8"));
    arweave = new ArweaveStorage(wallet, 0);
  });

  it("should get balance", async () => {
    const balance = await arweave.balance();
    expect(balance).toBeGreaterThanOrEqual(0n);
  });

  it("should upload data", async () => {
    key = await arweave.put(data);
  });

  it("should download data", async () => {
    const fetched = await arweave.get(key);
    expect(fetched).toEqual(data);
  });
});
