import { readFileSync } from "fs";
import { ArweaveStorageKey, ArweaveStorage } from "../src/storage/arweave";

// skip this unless you want to test explicitly
describe.only("arweave", () => {
  const data = Buffer.from('"Hello, Arweave!"');

  let key: ArweaveStorageKey;
  let arweave: ArweaveStorage;

  beforeAll(async () => {
    const walletPath = "./tests/secrets/testing.json";
    const wallet = JSON.parse(readFileSync(walletPath, "utf-8"));
    arweave = new ArweaveStorage();
    arweave.init(wallet, 0);
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

  it("should return null for non-existent data", async () => {
    const key = { arweave: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" };
    expect(await arweave.get(key)).toEqual(null);
  });

  it("should download existing data", async () => {
    const key = { arweave: "jJbabD9VNDIaPTlWaCUZbdlFgbTvL1uY-4605ryuGKg" };
    const fetched = await arweave.get(key);
    expect(fetched).toEqual(data);
  });
});
