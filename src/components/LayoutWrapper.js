// src/components/LayoutWrapper.js
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import AuthGuard from "./AuthProvider";
// import AuthGuard from "@/components/AuthGuard";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";

  if (isAuthPage) {
    // On auth page → no sidebar, just center form
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        {children}
      </main>
    );
  }

  // Everywhere else → wrap with AuthGuard
  return (
    <AuthGuard>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <Sidebar />
        <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
      </div>
    </AuthGuard>
  );
}
