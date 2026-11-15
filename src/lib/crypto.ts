import crypto from "crypto";

export function calculateImageHash(buffer: Buffer | Uint8Array): string {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}
