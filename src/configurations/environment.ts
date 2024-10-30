import type { Address, Hex } from "viem";
import { isAddress, isHex } from "viem";

/**
 * Reads an environment variable (i.e. `process.env[name]`), ensuring it is defined.
 * @param name name of the environment variable
 * @param def optional default value
 * @returns value, ensured to be defined
 */
export function envDefined(name: string, def?: string): string {
  const value = process.env[name] ?? def;
  if (value === undefined) {
    throw new Error(`${name} is missing.`);
  }
  return value;
}

/**
 * Reads an environment variable, ensuring it is defined & is a valid address.
 * @param name name of the environment variable
 * @param def optional default value
 * @returns value, ensured to be a valid address
 */
export function envAddress(name: string, def?: string): Address {
  const address = envDefined(name, def);
  if (!isAddress(address)) {
    throw new Error(`${address} is not a valid address`);
  }
  return address;
}

/**
 * Reads an environment variable, ensuring it is defined & is a valid hexadecimal string.
 * @param name name of the environment variable
 * @param def optional default value
 * @returns value, ensured to be a valid hexadecimal
 */
export function envHex(name: string, def?: string): Hex {
  const hex = envDefined(name, def);
  if (!isHex(hex)) {
    throw new Error(`${hex} is not a valid hexadecimal`);
  }
  return hex;
}

/**
 * Reads an environment variable (i.e. `process.env[name]`), ensuring it is defined & is a valid number.
 * @param name name of the environment variable
 * @param def optional default value
 * @returns value, ensured to be a valid number
 */
export function envNumber(name: string, def?: number): number {
  const value = envDefined(name, def?.toString());
  try {
    return Number(value);
  } catch (err) {
    throw new Error(`${name} is not a number: ${err}`);
  }
}
