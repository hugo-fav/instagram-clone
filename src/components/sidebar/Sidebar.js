"use client";

import { useEffect, useState } from "react";
import SidebarNav from "./SidebarNav";
import BarOptions from "../sidebarOptions/BarOptions";

function Sidebar() {
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [activeMenu, setActiveMenu] = useState("home");
  const [openOptionLeft, setOpenOptionLeft] = useState("22px");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1248) {
        setIsMobileMode(true);
        setOpenOptionLeft("70px");
      } else {
        setIsMobileMode(false);
        setOpenOptionLeft("22px");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleComponent = (component) => {
    if (activeComponent === component) {
      setActiveComponent(null);
      setIsMobileMode(false);
    } else {
      setActiveComponent(component);
      setIsMobileMode(true);
    }
  };

  const togglePopupOnly = (component) => {
    setActiveComponent((prev) => (prev === component ? null : component));
  };

  const closeComponent = (component) => {
    if (activeComponent === component) {
      setActiveComponent(null);
    }
  };

  return (
    <>
      <SidebarNav
        isMobileMode={isMobileMode}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        toggleComponent={toggleComponent}
        togglePopupOnly={togglePopupOnly}
      />
      <BarOptions
        activeComponent={activeComponent}
        openOptionLeft={openOptionLeft}
        closeComponent={closeComponent}
      />
    </>
  );
}

export default Sidebar;
