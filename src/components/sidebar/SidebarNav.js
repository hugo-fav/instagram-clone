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
} from "lucide-react";
import styled from "styled-components";

const SideNavbar = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.isMobileMode ? "80px" : "220px")};
  height: 100vh;
  padding: 22px;
  overflow: hidden;
  align-items: ${(props) => (props.isMobileMode ? "center" : "flex-start")};
  transition: width 0.3s ease;

  border-right: ${(props) =>
    props.isMobileMode ? "none" : "1px solid #292929ff"};

  span {
    display: ${(props) => (props.isMobileMode ? "none" : "block")};
  }

  p {
    display: ${(props) => (props.isMobileMode ? "none" : "block")};
  }

  @media (max-width: 1248px) {
    width: 80px;
    align-items: center;
  }
`;

const NameTnIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 17px 12px;
  margin-bottom: 32px;

  .logo-icon {
    display: ${(props) => (props.isMobileMode ? "block" : "none")};
  }

  .logo-name {
    display: ${(props) => (props.isMobileMode ? "none" : "block")};
  }

  @media (max-width: 1248px) {
    justify-content: center;
    gap: 0;
    transition: all 0.3s ease-in-out;

    .logo-name {
      display: none;
    }

    .logo-icon {
      display: block;
    }
  }
`;

const IconNdName = styled.button`
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
  font-weight: ${(props) => (props.active ? "800" : "100")};

  p {
    display: none;
  }

  &:hover {
    background-color: rgb(40, 40, 40);
    border-radius: 5px;
    font-weight: 600;
    width: 100%;
  }

  @media (max-width: 1248px) {
    justify-content: center;
    gap: 0;
    transition: all 0.3s ease-in-out;

    span {
      display: none;
    }

    p {
      display: block;
    }

    h3 {
      display: none;
    }
  }
`;

const TheMoreOption = styled.div`
  margin: auto;
  margin-bottom: 0;
  margin-left: 0;
`;

const MoreOptionIconNdName = styled.button`
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
    transition: all 0.3s ease-in-out;

    span {
      display: none;
    }
  }
`;

function SidebarNav({
  isMobileMode,
  activeMenu,
  setActiveMenu,
  setActiveComponent,
  toggleComponent,
  closeComponent,
}) {
  return (
    <SideNavbar isMobileMode={isMobileMode}>
      <NameTnIcon isMobileMode={isMobileMode}>
        <p className="logo-icon">
          <InstagramIcon size={27} />
        </p>

        <h3 className="logo-name">Instagram</h3>
      </NameTnIcon>

      <IconNdName
        active={activeMenu === "home"}
        onClick={() => setActiveMenu("home")}
      >
        <Home size={27} />
        <span>Home</span>
      </IconNdName>

      <IconNdName
        active={activeMenu === "search"}
        isMobileMode={isMobileMode}
        onClick={() => {
          setActiveMenu("search");
          setActiveComponent("search");
          toggleComponent("search");
        }}
      >
        <Search size={27} />
        <span>Search</span>
      </IconNdName>

      <IconNdName
        active={activeMenu === "explore"}
        onClick={() => setActiveMenu("explore")}
      >
        <BadgePlus size={27} />
        <span>Explore</span>
      </IconNdName>

      <IconNdName
        active={activeMenu === "reels"}
        onClick={() => setActiveMenu("reels")}
      >
        <Film size={27} />
        <span>Reels</span>
      </IconNdName>

      <IconNdName
        active={activeMenu === "inbox"}
        isMobileMode={isMobileMode}
        onClick={() => {
          setActiveMenu("inbox");
          setActiveComponent("inbox");
          toggleComponent("inbox");
        }}
      >
        <MessageCircle size={27} />
        <span>Messages</span>
      </IconNdName>

      <IconNdName
        active={activeMenu === "notifications"}
        onClick={() => {
          // setActiveMenu("notifications");
          setActiveComponent("notifications");
          toggleComponent("notifications");
        }}
      >
        <Heart size={27} />
        <span>Notifications</span>
      </IconNdName>

      <IconNdName
        active={activeMenu === "create"}
        onClick={() => {
          // setActiveMenu("create");
          setActiveComponent("create");
          closeComponent("create");
        }}
      >
        <SquarePlus size={27} />
        <span>Create</span>
      </IconNdName>

      <IconNdName
        active={activeMenu === "profile"}
        onClick={() => setActiveMenu("profile")}
      >
        <User size={27} />
        <span>Profile</span>
      </IconNdName>

      <TheMoreOption>
        <MoreOptionIconNdName
          isMobileMode={isMobileMode}
          onClick={() => {
            setActiveComponent("more");
            closeComponent("more");
          }}
        >
          <Menu size={27} />
          <span>More</span>
        </MoreOptionIconNdName>

        <MoreOptionIconNdName
          isMobileMode={isMobileMode}
          onClick={() => {
            setActiveComponent("meta");
            closeComponent("meta");
          }}
        >
          <Boxes size={27} />
          <span>Also from Meta</span>
        </MoreOptionIconNdName>
      </TheMoreOption>
    </SideNavbar>
  );
}

export default SidebarNav;
