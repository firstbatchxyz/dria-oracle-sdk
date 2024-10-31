import { isHex } from "viem";
import Irys from "@irys/sdk";
import { ArweaveIrys } from "@irys/sdk/node/flavours/arweave";
import type { Storage } from "./";

/** Re-export of the requested Wallet type. */
export type JWKInterface = ConstructorParameters<typeof ArweaveIrys>[0]["key"];

/**
 * An Arweave wrapper for decentralized storage interface.
 *
 * This class uses the Irys SDK to interact with the Arweave network.
 */
export class ArweaveStorage<T> implements Storage<T, string> {
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

  isKey(key: string): boolean {
    // 64 hex characters, add 0x to use `isHex` of viem
    return isHex(`0x${key}`, { strict: true }) && key.length == 64;
  }

  async get(key: string): Promise<T | null> {
    // ensure that it is a valid key
    if (!this.isKey(key)) {
      // logger.error(`Invalid key: ${key}, expected hex string.`);
      return null;
    }

    // convert to base64url
    const keyb64 = Buffer.from(key, "hex").toString("base64url");
    const url = `${this.baseUrl}/${keyb64}`;
    // logger.debug(`Fetching: ${url}`);

    const res = await fetch(url);
    if (!res.ok) {
      // logger.error(`Failed to fetch ${url} (Status: ${res.statusText})`);
      return null;
    } else {
      return res.json() as Promise<T>;
    }
  }

  async put(value: T): Promise<string> {
    const valueBytes = Buffer.from(JSON.stringify(value));
    const receipt = await this.irys.upload(valueBytes);
    // logger.debug(`Data uploaded to Arweave: ${this.baseUrl}/${receipt.id}`);

    return Buffer.from(receipt.id, "base64url").toString("hex");
  }

  async balance(): Promise<bigint> {
    const balance = await this.irys.getBalance(this.irys.address);

    // `BigNumber` to `bigint`
    return BigInt(`0x${balance.toString(16)}`);
  }

  describe(): string {
    return "Arweave";
  }
}
