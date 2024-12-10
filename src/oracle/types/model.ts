/** Allowed models for type-safety. */
const Models = [
  /// OLLAMA ///
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
  "llama3.1:8b-text-q4_K_M",
  "llama3.1:8b-text-q8_0",
  "llama3.1:70b-instruct-q4_0",
  "llama3.1:70b-instruct-q8_0",
  "llama3.1:70b-text-q4_0",
  "llama3.2:1b",
  "llama3.2:1b-text-q4_K_M",
  "llama3.2:3b",

  "qwen2.5:7b-instruct-q5_0",
  "qwen2.5:7b-instruct-fp16",
  "qwen2.5:32b-instruct-fp16",
  "qwen2.5-coder:1.5b",
  "qwen2.5-coder:7b-instruct",
  "qwen2.5-coder:7b-instruct-q8_0",
  "qwen2.5-coder:7b-instruct-fp16",
  "qwq",

  "deepseek-coder:6.7b",

  "mixtral:8x7b",

  /// OPENAI ///
  "gpt-4-turbo",
  "gpt-4o",
  "gpt-4o-mini",

  "o1-mini",
  "o1-preview",

  /// GEMINI ///
  "gemini-1.0-pro",

  "gemini-1.5-pro",
  "gemini-1.5-pro-exp-0827",
  "gemini-1.5-flash",

  "gemma-2-2b-it",
  "gemma-2-9b-it",
  "gemma-2-27b-it",

  /// OPENROUTER
  "meta-llama/llama-3.1-8b-instruct",
  "meta-llama/llama-3.1-70b-instruct",
  "meta-llama/llama-3.1-405b-instruct",
  "meta-llama/llama-3.1-70b-instruct:free",

  "anthropic/claude-3.5-sonnet:beta",
  "anthropic/claude-3-5-haiku-20241022:beta",

  "qwen/qwen-2.5-72b-instruct",
  "qwen/qwen-2.5-7b-instruct",
  "qwen/qwen-2.5-coder-32b-instruct",
  "qwen/qwq-32b-preview",

  "deepseek/deepseek-chat",
  "nousresearch/hermes-3-llama-3.1-405b",
  "nvidia/llama-3.1-nemotron-70b-instruct",
] as const;

export type Models = (typeof Models)[number];

/**
 * Allowed request models.
 *
 * - An array of `Models` strings.
 * - `*` for any model randomly (of the responder).
 * - `!` for the first model (of the responder).
 */
export type RequestModels = (typeof Models)[number][] | "*" | "!";
