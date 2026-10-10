import { useDiagnostic } from "@/lib/diagnostic/context";
import { useAuth } from "@/lib/diagnostic/auth-context";
import { Switch } from "@/components/ui/switch";
export function CloudSyncPanel() {
  const {
    privateMode,
    setPrivateMode,
    saveCloud,
    restoreCloud,
    exportProgress,
    importLegacy,
    hasLegacy,
    syncBusy,
    syncMessage,
    dirty,
  } = useDiagnostic();
  const { email } = useAuth();
  return (
    <section className="panel space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">Your saved progress</h2>
        <label className="flex items-center gap-3 text-sm">
          Private Mode {privateMode ? "ON" : "OFF"}
          <Switch
            checked={privateMode}
            onCheckedChange={setPrivateMode}
            disabled={syncBusy}
            aria-label="Private mode"
          />
        </label>
      </div>
      <p className="text-sm text-muted-foreground">
        {privateMode
          ? "Your goals, audit answers and creation plan stay in this browser. Turn Private Mode off to save or restore your account's cloud copy."
          : `Cloud saves belong to ${email}. Save before changing devices, then restore on the other device. Saving does not send your progress to the CRM.`}
      </p>
      {!privateMode && (
        <p className="text-xs text-gold">
          {dirty
            ? "This device has progress that has not been confirmed saved to your account."
            : "This progress matches your last cloud save or restore."}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          disabled={privateMode || syncBusy}
          onClick={() => void saveCloud()}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-40"
        >
          {syncBusy ? "Please wait…" : "Save progress to account"}
        </button>
        <button
          disabled={privateMode || syncBusy}
          onClick={() => void restoreCloud()}
          className="rounded-md border px-4 py-2 disabled:opacity-40"
        >
          Restore from account
        </button>
        <button onClick={exportProgress} className="rounded-md border px-4 py-2">
          Export this device's progress
        </button>
      </div>
      {hasLegacy && (
        <div className="rounded-md border border-gold/30 p-3 text-sm">
          <p>
            Older progress exists in this browser. Import it only if it belongs to you. The original
            copy will be kept.
          </p>
          <button onClick={importLegacy} className="mt-2 text-gold">
            Import my old browser progress
          </button>
        </div>
      )}
      {syncMessage && (
        <p role="status" className="text-sm">
          {syncMessage}
        </p>
      )}
    </section>
  );
}
