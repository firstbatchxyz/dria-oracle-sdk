import { isHex } from "viem";
import Irys from "@irys/sdk";
import { ArweaveIrys } from "@irys/sdk/node/flavours/arweave";
import type { Storage } from ".";

/** Re-export of the requested Wallet type. */
export type JWKInterface = ConstructorParameters<typeof ArweaveIrys>[0]["key"];

/**
 * An Arweave key is considered to be an object with `arweave` field.
 * See also: <https://github.com/firstbatchxyz/dria-oracle-node> storage.
 */
export type ArweaveKey = { arweave: string };

/**
 * An Arweave wrapper for decentralized storage interface.
 *
 * This class uses the Irys SDK to interact with the Arweave network,
 * so it requires `@irys/sdk` peer dependency.
 */
export class ArweaveStorage implements Storage<Buffer, ArweaveKey> {
  /** Byte threshold, beyond which data is uploaded to Arweave. */
  public bytesLimit: number;
  /** Irys SDK instance. */
  public irys: ArweaveIrys;
  /** Base URL of the gateway. */
  public baseUrl: string = "https://gateway.irys.xyz";

  /**
   * @param key Arweave wallet object
   * @param bytesLimit number of bytes such that smaller data are not uploaded, default is 1024 bytes
   */
  constructor(key: JWKInterface, bytesLimit: number = 1024) {
    const network = "mainnet";
    const token = "arweave";

    this.irys = new Irys({
      network, // "mainnet" or "devnet"
      token, // Token used for payment and signing
      key, // Arweave wallet
    });

    this.bytesLimit = bytesLimit;
  }

  /** Return an `ArweaveKey` object if `key` is a stringified object of the form `{ arweave: string }`. */
  isKey(key: string): ArweaveKey | null {
    try {
      const obj = JSON.parse(key) as Partial<ArweaveKey>;
      if (obj.arweave && typeof obj.arweave === "string") {
        return { arweave: obj.arweave };
      }
    } catch {
      // do nothing
    }

    return null;
  }

  async get(key: ArweaveKey): Promise<Buffer | null> {
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

  async put(value: Buffer): Promise<ArweaveKey> {
    const receipt = await this.irys.upload(value);
    return { arweave: receipt.id };
  }

  async balance(): Promise<bigint> {
    const balance = await this.irys.getBalance(this.irys.address);
    return BigInt(`0x${balance.toString(16)}`); // `BigNumber` to `bigint`
  }

  describe(): string {
    return "Arweave";
  }
}
