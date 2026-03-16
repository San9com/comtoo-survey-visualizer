const STOPWORDS_EN = new Set([
  "the","a","an","and","or","but","if","then","else","when","while","for","to","of","in","on","at","by","from",
  "is","are","was","were","be","been","being","it","this","that","these","those","i","we","you","they","he","she",
  "my","our","your","their","his","her","as","with","without","not","no","yes","do","does","did","done",
]);

const STOPWORDS_NL = new Set([
  "de","het","een","en","of","maar","als","dan","anders","wanneer","terwijl","voor","om","te","van","in","op","bij","uit",
  "is","zijn","was","waren","ben","bent","we","wij","jij","je","u","hij","zij","ze","ik","mijn","onze","jouw","hun",
  "niet","geen","ja","nee","wel","ook","nog","naar","met","zonder","dat","dit","die","deze","zoals","door",
]);

export function normalizeText(input: string) {
  return (input ?? "")
    .toLowerCase()
    .replace(/\r/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9\u00C0-\u024f\s'-]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(input: string) {
  const t = normalizeText(input);
  if (!t) return [];
  const parts = t.split(" ");
  const tokens: string[] = [];
  for (const p of parts) {
    const s = p.trim();
    if (!s) continue;
    if (s.length <= 2) continue;
    if (STOPWORDS_EN.has(s) || STOPWORDS_NL.has(s)) continue;
    tokens.push(s);
  }
  return tokens;
}

