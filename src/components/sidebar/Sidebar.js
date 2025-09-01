"use client";

import { useEffect, useState } from "react";
import SidebarNav from "./SidebarNav";
import BarOptions from "../sidebarOptions/BarOptions";

function Sidebar() {
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [activeMenu, setActiveMenu] = useState("home");
  const [openOptionLeft, setOpenOptionLeft] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1248) {
        setIsMobileMode(true);
        setOpenOptionLeft("70px"); // position when in mobile view
      } else {
        setIsMobileMode(false);
        setOpenOptionLeft("22px"); // position when in desktop view
      }
    };

    handleResize(); // run once on mount
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
        setActiveComponent={setActiveComponent}
        toggleComponent={toggleComponent}
        closeComponent={closeComponent}
      />
      <BarOptions
        activeComponent={activeComponent}
        openOptionLeft={openOptionLeft}
      />
    </>
  );
}

export default Sidebar;
