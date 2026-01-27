import process from "process";

// Ensure `process` exists in the renderer (used by some CJS/browserified libs)
if (typeof globalThis.process === "undefined") {
  globalThis.process = process;
}

// Provide `window.global` if some libs expect it
if (typeof window !== "undefined" && typeof window.global === "undefined") {
  window.global = globalThis;
}
