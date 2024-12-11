import type { RequestModels } from "./model";
import type { TaskParameters } from "./task";

/** A chat history entry. */
export type ChatHistoryResponse = {
  /** Role, usually `user`, `assistant` or `system`. */
  role: string;
  /** Message content. */
  content: string;
};

/** A request with chat history. */
export type ChatHistoryRequest = {
  // FIXME: rename to `historyId` when Oracle is updated to handle them
  /** Task Id of which the output will act like history. */
  history_id: number | bigint;
  /** Message content. */
  content: string;
};

/** Return type for `request` function. */
export type RequestReturnType = {
  txHash: `0x${string}`;
  protocol: string;
  input: string;
  models: RequestModels;
  taskParameters: { difficulty: number; numGenerations: number; numValidations: number };
};

/** Optional arguments for `request`. */
export type RequestOpts = {
  taskParameters?: Partial<TaskParameters>;
  protocol?: string;
};
