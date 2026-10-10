// Browser-only namespace for private data. This is NOT an authentication source.
// The verified session selects the namespace; it never grants server access.
let owner: string | null = null;
export function selectLocalAccount(id: string | null) {
  if (typeof window !== "undefined") owner = id;
}
const keyFor = (key: string) => `bula:${owner ?? "signed-out"}:${key}`;
export const accountStorage = {
  getItem(key: string) {
    return typeof window === "undefined" ? null : window.localStorage.getItem(keyFor(key));
  },
  setItem(key: string, value: string) {
    if (typeof window !== "undefined" && owner) window.localStorage.setItem(keyFor(key), value);
  },
  removeItem(key: string) {
    if (typeof window !== "undefined" && owner) window.localStorage.removeItem(keyFor(key));
  },
};
