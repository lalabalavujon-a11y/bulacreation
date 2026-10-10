import { beforeEach, expect, it, vi } from "vitest";
import { accountStorage, selectLocalAccount } from "../src/lib/diagnostic/local-storage";
beforeEach(() => {
  const items = new Map<string, string>();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (k: string) => items.get(k) ?? null,
      setItem: (k: string, v: string) => items.set(k, v),
      removeItem: (k: string) => items.delete(k),
    },
  });
  selectLocalAccount(null);
});
it("prevents one account inheriting another account's local audits or plans", () => {
  selectLocalAccount("A");
  accountStorage.setItem("audit", "A progress");
  selectLocalAccount("B");
  expect(accountStorage.getItem("audit")).toBeNull();
  accountStorage.setItem("audit", "B progress");
  selectLocalAccount("A");
  expect(accountStorage.getItem("audit")).toBe("A progress");
});
it("does not silently attach legacy unscoped progress to a newly verified account", () => {
  window.localStorage.setItem("audit", "legacy");
  selectLocalAccount("B");
  expect(accountStorage.getItem("audit")).toBeNull();
  expect(window.localStorage.getItem("audit")).toBe("legacy");
});
it("signed-out state cannot overwrite an account's progress", () => {
  selectLocalAccount("A");
  accountStorage.setItem("audit", "saved");
  selectLocalAccount(null);
  accountStorage.setItem("audit", "empty");
  selectLocalAccount("A");
  expect(accountStorage.getItem("audit")).toBe("saved");
});
