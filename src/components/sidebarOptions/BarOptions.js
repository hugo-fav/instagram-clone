"use client";

import styled from "styled-components";
import MorePopupSlide from "./MorePopupSlide";
import SearchPopupSlide from "./SearchPopupSlide";
import AlsoFromMetaPopup from "./AlsoFromMetaPopup";
import InboxPopSlide from "./InboxPopSlide";
import NotificationPopSlide from "./NotificationPopslide";
import CreatePopup from "./CreatePopup";

/* Left slide panel (desktop / original behavior) — only changed $show transient */
const PopSlide = styled.div`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$show ? "90px" : "-300px")};
  width: 300px;
  height: 100vh;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  padding: 20px;
  background: ${({ theme }) => theme.colors?.backgroundSecondary || "#0b0b0b"};
  z-index: 1005;
`;

/* Floating wrappers for create/more/meta — made fixed + high z so they are clickable above overlay */
const OpenOption = styled.div`
  position: fixed; /* changed from absolute -> fixed so it sits above overlay */
  left: ${(props) => (props.$mobilemode ? "5.5rem" : "22px")};
  z-index: 1007; /* above overlay (1004) and popslides (1005/1006) */
`;

/* Mobile top-anchored popup container (UNDER the mobile top navbar) */
const TopPopup = styled.div`
  position: fixed;
  top: 55px; /* TopNavbar height */
  left: 0;
  right: 0;
  max-height: calc(100vh - 55px - 60px); /* leave space for bottom bar */
  overflow: auto;
  padding: 12px;
  background: ${({ theme }) => theme.colors?.backgroundSecondary || "#0b0b0b"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 1006;
`;

/* Simple overlay to close on click — use transient props for top/bottom so they aren't forwarded to DOM */
const Overlay = styled.div`
  position: fixed;
  top: ${(p) => p.$top || 0};
  left: 0;
  right: 0;
  bottom: ${(p) => p.$bottom || 0};
  background: rgba(0, 0, 0, 0.35);
  z-index: 1004;
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
  activeComponent,
  openOptionLeft,
  closeComponent,
  isMobileMode,
}) {
  // Mobile: show Search/Notifications as TOP-anchored popups
  if (
    isMobileMode &&
    (activeComponent === "search" || activeComponent === "notifications")
  ) {
    return (
      <>
        <Overlay
          $top="55px"
          $bottom="60px"
          onClick={() => closeComponent(activeComponent)}
        />
        <TopPopup>
          {activeComponent === "search" && <SearchPopupSlide />}
          {activeComponent === "notifications" && <NotificationPopSlide />}
        </TopPopup>
      </>
    );
  }

  // Desktop (and other popups on mobile) — keep original layout
  const showOverlay = ["create", "more", "meta"].includes(activeComponent);

  return (
    <>
      {/* Left slide panels (search/inbox/notifications) */}
      <PopSlide $show={activeComponent === "search"}>
        {activeComponent === "search" && <SearchPopupSlide />}
      </PopSlide>

      <PopSlide $show={activeComponent === "inbox"}>
        {activeComponent === "inbox" && <InboxPopSlide />}
      </PopSlide>

      <PopSlide $show={activeComponent === "notifications"}>
        {activeComponent === "notifications" && <NotificationPopSlide />}
      </PopSlide>

      {/* Overlay and floating options for create/more/meta */}
      {showOverlay && (
        <Overlay
          $top="0"
          $bottom="0"
          onClick={() => closeComponent(activeComponent)}
        />
      )}

      <Create style={{ left: openOptionLeft }}>
        {activeComponent === "create" && <CreatePopup />}
      </Create>

      <More style={{ left: openOptionLeft }}>
        {activeComponent === "more" && <MorePopupSlide />}
      </More>

      <Meta style={{ left: openOptionLeft }}>
        {activeComponent === "meta" && <AlsoFromMetaPopup />}
      </Meta>
    </>
  );
}

export default BarOptions;
