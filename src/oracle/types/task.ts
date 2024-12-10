import type { Address, Hex } from "viem";

/**
 * Task status as it appears within the contract.
 *
 * - `None`: Task has not been created yet. (default)
 * - `PendingGeneration`: Task is waiting for Oracle generation responses.
 * - `PendingValidation`: Task is waiting for validation by validator Oracles.
 * - `Completed`: The task has been completed.
 *
 * There are two scenarios:
 * - With validation, the flow is `None -> PendingGeneration -> PendingValidation -> Completed`.
 * - Without validation, the flow is `None -> PendingGeneration -> Completed`.
 *
 * Note that this type is compatible with the contract type (number).
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

export interface TaskResponse<O = Hex, M = Hex> {
  /** Responding Oracle address. */
  responder: Address;
  /** Proof-of-Work nonce for SHA3(taskId, input, requester, responder, nonce) < difficulty. */
  nonce: bigint;
  /** Final validation score assigned by validators, stays 0 if there is no validation. */
  score: bigint;
  /** Output data for the task, usually the direct output of LLM. */
  output: O;
  /** Optional metadata for this generation. */
  metadata: M;
}

/** A task validation for a response. */
export interface TaskValidation {
  /** Responding validator address. */
  validator: Address;
  /** Proof-of-Work nonce for SHA3(taskId, input, requester, responder, nonce) < difficulty. */
  nonce: bigint;
  /** Validation scores */
  scores: readonly bigint[];
  /** Optional metadata for this validation. */
  metadata: Hex;
}
