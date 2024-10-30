import config from "../configurations";
import { DecentralizedStorage } from "../data";
import { bytesToString, stringToBytes, type Hex } from "viem";

/**
 * Given a string, converts it to a `Hex` string and then:
 * - If `storage` is given, uploads the string to the storage if its large enough and returns the key
 * - Otherwise, returns the `Hex` string, equivalent to a `bytes` type in Solidity.
 *
 * @param bytes input string
 * @param storage decentralized storage, optional
 * @returns a `Hex` string, with 0x prefix
 */
export async function stringToContractBytes(
  input: string,
  storage?: DecentralizedStorage<string, string>
): Promise<Hex> {
  const inputBytes = stringToBytes(input);
  if (storage && inputBytes.length > config.ARWEAVE_BYTES_LIMIT) {
    const key = await storage.put(input);
    // we have to encode the key again, so that it when decoded it is a string of 64 character
    return `0x${Buffer.from(stringToBytes(key)).toString("hex")}`;
  } else {
    return `0x${Buffer.from(inputBytes).toString("hex")}`;
  }
}

/**
 * Given a `bytes` Solidity type, converts it to a string:
 * - If `storage` is given, downloads the string from storage if it is matching a key.
 * - Otherwise, converts the bytes to a string.
 *
 * @param input bytes
 * @param storage decentralized storage, optional
 * @returns parsed string
 */
export async function contractBytesToString(
  input: Hex,
  storage?: DecentralizedStorage<string, string>
): Promise<string> {
  const inputStr = bytesToString(Buffer.from(input.slice(2), "hex"));
  if (storage && storage.isKey(inputStr)) {
    return (await storage.get(input)) ?? "";
  } else {
    return inputStr;
  }
}
