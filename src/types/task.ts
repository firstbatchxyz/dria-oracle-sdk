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
 *
 * Adapted from [`LLMOracleTask.sol`](https://github.com/firstbatchxyz/dria-oracle-contracts/blob/master/src/LLMOracleTask.sol#L34).
 */
export interface TaskRequest {
  /** Requesting address, also responsible of the fee payment. */
  requester: Address;
  /** Protocol string, such as `dria/0.1.0`. */
  protocol: string;
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
  input: string;
  /** Allowed model names for the task. */
  models: string;
}

/** A task generation response.
 * @template O Output data type, defaults `Hex`.
 * @template M Metadata type, defaults `Hex`.
 */
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

/** A task validation for a response.
 * @template M Metadata type, defaults `Hex`.
 */
export interface TaskValidation<M = Hex> {
  /** Responding validator address. */
  validator: Address;
  /** Proof-of-Work nonce for SHA3(taskId, input, requester, responder, nonce) < difficulty. */
  nonce: bigint;
  /** Validation scores */
  scores: readonly bigint[];
  /** Optional metadata for this validation. */
  metadata: M;
}

/** A task validaiton score object.
 *
 * Within a task validation, we usually expect an array of these objects,
 * one for each generation.
 *
 * The `final_score` here is the actual score considered by the contract,
 * and `rationale` describes how the LLM decided that score.
 *
 * A score is expected to be a number between 1 and 5, inclusive; where 1 is worst and 5 is best.
 */
export type TaskValidationScores = {
  helpfulness: number;
  instruction_following: number;
  truthfulness: number;
  /** The final score given by the node. */
  final_score: number;
  rationale: string;
};
