export function hashString(input: string) {
  // Deterministic, tiny hash for stable IDs in a local-first app.
  // Not cryptographic; purpose is to keep stable identifiers across reloads.
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return (h >>> 0).toString(16);
}

