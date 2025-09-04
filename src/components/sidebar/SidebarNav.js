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

/* Sidebar container styling (unchanged rules other than using $isMobileMode) */
const SideNavbar = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.$isMobileMode ? "80px" : "220px")};
  height: 100vh;
  padding: 22px;
  overflow: hidden;
  align-items: ${(props) => (props.$isMobileMode ? "center" : "flex-start")};
  transition: width 0.3s ease;
  border-right: ${(props) =>
    props.$isMobileMode ? "none" : "1px solid #292929ff"};

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
    flex-direction: row;
    width: 100%;
    height: 60px;
    padding: 0 10px;
    border-right: none;
    border-top: 1px solid #292929ff;
    background: #000;

    span,
    p,
    h3 {
      display: none !important;
    }
  }
`;

/* Mobile top navbar (kept) */
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

const TopSearchWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #121212;
  border: 1px solid #2a2a2a;
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

/* Logo and name styling */
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

/* Link-based sidebar item — uses $active and supports $hideOnBottom */
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

  /* hide on mobile bottom bar when requested */
  ${(props) =>
    props.$hideOnBottom &&
    `
    @media (max-width: 729px) {
      display: none;
    }
  `}
`;

/* Button-based sidebar item — uses $active and supports $hideOnBottom */
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

  /* hide on mobile bottom bar when requested */
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
  isMobileMode,
  activeMenu,
  setActiveMenu,
  toggleComponent,
  togglePopupOnly,
}) {
  return (
    <>
      {/* mobile top navbar (Instagram + search input + notifications bell) */}
      <TopNavbar>
        <TopBrand>
          <InstagramIcon size={24} />
        </TopBrand>

        <TopSearchWrap>
          <input
            placeholder="Search"
            onFocus={() => {
              setActiveMenu("search");
              toggleComponent("search");
            }}
            readOnly
          />
        </TopSearchWrap>

        <TopRight>
          <button
            type="button"
            onClick={() => {
              setActiveMenu("notifications");
              toggleComponent("notifications");
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
      </TopNavbar>

      {/* original sidebar / bottom bar (desktop + tablet + mobile bottom) */}
      <SideNavbar $isMobileMode={isMobileMode}>
        <NameTnIcon $isMobileMode={isMobileMode}>
          <p className="logo-icon">
            <InstagramIcon size={27} />
          </p>
          <h3 className="logo-name">Instagram</h3>
        </NameTnIcon>

        <IconNdName
          href="/"
          $active={activeMenu === "home"}
          onClick={() => setActiveMenu("home")}
        >
          <Home size={27} />
          <span>Home</span>
        </IconNdName>

        {/* Search: present in desktop and tablet and top navbar, but hidden from mobile bottom bar */}
        <IconButtonNdName
          $active={activeMenu === "search"}
          $hideOnBottom={true} /* <-- hide on mobile bottom bar */
          onClick={() => {
            setActiveMenu("search");
            toggleComponent("search");
          }}
        >
          <Search size={27} />
          <span>Search</span>
        </IconButtonNdName>

        {/* Explore: present everywhere EXCEPT mobile bottom bar */}
        <IconNdName
          href="/explore"
          $active={activeMenu === "explore"}
          $hideOnBottom={true} /* <-- hide on mobile bottom bar */
          onClick={() => setActiveMenu("explore")}
        >
          <BadgePlus size={27} />
          <span>Explore</span>
        </IconNdName>

        <IconNdName
          href="/reels"
          $active={activeMenu === "reels"}
          onClick={() => setActiveMenu("reels")}
        >
          <Film size={27} />
          <span>Reels</span>
        </IconNdName>

        <IconButtonNdName
          $active={activeMenu === "inbox"}
          onClick={() => {
            setActiveMenu("inbox");
            toggleComponent("inbox");
          }}
        >
          <MessageCircle size={27} />
          <span>Messages</span>
        </IconButtonNdName>

        <IconButtonNdName
          $active={activeMenu === "notifications"}
          onClick={() => {
            setActiveMenu("notifications");
            toggleComponent("notifications");
          }}
        >
          <Heart size={27} />
          <span>Notifications</span>
        </IconButtonNdName>

        <IconButtonNdName
          $active={activeMenu === "create"}
          onClick={() => {
            setActiveMenu("create");
            togglePopupOnly("create");
          }}
        >
          <SquarePlus size={27} />
          <span>Create</span>
        </IconButtonNdName>

        <IconNdName
          href="/profile"
          $active={activeMenu === "profile"}
          onClick={() => setActiveMenu("profile")}
        >
          <User size={27} />
          <span>Profile</span>
        </IconNdName>

        <TheMoreOption>
          <MoreOptionIconNdName
            onClick={() => {
              setActiveMenu("more");
              togglePopupOnly("more");
            }}
          >
            <Menu size={27} />
            <span>More</span>
          </MoreOptionIconNdName>

          <MoreOptionIconNdName
            onClick={() => {
              setActiveMenu("meta");
              togglePopupOnly("meta");
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
