import { initBackend, requireBackend } from "./backend.js";
import { encodeFast, tryDecodeFast } from "./fast-codec.js";
import {
  serializeCompact,
  serializeCompactBatch,
  serializeSessionOptions,
  serializeValue,
} from "./transport.js";
import type { InitOptions, TwilicValue, SessionOptions } from "./types.js";
import type { RuntimeKind, RuntimeSessionEncoder } from "./runtime/types.js";

export type {
  InitOptions,
  TwilicValue,
  Schema,
  SchemaField,
  SessionOptions,
  UnknownReferencePolicy,
} from "./types.js";

type EncodeImpl = (value: TwilicValue) => Uint8Array;
type DecodeImpl = (bytes: Uint8Array) => TwilicValue;

let encodeImpl: EncodeImpl | null = null;
let decodeImpl: DecodeImpl | null = null;

export async function init(options: InitOptions = {}): Promise<RuntimeKind> {
  const kind = await initBackend(options);
  encodeImpl = null;
  decodeImpl = null;
  return kind;
}

export function encode(value: TwilicValue): Uint8Array {
  if (!encodeImpl) {
    requireBackend();
    encodeImpl = (input) => encodeFast(input);
  }
  return encodeImpl(value);
}

export function decode(bytes: Uint8Array): TwilicValue {
  if (!decodeImpl) {
    const backend = requireBackend();
    if (backend.decodeNative) {
      decodeImpl = (input) => backend.decodeNative!(input) as TwilicValue;
    } else {
      decodeImpl = (input) => {
        const decoded = tryDecodeFast(input);
        if (decoded === undefined) {
          throw new Error("twilic: failed to decode v2 payload");
        }
        return decoded;
      };
    }
  }
  return decodeImpl(bytes);
}

export function createSessionEncoder(
  options: SessionOptions = {},
): SessionEncoder {
  const raw = requireBackend().createSessionEncoder(
    serializeSessionOptions(options),
  );
  return new SessionEncoder(raw);
}

export class SessionEncoder {
  readonly #inner: RuntimeSessionEncoder;

  constructor(inner: RuntimeSessionEncoder) {
    this.#inner = inner;
  }

  encode(value: TwilicValue): Uint8Array {
    return this.#inner.encodeCompactJson(serializeCompact(value));
  }

  encodeBatch(values: TwilicValue[]): Uint8Array {
    return this.#inner.encodeBatchCompactJson(serializeCompactBatch(values));
  }

  encodePatch(value: TwilicValue): Uint8Array {
    return this.#inner.encodePatchTransportJson(serializeValue(value));
  }

  encodeMicroBatch(values: TwilicValue[]): Uint8Array {
    return this.#inner.encodeMicroBatchCompactJson(
      serializeCompactBatch(values),
    );
  }

  reset(): void {
    this.#inner.reset();
  }
}
