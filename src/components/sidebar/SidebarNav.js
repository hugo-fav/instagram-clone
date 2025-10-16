// src/components/sidebar/SidebarNav.js
"use client";

import {
  BadgePlus,
  Boxes,
  Film,
  Menu,
  Heart,
  Home,
  InstagramIcon,
  MessageCircle,
  Search,
  SquarePlus,
  User,
  Bell,
} from "lucide-react";
import Link from "next/link";
import styled from "styled-components";


const SideNavbar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;

  display: flex;
  /* flex: 0 0 220px; */
  flex-direction: column;
  width: ${(props) => (props.$isMobileMode ? "80px" : "220px")};
  height: 100vh;
  padding: 22px;
  overflow: hidden;
  align-items: ${(props) => (props.$isMobileMode ? "center" : "flex-start")};
  transition: width 0.3s ease;
  border-right: ${(props) =>
    props.$isMobileMode ? "none" : "1px solid #292929ff"};
  /* background: #000;  */

  span {
    display: ${(props) => (props.$isMobileMode ? "none" : "block")};
  }
  p {
    display: ${(props) => (props.$isMobileMode ? "none" : "block")};
  }

  @media (max-width: 1248px) {
    width: 80px;
    align-items: center;
  }

  @media (max-width: 729px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    flex-direction: row;
    width: 100%;
    height: 60px;
    padding: 0 10px;
    border-right: none;
    border-top: 1px solid #292929ff;
    z-index: 100;
    span,
    p,
    h3 {
      display: none !important;
    }
  }
`;

const TopNavbar = styled.div`
  display: none;

  @media (max-width: 729px) {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 55px;
    align-items: center;
    gap: 10px;
    padding: 0 12px;
    background: #000;
    border-bottom: 1px solid #292929ff;
    z-index: 1000;
  }
`;

const TopBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TopLeft = styled.div`
  display: flex;
  text-align: end;
  gap: 8px;
  margin-left: auto;
`;

const TopSearchWrap = styled.div`
  /* flex: 1; */
  display: flex;
  align-items: center;
  gap: 8px;
  background: #121212;
  /* border: 1px solid #2a2a2a; */
  border-radius: 10px;
  padding: 8px 10px;
  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 0.95rem;
  }
`;

const TopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NameTnIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 17px 12px;
  margin-bottom: 32px;

  .logo-icon {
    display: ${(props) => (props.$isMobileMode ? "block" : "none")};
  }
  .logo-name {
    display: ${(props) => (props.$isMobileMode ? "none" : "block")};
  }

  @media (max-width: 1248px) {
    justify-content: center;
    gap: 0;
    .logo-name {
      display: none;
    }
    .logo-icon {
      display: block;
    }
  }

  @media (max-width: 729px) {
    display: none;
  }
`;

const IconNdName = styled(Link)`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  margin: 3px;
  gap: 1rem;
  padding: 12px 2px;
  cursor: pointer;
  width: 100%;
  font-size: 15.6px;
  font-weight: ${(props) => (props.$active ? "800" : "100")};

  &:hover {
    background-color: rgb(40, 40, 40);
    border-radius: 5px;
    font-weight: 600;
    width: 100%;
  }

  @media (max-width: 1248px) {
    justify-content: center;
    gap: 0;
    span {
      display: none;
    }
  }

  ${(props) =>
    props.$hideOnBottom &&
    `
    @media (max-width: 729px) {
      display: none;
    }
  `}
`;

const IconButtonNdName = styled.button.attrs({ type: "button" })`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  margin: 3px;
  gap: 1rem;
  padding: 12px 2px;
  cursor: pointer;
  width: 100%;
  font-size: 15.6px;
  font-weight: ${(props) => (props.$active ? "800" : "100")};

  &:hover {
    background-color: rgb(40, 40, 40);
    border-radius: 5px;
    font-weight: 600;
    width: 100%;
  }

  @media (max-width: 1248px) {
    justify-content: center;
    gap: 0;
    span {
      display: none;
    }
  }

  ${(props) =>
    props.$hideOnBottom &&
    `
    @media (max-width: 729px) {
      display: none;
    }
  `}
`;

const TheMoreOption = styled.div`
  margin: auto;
  margin-bottom: 0;
  margin-left: 0;

  @media (max-width: 729px) {
    display: none;
  }
`;

const MoreOptionIconNdName = styled.button.attrs({ type: "button" })`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  margin: 3px;
  width: 100%;
  gap: 1rem;
  padding: 12px 0;
  cursor: pointer;
  font-size: 15.6px;
  font-weight: 500;

  &:hover {
    background-color: rgb(40, 40, 40);
    border-radius: 5px;
  }

  @media (max-width: 1248px) {
    justify-content: center;
    gap: 0;
    span {
      display: none;
    }
  }
`;

