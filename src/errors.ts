export const DEFAULT_MAX_DECODE_DEPTH = 64;

export class TwilicDecodeError extends Error {
  readonly name = "TwilicDecodeError";
  readonly code = "DECODE_DEPTH_EXCEEDED";

  constructor(message: string) {
    super(message);
  }
}

export function decodeDepthLimitMessage(maxDepth: number): string {
  return `twilic: decode depth limit exceeded (max ${maxDepth})`;
}
