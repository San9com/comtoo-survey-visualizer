export async function loadSampleCsv(path = "/sample-comtoo.csv") {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load sample (${res.status}).`);
  const text = await res.text();
  return { name: path.split("/").pop() ?? "sample.csv", text };
}

