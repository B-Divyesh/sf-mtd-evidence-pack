const PRODUCT_SLUG = "mtd-evidence-pack";
const TOKEN_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `${TOKEN_KEY}:verdict`;
const BILLING_BASE = "https://api.sociobot.in/api/v1";

type Verdict = { valid: boolean; checkedAt: number };

export function isDemoLocation(): boolean {
  return location.pathname === "/demo" || new URLSearchParams(location.search).get("demo") === "1";
}

export function getLicenseToken(): string {
  if (isDemoLocation()) return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}
export function hasCachedLicense(): boolean {
  try { return Boolean(getLicenseToken()) && (JSON.parse(localStorage.getItem(VERDICT_KEY) ?? "null") as Verdict | null)?.valid === true; }
  catch { return false; }
}

export function captureReturnedLicense(): void {
  if (isDemoLocation()) return;
  const url = new URL(location.href);
  const token = url.searchParams.get("license");
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete("license");
  history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

export async function verifyLicense(force = false): Promise<boolean> {
  if (isDemoLocation()) return false;
  const token = getLicenseToken();
  if (!token) return false;
  try {
    const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? "null") as Verdict | null;
    if (!force && cached && Date.now() - cached.checkedAt < 86_400_000) return cached.valid;
  } catch { localStorage.removeItem(VERDICT_KEY); }
  try {
    const response = await fetch(`${BILLING_BASE}/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json() as { valid?: boolean };
    if (isDemoLocation()) return false;
    const verdict = { valid: result.valid === true, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return verdict.valid;
  } catch {
    if (isDemoLocation()) return false;
    return hasCachedLicense();
  }
}

export async function restoreLicense(token: string): Promise<boolean> {
  if (isDemoLocation()) return false;
  localStorage.setItem(TOKEN_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
  const valid = await verifyLicense(true);
  if (!valid) localStorage.removeItem(TOKEN_KEY);
  return valid;
}
