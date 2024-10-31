import type { Address, Hex } from "viem";

/**
 * Task status.
 *
 * - `None`: Task has not been created yet. (default)
 * - `PendingGeneration`: Task is waiting for Oracle generation responses.
 * - `PendingValidation`: Task is waiting for validation by validator Oracles.
 * - `Completed`: The task has been completed.
 *
 * With validation, the flow is `None -> PendingGeneration -> PendingValidation -> Completed`.
 *
 * Without validation, the flow is `None -> PendingGeneration -> Completed`.
 */
export enum TaskStatus {
  None,
  PendingGeneration,
  PendingValidation,
  Completed,
}

/** Collection of oracle task-related parameters. */
export interface TaskParameters {
  /** Difficulty of the task. */
  difficulty: number;
  /** Number of generations. */
  numGenerations: number;
  /**  Number of validations. */
  numValidations: number;
}

/**
 * A task request for LLM generation.
 * Fees are stored here as well in case fee changes occur within the duration of a task.
 */
export interface TaskRequest {
  /** Requesting address, also responsible of the fee payment. */
  requester: Address;
  /** Protocol string, such as `dria/0.1.0`. */
  protocol: Hex;
  /** Task parameters, e.g. difficulty and number of generations & validations. */
  parameters: TaskParameters;
  /** Task status. */
  status: TaskStatus;
  /** Fee paid to each generator per generation. */
  generatorFee: bigint;
  /** Fee paid to each validator per validated generation. */
  validatorFee: bigint;
  /** Fee paid to the platform */
  platformFee: bigint;
  /** Input data for the task, usually a human-readable string. */
  input: Hex;
  /** Allowed model names for the task. */
  models: Hex;
}

export interface TaskResponse {
  /** Responding Oracle address. */
  responder: Address;
  /** Proof-of-Work nonce for SHA3(taskId, input, requester, responder, nonce) < difficulty. */
  nonce: bigint;
  /** Final validation score assigned by validators, stays 0 if there is no validation. */
  score: bigint;
  /** Output data for the task, usually the direct output of LLM. */
  output: Hex;
  /** Optional metadata for this generation. */
  metadata: Hex;
}

export interface TaskResponseProcessed {
  /** Responding Oracle address. */
  responder: Address;
  /** Proof-of-Work nonce for SHA3(taskId, input, requester, responder, nonce) < difficulty. */
  nonce: bigint;
  /** Final validation score assigned by validators, stays 0 if there is no validation. */
  score: bigint;
  /** Processed output. */
  output: string;
  /** Processed metadata. */
  metadata: string;
}

/** A task validation for a response. */
export interface TaskValidation {
  /** Responding validator address. */
  validator: Address;
  /** Proof-of-Work nonce for SHA3(taskId, input, requester, responder, nonce) < difficulty. */
  nonce: bigint;
  /** Validation scores */
  scores: bigint[];
  /** Optional metadata for this validation. */
  metadata: Hex;
}

/** Allowed models for type-safety. */
const Models = [
  "finalend/hermes-3-llama-3.1:8b-q8_0",

  "phi3:14b-medium-4k-instruct-q4_1",
  "phi3:14b-medium-128k-instruct-q4_1",

  "phi3.5:3.8b",
  "phi3.5:3.8b-mini-instruct-fp16",

  "gemma2:9b-instruct-q8_0",
  "gemma2:9b-instruct-fp16",

  "llama3.1:latest",
  "llama3.1:8b-instruct-q8_0",
  "llama3.1:8b-instruct-fp16",
  "llama3.1:70b-instruct-q4_0",
  "llama3.1:70b-instruct-q8_0",
  "llama3.2:1b",
  "llama3.2:3b",

  "qwen2.5:7b-instruct-q5_0",
  "qwen2.5:7b-instruct-fp16",
  "qwen2.5:32b-instruct-fp16",
  "qwen2.5-coder:1.5b",
  "qwen2.5-coder:7b-instruct",
  "qwen2.5-coder:7b-instruct-q8_0",
  "qwen2.5-coder:7b-instruct-fp16",

  "deepseek-coder:6.7b",

  "mixtral:8x7b",
  "gpt-4-turbo",
  "gpt-4o",
  "gpt-4o-mini",

  "o1-mini",
  "o1-preview",

  "gemini-1.0-pro",

  "gemini-1.5-pro",
  "gemini-1.5-pro-exp-0827",
  "gemini-1.5-flash",

  "gemma-2-2b-it",
  "gemma-2-9b-it",
  "gemma-2-27b-it",
] as const;

export type Models = (typeof Models)[number];

/**
 * Allowed request models for type-safety.
 *
 * - An array of `Models` strings.
 * - `*` for any model randomly (of the responder).
 * - `!` for the first model (of the responder).
 */
export type RequestModels = (typeof Models)[number][] | "*" | "!";
