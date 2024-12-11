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
