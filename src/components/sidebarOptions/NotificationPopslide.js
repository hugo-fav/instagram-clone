import styled, { css, keyframes } from "styled-components";

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Slide out (from right to left)
const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const SideNavbar = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid #292929ff;
  /* border-radius: 0 40px 50px 0; */
  height: 100vh;
  width: 350px;
  padding: 0px;
  overflow-y: auto;
  margin: 0;

  ${({ isVisible }) =>
    isVisible
      ? css`
          animation: ${slideIn} 0.6s ease-in-out forwards;
        `
      : css`
          animation: ${slideOut} 0.6s ease-in-out forwards;
        `};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  /* margin: 0 0 1.9rem 0; */
  padding: 1rem 8px;
`;
const NotificationHead = styled.p`
  font-size: 15px;
  font-weight: bold;
  padding: 0rem 8px;
`;
const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

function NotificationPopSlide() {
  return (
    <SideNavbar isVisible={true}>
      <Title>Notifications</Title>
      <NotificationHead>This month</NotificationHead>

      <NotificationList>
        {/* Map through notifications and display them */}
      </NotificationList>

      {/* <div
        style={{
          margin: "23px 0",
          padding: "0",
          width: "100%",
        }}
      /> */}
    </SideNavbar>
  );
}

export default NotificationPopSlide;
