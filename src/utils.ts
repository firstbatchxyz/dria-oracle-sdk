import { bytesToString, fromHex, type Hex, stringToBytes, toBytes, toHex } from "viem";
import { DecentralizedStorage } from "./storage";

/**
 * Given a string, converts it to a `Hex` string.
 *
 * First, the string is converted to a `Uint8Array`.
 * - If `storage` is given and the bytearray is large enough, it is uploaded to the storage and its key in `Hex` is returned.
 * - Otherwise, the bytearray is converted to a `Hex` string.
 *
 * If storage is being used, make sure it can upload the data, e.g. `ArweaveStorage` must be `init`ed.
 *
 * @param bytes input string
 * @param storage decentralized storage, optional
 * @template K storage key type, inferred as `unknown` if storage is `undefined`
 * @returns a `Hex` string, with 0x prefix
 */
export async function stringToContractBytesWithStorage<K>(
  input: string,
  storage?: DecentralizedStorage<Buffer, K>
): Promise<Hex> {
  const inputBytes: Uint8Array = stringToBytes(input);

  if (storage && inputBytes.length > storage.bytesLimit) {
    const key = await storage.put(Buffer.from(inputBytes));
    return `0x${Buffer.from(JSON.stringify(key)).toString("hex")}`;
  } else {
    return `0x${Buffer.from(inputBytes).toString("hex")}`;
  }
}

/**
 * Given a `bytes` Solidity type, converts it to a string.
 *
 * If `storage` is given, the resulting string is try-parsed as a key, and if it is a key,
 * the actual value is fetched from the storage.
 *
 * If no value is found at the storage, it returns `null`.
 *
 * @param input bytes
 * @param storage decentralized storage, optional
 * @template K storage key type, inferred as `unknown` if storage is `undefined`
 * @returns parsed string
 */
export async function contractBytesToStringWithStorage<K>(
  input: Hex,
  storage?: DecentralizedStorage<Buffer, K>
): Promise<string | null> {
  const inputStr: string = bytesToString(Buffer.from(input.slice(2), "hex"));
  if (storage) {
    // check if input is a key
    const key = storage.isKey(inputStr);
    if (key == null) {
      return inputStr;
    }

    // fetch data
    const data = await storage.get(key);
    if (data == null) {
      return null;
    }
    return data.toString();
  } else {
    return inputStr;
  }
}

/**
 * Encodes a string into a `bytes32` compatible `Hex`.
 * @param input a string
 * @returns string encoded to `bytes32`
 */
export function stringToBytes32(input: string): Hex {
  return toHex(input, { size: 32 });
}

/**
 * Decodes a `bytes32` compatible `Hex` to a string.
 * @param input `bytes32` compatible `Hex`
 * @returns decoded string
 */
export function bytes32ToString(input: Hex): string {
  return fromHex(input, { size: 32, to: "string" });
}
