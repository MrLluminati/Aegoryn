import { AppShell, Panel } from "../../components/brand/AppShell";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";

export default function UsagePage() {
  return (
    <AppShell
      eyebrow="AegorynOS Usage"
      title="Usage"
      subtitle="Placeholder usage area. AI credits, monthly parser calls, and subscription limits will be shown here later."
      maxWidthClassName="max-w-4xl"
    >
      <ProtectedRoute>
        <Panel>
          <p className="text-sm leading-7 text-white/60">
            Usage tracking is planned for the MVP credit-control phase. This page exists so the profile dropdown remains functional during development.
          </p>
        </Panel>
      </ProtectedRoute>
    </AppShell>
  );
}
