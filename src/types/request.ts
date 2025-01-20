import type { Hex } from "viem";
import type { OracleModels } from "./model";
import type { TaskParameters, TaskStatus } from "./task";

/** A chat history entry. */
export type ChatHistoryResponse = {
  /** Role, usually `user`, `assistant` or `system`. */
  role: string;
  /** Message content. */
  content: string;
};

/** A request with chat history. */
export type ChatHistoryRequest = {
  /** Task id of which the output will act like history. */
  history_id: number | bigint;
  /** Message content. */
  content: string;
};

/** Return type for `request` function. */
export type NewRequestReturnType = {
  txHash: Hex;
  protocol: string;
  input: string;
  models: OracleModels;
  taskParameters: TaskParameters;
};

/** Optional arguments for `request`. */
export type TaskRequestOptions = {
  taskParameters?: Partial<TaskParameters>;
  protocol?: string;
};
