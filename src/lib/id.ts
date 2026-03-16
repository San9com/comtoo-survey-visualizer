export function uid(prefix = "id") {
  // Stable enough for client-only state (no backend IDs required).
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

