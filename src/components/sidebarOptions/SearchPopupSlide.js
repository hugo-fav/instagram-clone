import styled, { keyframes } from "styled-components";

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

const SideNavbar = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid #292929ff;
  border-radius: 0 40px 50px 0;
  height: 100vh;
  width: 350px;
  padding: 0px;
  overflow-y: auto;
  animation: ${slideIn} 0.4s ease-out forwards;

  margin: 0;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 1.9rem 0;
  padding: 1rem 8px;
`;

const SearchInput = styled.input`
  border: none;
  border-radius: 4px;
  padding: 10px 22px;
  width: 95%;
  box-sizing: border-box;

  &::placeholder {
    color: #888;
    font-size: 0.9rem;
  }

  &:focus {
    outline: none;
  }
`;

function SearchPopupSlide() {
  return (
    <SideNavbar>
      <Title>Search</Title>

      <SearchInput id="search-input" placeholder="Search" />

      <div
        style={{
          margin: "23px 0",
          padding: "0",
          width: "100%",
          borderBottom: "1px solid #292929ff",
        }}
      />
    </SideNavbar>
  );
}

export default SearchPopupSlide;
