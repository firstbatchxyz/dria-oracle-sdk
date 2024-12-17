/**
 * A key-value storage that can be used to store arbitrary data in a decentralized-storage fashion.
 * Most often, the `T` is a `Buffer` and `K` is anything custom defined.
 *
 * @template T The type of the data to store.
 * @template K The type of the key to use.
 */
export interface DecentralizedStorage<T = unknown, K = string> {
  /** The number of bytes, after which storage shall be considered. */
  bytesLimit: number;

  /**
   * @param key The key to get the value for.
   * @returns The value at the key, or `null` if it does not exist.
   */
  get(key: K): Promise<T | null>;

  /**
   * Puts a value to the storage, returns the key.
   * @param value The value to put in the storage.
   * @returns The key that can be used to retrieve the value.
   */
  put(value: T): Promise<K>;

  /**
   * @param key The key to check.
   * @returns Whether the key if its valid, or `null` if its invalid.
   */
  isKey(key: string): K | null;

  /** Returns the name of the storage. */
  describe(): string;
}
