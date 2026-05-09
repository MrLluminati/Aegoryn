"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { createBrowserSupabaseClient } from "../../lib/supabase/client";
import { Panel } from "../brand/AppShell";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const supabase = createBrowserSupabaseClient();

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!data.session) {
        router.replace("/login");
        return;
      }

      setIsAllowed(true);
      setIsChecking(false);
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isChecking) {
    return (
      <Panel>
        <p className="text-sm text-white/60">Checking secure access...</p>
      </Panel>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
