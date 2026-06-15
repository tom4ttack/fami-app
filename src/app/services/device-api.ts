export const API_BASE = "http://10.10.10.135:8000";

export type DiagnosisResult = {
  disease: string;
  disease_en: string;
  accuracy: number;
  area: number;
  treat: string;
  tone: "danger" | "warn" | "safe";
};

/** Returns the latest-image URL with a cache-busting timestamp. */
export function latestImageUrl(ts: number): string {
  return `${API_BASE}/latest-image?t=${ts}`;
}

export async function triggerCapture(): Promise<void> {
  await fetch(`${API_BASE}/capture`, { method: "POST" });
}

export async function getDiagnosis(): Promise<DiagnosisResult> {
  const res = await fetch(`${API_BASE}/diagnosis`);
  if (!res.ok) throw new Error(`diagnosis ${res.status}`);
  return res.json();
}
