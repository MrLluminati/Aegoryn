"use client";

import { useEffect, useState } from "react";
import { AppShell, Panel } from "../../components/brand/AppShell";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { createBrowserSupabaseClient } from "../../lib/supabase/client";

type ProfileState = {
  email: string;
  userId: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>({ email: "Loading...", userId: "Loading..." });

  useEffect(() => {
    async function loadProfile() {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        return;
      }

      setProfile({
        email: user.email || "No email found",
        userId: user.id
      });
    }

    loadProfile();
  }, []);

  return (
    <AppShell
      eyebrow="User Profile"
      title="Profile"
      subtitle="Basic profile placeholder for the authenticated AegorynOS user. Real profile editing and profile pictures will be added later."
      maxWidthClassName="max-w-4xl"
    >
      <ProtectedRoute>
        <Panel>
          <div className="space-y-4">
            <div className="rounded-2xl bg-black/30 p-4">
              <p className="text-sm text-white/50">Email</p>
              <p className="mt-2 text-lg font-semibold text-aegoryn-gold">{profile.email}</p>
            </div>
            <div className="rounded-2xl bg-black/30 p-4">
              <p className="text-sm text-white/50">User ID</p>
              <p className="mt-2 break-all text-sm text-white/65">{profile.userId}</p>
            </div>
          </div>
        </Panel>
      </ProtectedRoute>
    </AppShell>
  );
}
