// src/components/sidebar/Sidebar.js
"use client";

import { useEffect, useState } from "react";
import SidebarNav from "./SidebarNav";
import BarOptions from "../sidebarOptions/BarOptions";
import MobileSearchPopup from "../sidebarOptions/MobileSearchPopup";

export default function Sidebar() {
  // viewport detection
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // left-panel state (desktop)
  const [activeComponent, setActiveComponent] = useState(null);

  // global popups (create/more/meta/mobilesearch)
  const [activeMenu, setActiveMenu] = useState(null);

  const [openOptionLeft, setOpenOptionLeft] = useState("22px");

  // request from BarOptions to collapse the sidebar (logo-only)
  const [compactSidebar, setCompactSidebar] = useState(false);

  // search query (shared between top input and mobile popup)
  const [query, setQuery] = useState("");

  const isDesktop = !isMobile && !isTablet;

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w <= 729) {
        setIsMobile(true);
        setIsTablet(false);
        setOpenOptionLeft("70px");
        setActiveComponent(null);
      } else if (w <= 1248) {
        setIsMobile(false);
        setIsTablet(true);
        setOpenOptionLeft("70px");
      } else {
        setIsMobile(false);
        setIsTablet(false);
        setOpenOptionLeft("22px");
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- control functions ---------- */

  // Toggle a desktop left panel (search, inbox, notifications)
  const toggleComponent = (component) => {
    setActiveComponent((prev) => (prev === component ? null : component));
    // do NOT change activeMenu here — global popups should not affect left panels
  };

  // Toggle global popup (create/more/meta/mobilesearch)
  const togglePopupOnly = (component) => {
    setActiveMenu((prev) => (prev === component ? null : component));
    // do NOT close left panels — popups overlay them
  };

  const closeComponent = (component) => {
    if (activeComponent === component) setActiveComponent(null);
  };

  const closePopup = () => setActiveMenu(null);

  /* ---------- collapsed flag for styling (pass-down) ---------- */
  const collapsed = isMobile || (isDesktop && compactSidebar);

  /* optional: when selecting a user result */
  const handleUserSelect = (username) => {
    setQuery("");
    setActiveMenu(null);
    // If you want to also close left panels: setActiveComponent(null);
    // Navigation will be handled inside MobileSearchPopup (router.push) or you can do it here.
  };

  return (
    <>
      <SidebarNav
        isMobileMode={collapsed} // styling prop (collapses sidebar to icons)
        isRealMobile={isMobile} // actual device behaviour
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        toggleComponent={toggleComponent}
        togglePopupOnly={togglePopupOnly}
        activeComponent={activeComponent}
        query={query}
        setQuery={setQuery}
      />

      <BarOptions
        activeMenu={activeMenu}
        activeComponent={activeComponent}
        openOptionLeft={openOptionLeft}
        closeComponent={closeComponent}
        closePopup={closePopup}
        isMobileMode={isMobile}
        isTabletMode={isTablet}
        isDesktopMode={isDesktop}
        setSidebarCompact={setCompactSidebar}
        query={query}
        onUserSelect={handleUserSelect}
        setActiveMenu={setActiveMenu}
      />

      {/* Mobile full-screen search popup (under top navbar) */}
      {/* We render the MobileSearchPopup only when the top input opened mobilesearch via activeMenu */}
      {isMobile && activeMenu === "mobilesearch" && (
        <div
          style={{
            position: "fixed",
            top: 55,
            left: 0,
            right: 0,
            bottom: 60,
            zIndex: 4000,
          }}
        >
          <MobileSearchPopup
            query={query}
            onClose={() => {
              setActiveMenu(null);
            }}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
        </div>
      )}
    </>
  );
}
