import type { DecentralizedStorage } from ".";
import { randomBytes } from "crypto";

/**
 * A _mock_ decentralized storage, basically a key-value store in memory.
 *
 * When a value is uploaded, a 32-byte identifier is returned that can be used to access it.
 */
export class MemoryStorage<T = unknown> implements DecentralizedStorage<T, string> {
  bytesLimit = 0;

  /** In-memory database. */
  db: Record<string, T> = {};

  isKey(key: string): string | null {
    return key in this.db ? key : null;
  }

  async get(key: string): Promise<T | null> {
    if (this.db[key]) {
      return this.db[key];
    } else {
      return null;
    }
  }

  async put(value: T): Promise<string> {
    const key = randomBytes(32).toString("hex");
    this.db[key] = value;
    return key;
  }

  describe(): string {
    return "MemoryStorage";
  }
}
