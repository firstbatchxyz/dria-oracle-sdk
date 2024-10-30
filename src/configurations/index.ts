import "dotenv/config";
import { parseEther, type Address, type Hex } from "viem";
import type { Level } from "pino";
import { envAddress, envDefined, envNumber, envHex } from "./environment";
import type { PathLike } from "fs";

const Environment = ["development", "staging", "production", "test"] as const;
const environment = Environment.find((s) => s == process.env.NODE_ENV) ?? "development";

const LogLevel: Level[] = ["debug", "info", "warn", "error", "fatal", "trace"] as const;
const logLevel = LogLevel.find((s) => s == process.env.LOG_LEVEL);

/// for latest addresses see: https://github.com/firstbatchxyz/dria-contracts/blob/master/deployments/base-sepolia.json
const DEFAULT_COORDINATOR_ADDRESS: Address = "0x362fDBB20191ba22d53bF3b09646AA387Cd6dF75";
const DEFAULT_PRIVATE_KEY: Hex = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Anvil account #0
const DEFAULT_ARWEAVE_BYTES_LIMIT = 1024; // 1KB
const DEFAULT_GAS_WARNING_THRESHOLD = "0.00005"; // approx tx fee of Base Sepolia

const config: Readonly<{
  /** Node environment. */
  NODE_ENV: (typeof Environment)[number];
  /** Logger configurations. */
  LOG_LEVEL: Level;
  /** Wallet secret key. */
  PRIVATE_KEY: Hex;
  /** RPC URL for the blockchain connection. */
  RPC_URL: string;
  /** Coordinator contract address. */
  COORDINATOR_ADDRESS: Address;
  /** Arweave wallet path. */
  ARWEAVE_PATH: PathLike | undefined;
  /** Maximum number of bytes, such that larger bytes are uplaoded to Arweave instead. (default: 1024) */
  ARWEAVE_BYTES_LIMIT: number;
  /** Gas (in Ethers) such that below this point will print a warning. (default: 0.000005) */
  GAS_WARNING_THRESHOLD: bigint;
}> = {
  test: {
    NODE_ENV: environment,
    LOG_LEVEL: logLevel ?? "debug",
    PRIVATE_KEY: DEFAULT_PRIVATE_KEY,
    COORDINATOR_ADDRESS: DEFAULT_COORDINATOR_ADDRESS,
    ARWEAVE_BYTES_LIMIT: DEFAULT_ARWEAVE_BYTES_LIMIT,
    ARWEAVE_PATH: process.env.ARWEAVE_PATH,
    GAS_WARNING_THRESHOLD: parseEther(DEFAULT_GAS_WARNING_THRESHOLD),
    RPC_URL: envDefined("RPC_URL"),
  } as const,
  development: {
    NODE_ENV: environment,
    LOG_LEVEL: logLevel ?? "debug",
    PRIVATE_KEY: envHex("PRIVATE_KEY", DEFAULT_PRIVATE_KEY),
    COORDINATOR_ADDRESS: envAddress("COORDINATOR_ADDRESS", DEFAULT_COORDINATOR_ADDRESS),
    ARWEAVE_BYTES_LIMIT: envNumber("ARWEAVE_BYTES_LIMIT", DEFAULT_ARWEAVE_BYTES_LIMIT),
    ARWEAVE_PATH: process.env.ARWEAVE_PATH,
    GAS_WARNING_THRESHOLD: parseEther(envDefined("GAS_WARNING_THRESHOLD", DEFAULT_GAS_WARNING_THRESHOLD)),
    RPC_URL: envDefined("RPC_URL"),
  } as const,
  staging: {
    NODE_ENV: environment,
    LOG_LEVEL: logLevel ?? "info",
    PRIVATE_KEY: envHex("PRIVATE_KEY"),
    COORDINATOR_ADDRESS: envAddress("COORDINATOR_ADDRESS"),
    ARWEAVE_BYTES_LIMIT: envNumber("ARWEAVE_BYTES_LIMIT", DEFAULT_ARWEAVE_BYTES_LIMIT),
    ARWEAVE_PATH: process.env.ARWEAVE_PATH,
    GAS_WARNING_THRESHOLD: parseEther(envDefined("GAS_WARNING_THRESHOLD", DEFAULT_GAS_WARNING_THRESHOLD)),
    RPC_URL: envDefined("RPC_URL"),
  } as const,
  production: {
    NODE_ENV: environment,
    LOG_LEVEL: logLevel ?? "info",
    PRIVATE_KEY: envHex("PRIVATE_KEY"),
    COORDINATOR_ADDRESS: envAddress("COORDINATOR_ADDRESS"),
    ARWEAVE_BYTES_LIMIT: envNumber("ARWEAVE_BYTES_LIMIT", DEFAULT_ARWEAVE_BYTES_LIMIT),
    ARWEAVE_PATH: process.env.ARWEAVE_PATH,
    GAS_WARNING_THRESHOLD: parseEther(envDefined("GAS_WARNING_THRESHOLD", DEFAULT_GAS_WARNING_THRESHOLD)),
    RPC_URL: envDefined("RPC_URL"),
  } as const,
}[environment];

export default config;
