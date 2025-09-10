// src/components/AuthGuard.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabseClient";
import { useRouter, usePathname } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      setSession(currentSession);
      setLoading(false);

      if (!currentSession && pathname !== "/auth") {
        router.replace("/auth");
      }
      if (currentSession && pathname === "/auth") {
        router.replace("/");
      }
    }

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);

        if (!newSession && pathname !== "/auth") {
          router.replace("/auth");
        }
        if (newSession && pathname === "/auth") {
          router.replace("/");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, pathname]);

  if (loading) return <LoadingSpinner />;

  // let /auth page show without session
  if (pathname === "/auth") return children;

  // block protected pages until session exists
  if (!session) return null;

  return children;
}
