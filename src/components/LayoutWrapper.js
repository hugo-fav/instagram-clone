// src/components/LayoutWrapper.js
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import AuthGuard from "./AuthProvider";
import styled from "styled-components";
// import AuthGuard from "@/components/AuthGuard";

const MainContent = styled.div`
  margin-left: 220px; /* default desktop sidebar width */
  padding: 20px;
  transition: margin-left 0.3s ease;
  flex: 1;
  overflow: auto;

  @media (max-width: 1248px) {
    margin-left: 80px; /* compact sidebar */
  }

  @media (max-width: 729px) {
    margin-left: 0; /* sidebar becomes bottom bar */
  }
`;

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
        <MainContent style={{ flex: 1, overflow: "auto" }}>
          {children}
        </MainContent>
      </div>
    </AuthGuard>
  );
}