/* Component */
function SidebarNav({
  isMobileMode, // styling (use collapsed to shrink to logo-only)
  isRealMobile, // actual device mobile boolean for behaviour
  activeMenu,
  setActiveMenu,
  toggleComponent,
  togglePopupOnly,
  activeComponent,
  query,
  setQuery,
}) {
  // left-panel active state driven by activeComponent (desktop)
  const isLeftActive = (name) => activeComponent === name;
  // global popups are driven by activeMenu
  const isGlobalActive = (name) => activeMenu === name;

  const handlePanelClick = (component) => {
    if (isRealMobile) {
      // open mobile popup (do NOT duplicate input; the top input is used)
      togglePopupOnly && togglePopupOnly(component);
      setActiveMenu &&
        setActiveMenu((prev) => (prev === component ? null : component));
    } else {
      // desktop/tablet: toggle left panel
      toggleComponent && toggleComponent(component);
    }
  };

  return (
    <>
      <TopNavbar>
        <TopBrand>
          <h3 className="logo-name">Instagram</h3>
        </TopBrand>

        <TopLeft>
          <TopSearchWrap>
            {/* This is the single shared input: on mobile it opens the MobileSearchPopup
              and typing here updates `query` which MobileSearchPopup listens to. */}
            <input
              placeholder="Search"
              value={query || ""}
              onChange={(e) => setQuery?.(e.target.value)}
              onFocus={() => {
                if (isRealMobile) {
                  // open the mobile search popup
                  togglePopupOnly && togglePopupOnly("mobilesearch");
                  setActiveMenu && setActiveMenu("mobilesearch");
                } else {
                  // open the desktop left search slide
                  toggleComponent && toggleComponent("search");
                }
              }}
              readOnly={false}
              autoComplete="off"
              inputMode="search"
            />
          </TopSearchWrap>

          <TopRight>
            <button
              type="button"
              onClick={() => {
                handlePanelClick("notifications");
              }}
              style={{
                background: "none",
                border: "none",
                padding: 6,
                cursor: "pointer",
              }}
              aria-label="Notifications"
            >
              <Bell size={22} />
            </button>
          </TopRight>
        </TopLeft>
      </TopNavbar>

      <SideNavbar $isMobileMode={isMobileMode}>
        <NameTnIcon $isMobileMode={isMobileMode}>
          <p className="logo-icon">
            <InstagramIcon size={27} />
          </p>
          <h3 className="logo-name">Instagram</h3>
        </NameTnIcon>

        <IconNdName
          href="/"
          $active={isLeftActive("home") || isGlobalActive("home")}
          onClick={() => setActiveMenu && setActiveMenu("home")}
        >
          <Home size={27} />
          <span>Home</span>
        </IconNdName>

        <IconButtonNdName
          $active={isLeftActive("search")}
          $hideOnBottom={true}
          onClick={() => handlePanelClick("search")}
        >
          <Search size={27} />
          <span>Search</span>
        </IconButtonNdName>

        <IconNdName
          href="/explore"
          $active={isLeftActive("explore") || isGlobalActive("explore")}
          $hideOnBottom={false}
          onClick={() => setActiveMenu && setActiveMenu("explore")}
        >
          <BadgePlus size={27} />
          <span>Explore</span>
        </IconNdName>

        <IconNdName
          href="/reels"
          $active={isLeftActive("reels") || isGlobalActive("reels")}
          onClick={() => setActiveMenu && setActiveMenu("reels")}
        >
          <Film size={27} />
          <span>Reels</span>
        </IconNdName>

        <IconButtonNdName
          $active={isLeftActive("inbox")}
          onClick={() => handlePanelClick("inbox")}
        >
          <MessageCircle size={27} />
          <span>Messages</span>
        </IconButtonNdName>

        <IconButtonNdName
          $active={isLeftActive("notifications")}
          onClick={() => handlePanelClick("notifications")}
          $hideOnBottom={true}
        >
          <Heart size={27} />
          <span>Notifications</span>
        </IconButtonNdName>

        <IconButtonNdName
          $active={isGlobalActive("create")}
          onClick={() => {
            togglePopupOnly && togglePopupOnly("create");
          }}
        >
          <SquarePlus size={27} />
          <span>Create</span>
        </IconButtonNdName>

        <IconNdName
          href="/profile"
          $active={isLeftActive("profile") || isGlobalActive("profile")}
          onClick={() => setActiveMenu && setActiveMenu("profile")}
        >
          <User size={27} />
          <span>Profile</span>
        </IconNdName>

        <TheMoreOption>
          <MoreOptionIconNdName
            onClick={() => {
              togglePopupOnly && togglePopupOnly("more");
            }}
          >
            <Menu size={27} />
            <span>More</span>
          </MoreOptionIconNdName>

          <MoreOptionIconNdName
            onClick={() => {
              togglePopupOnly && togglePopupOnly("meta");
            }}
          >
            <Boxes size={27} />
            <span>Also from Meta</span>
          </MoreOptionIconNdName>
        </TheMoreOption>
      </SideNavbar>
    </>
  );
}

export default SidebarNav;
