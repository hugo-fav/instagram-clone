"use client";

import { useEffect } from "react";
import styled from "styled-components";
import MorePopupSlide from "./MorePopupSlide";
import SearchPopupSlide from "./SearchPopupSlide";
import AlsoFromMetaPopup from "./AlsoFromMetaPopup";
import InboxPopSlide from "./InboxPopSlide";
import NotificationPopSlide from "./NotificationPopslide";
import CreatePopup from "./CreatePopup";

/* Left slide panel (desktop / original behavior) */
const PopSlide = styled.div`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$show ? "90px" : "-300px")};
  width: 300px;
  height: 100vh;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
  transition: left 0.28s ease;
  padding: 20px;
  background: ${({ theme }) => theme.colors?.backgroundSecondary || "#0b0b0b"};
  z-index: 1100; /* slides below overlays */
`;

const OpenOption = styled.div`
  position: fixed;
  left: ${(props) => (props.$mobilemode ? "5.5rem" : "22px")};
  z-index: 2200; /* overlays above slides */
`;

const TopPopup = styled.div`
  position: fixed;
  top: 55px;
  left: 0;
  right: 0;
  max-height: calc(100vh - 55px - 60px);
  overflow: auto;
  padding: 12px;
  background: ${({ theme }) => theme.colors?.backgroundSecondary || "#0b0b0b"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 2100; /* above slides */
`;

const Overlay = styled.div`
  position: fixed;
  top: ${(p) => p.$top || 0};
  left: 0;
  right: 0;
  bottom: ${(p) => p.$bottom || 0};
  background: rgba(0, 0, 0, 0.35);
  z-index: 2000; /* sits above slides, under openoptions */
`;

const Create = styled(OpenOption)`
  bottom: 5rem;
`;
const More = styled(OpenOption)`
  bottom: 5rem;
  left: 0;
`;
const Meta = styled(OpenOption)`
  bottom: 0;
`;

function BarOptions({
  activeMenu,
  activeComponent,
  openOptionLeft,
  closeComponent,
  closePopup,
  isMobileMode,
  isTabletMode,
  isDesktopMode,
  query,
  onUserSelect,
  setSidebarCompact,

}) {
  // LEFT-PANELS use activeComponent explicitly
  // GLOBAL POPUPS use activeMenu explicitly

  // Only request collapse when a left-panel is open AND we're on desktop
  useEffect(() => {
    if (!setSidebarCompact) return;
    const shouldCollapse =
      isDesktopMode &&
      ["search", "inbox", "notifications"].includes(activeComponent);
    setSidebarCompact(shouldCollapse);
  }, [activeComponent, isDesktopMode, setSidebarCompact]);

  // Mobile: top anchored popups for search / notifications (when using activeMenu)
  if (
    isMobileMode &&
    (activeMenu === "search" || activeMenu === "notifications")
  ) {
    return (
      <>
        <Overlay $top="55px" $bottom="60px" onClick={() => closePopup?.()} />
        <TopPopup>
          {activeMenu === "search" && (
            <SearchPopupSlide query={query} onUserSelect={onUserSelect} />
          )}
          {activeMenu === "notifications" && <NotificationPopSlide />}
        </TopPopup>
      </>
    );
  }

  // Desktop: render left slides based on activeComponent (unaffected by overlays)
  const showOverlay = ["create", "more", "meta"].includes(activeMenu);

  return (
    <>
      {/* Desktop left slide panels (driven by activeComponent explicitly) */}
      <PopSlide $show={activeComponent === "search"}>
        {activeComponent === "search" && (
          <SearchPopupSlide query={query} onUserSelect={onUserSelect} />
        )}
      </PopSlide>

      <PopSlide $show={activeComponent === "inbox"}>
        {activeComponent === "inbox" && <InboxPopSlide />}
      </PopSlide>

      <PopSlide $show={activeComponent === "notifications"}>
        {activeComponent === "notifications" && <NotificationPopSlide />}
      </PopSlide>

      {/* Overlay (global popups) and floating open options */}
      {showOverlay && (
        <Overlay $top="0" $bottom="0" onClick={() => closePopup?.()} />
      )}

      <Create style={{ left: openOptionLeft }}>
        {activeMenu === "create" && <CreatePopup />}
      </Create>

      <More style={{ left: openOptionLeft }}>
        {activeMenu === "more" && <MorePopupSlide />}
      </More>

      <Meta style={{ left: openOptionLeft }}>
        {activeMenu === "meta" && <AlsoFromMetaPopup />}
      </Meta>
    </>
  );
}

export default BarOptions;
