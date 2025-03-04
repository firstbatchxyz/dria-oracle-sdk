export * from "./request";
export * from "./task";

/**
 * Allowed Oracle models.
 *
 * The requested model(s) can be any of the following:
 *
 * - An array of model names, such as `["gemini-1.5-pro", "gpt-4o-mini"]`.
 * - `*` for any model randomly (of the responder).
 * - `!` for the first model (of the responder).
 *
 * You can look at the available models from [this repository](https://github.com/andthattoo/ollama-workflows/blob/main/src/program/models.rs#L14).
 */
export type Models = string[] | "*" | "!";
