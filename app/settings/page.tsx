import { AppShell, Panel } from "../../components/brand/AppShell";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";

export default function SettingsPage() {
  return (
    <AppShell
      eyebrow="Preferences"
      title="Settings"
      subtitle="Placeholder settings area. Theme, notification, data-export, and privacy controls will be added after core MVP flows are stable."
      maxWidthClassName="max-w-4xl"
    >
      <ProtectedRoute>
        <Panel>
          <p className="text-sm leading-7 text-white/60">
            Settings are planned but not active yet. This page exists so the profile dropdown remains functional during MVP development.
          </p>
        </Panel>
      </ProtectedRoute>
    </AppShell>
  );
}
