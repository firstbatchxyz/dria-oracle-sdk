import { readFileSync } from "fs";
import { ArweaveStorageKey, ArweaveStorage } from "../src/storage/arweave";

// skip this unless you want to test explicitly
describe.only("arweave", () => {
  const data = Buffer.from('"Hello, Arweave!"');

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

  it("should upload & download plain string data", async () => {
    const data = "Hello, Arweave!";

    const key = await arweave.put(Buffer.from(data));
    const fetched = await arweave.get(key);
    expect(fetched).not.toBeNull();
    expect(fetched!.toString()).toEqual(data);
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

  it("should upload & download JSON data", async () => {
    const data = {
      foo: "bar",
      age: 18,
      human: false,
    };

    const key = await arweave.put(Buffer.from(JSON.stringify(data)));
    const fetched = await arweave.get(key);
    expect(fetched).not.toBeNull();
    expect(JSON.parse(fetched!.toString())).toEqual(data);
  });
});
