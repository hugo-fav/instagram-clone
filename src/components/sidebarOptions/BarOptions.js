import styled from "styled-components";
import MorePopupSlide from "./MorePopupSlide";
import SearchPopupSlide from "./SearchPopupSlide";
import AlsoFromMetaPopup from "./AlsoFromMetaPopup";
import InboxPopSlide from "./InboxPopSlide";
import NotificationPopSlide from "./NotificationPopslide";
import CreatePopup from "./CreatePopup";

const PopSlide = styled.div`
  position: fixed;
  top: 0;
  left: ${(props) => (props.show ? "90px" : "-300px")};
  width: 300px;
  height: 100vh;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  padding: 20px;
`;

const OpenOption = styled.div`
  position: absolute;
  left: ${(props) => (props.mobilemode ? "5.5rem" : "22px")};
  z-index: 1000;
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

function BarOptions({ activeComponent, openOptionLeft }) {
  return (
    <>
      <PopSlide show={activeComponent === "search"}>
        {activeComponent === "search" && <SearchPopupSlide />}
      </PopSlide>

      <PopSlide show={activeComponent === "inbox"}>
        {activeComponent === "inbox" && <InboxPopSlide />}
      </PopSlide>

      <PopSlide show={activeComponent === "notifications"}>
        {activeComponent === "notifications" && <NotificationPopSlide />}
      </PopSlide>

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
