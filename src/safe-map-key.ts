import type { RecurramValue } from "./types.js";

export function isSafeMapKey(key: string): boolean {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}

export function createDecodedMap(): Record<string, RecurramValue> {
  return Object.create(null) as Record<string, RecurramValue>;
}

export function setDecodedMapEntry(
  out: Record<string, RecurramValue>,
  key: string,
  value: RecurramValue,
): void {
  if (isSafeMapKey(key)) {
    out[key] = value;
  }
}
