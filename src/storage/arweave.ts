import Irys from "@irys/sdk";
import { ArweaveIrys } from "@irys/sdk/node/flavours/arweave";
import type { DecentralizedStorage } from ".";

/** Re-export of the requested Wallet type. */
export type JWKInterface = ConstructorParameters<typeof ArweaveIrys>[0]["key"];

/**
 * An Arweave key is considered to be an object with `arweave` field.
 * See also: <https://github.com/firstbatchxyz/dria-oracle-node> storage.
 */
export type ArweaveStorageKey = { arweave: string };

/**
 * An Arweave wrapper for decentralized storage interface.
 *
 * This class uses the Irys SDK to interact with the Arweave network,
 * for `put` and `balance` commands ,so it requires `@irys/sdk` peer dependency for those.
 */
export class ArweaveStorage implements DecentralizedStorage<Buffer, ArweaveStorageKey> {
  /** Byte threshold, beyond which data is uploaded to Arweave. */
  public bytesLimit: number = 1024;
  /** Irys SDK instance. */
  public irys?: ArweaveIrys;
  /** Base URL of the gateway. */
  public baseUrl: string = "https://gateway.irys.xyz";

  /**
   * Initializes the Arweave storage with the given key.
   * @param key Arweave wallet object.
   * @param bytesLimit Number of bytes such that smaller data are not uploaded, default is 1024 bytes.
   */
  init(key: JWKInterface, bytesLimit: number = 1024) {
    const network = "mainnet";
    const token = "arweave";

    this.irys = new Irys({
      network, // "mainnet" or "devnet"
      token, // Token used for payment and signing
      key, // Arweave wallet
    });

    this.bytesLimit = bytesLimit;
  }

  /** Return an `ArweaveKey` object if `key` is a stringified object of the form `{ arweave: string }`.
   *
   * @example // a valid key
   * { arweave: "Zg6CZYfxXCWYnCuKEpnZCYfy7ghit1_v4-BCe53iWuA" }
   */
  isKey(key: string): ArweaveStorageKey | null {
    try {
      const obj = JSON.parse(key) as Partial<ArweaveStorageKey>;
      if (obj.arweave && typeof obj.arweave === "string") {
        return { arweave: obj.arweave };
      }
    } catch {
      // do nothing
    }

    return null;
  }

  async get(key: ArweaveStorageKey): Promise<Buffer | null> {
    const url = `${this.baseUrl}/${key.arweave}`;

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) {
        // data not found
        return null;
      } else {
        throw new Error(`Failed to fetch data: ${await res.text()}`);
      }
    } else {
      return Buffer.from(await res.arrayBuffer());
    }
  }

  /**
   * Uploads the given value to Arweave and returns the key.
   *
   * _Requires `init` to have been called._
   *
   * @param value Value to upload.
   * @returns Key to access the value.
   */
  async put(value: Buffer): Promise<ArweaveStorageKey> {
    if (!this.irys) {
      throw new Error("Arweave client not initialized");
    }
    const receipt = await this.irys.upload(value);
    return { arweave: receipt.id };
  }

  /**
   * Returns the balance of the Arweave wallet.
   *
   * _Requires `init` to have been called._
   *
   * @returns Balance in `bigint`.
   */
  async balance(): Promise<bigint> {
    if (!this.irys) {
      throw new Error("Arweave client not initialized");
    }
    const balance = await this.irys.getBalance(this.irys.address);
    return BigInt(`0x${balance.toString(16)}`); // `BigNumber` to `bigint`
  }

  describe(): string {
    return "Arweave";
  }
}
