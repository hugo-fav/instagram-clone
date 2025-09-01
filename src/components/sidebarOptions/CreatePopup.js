import { Bot, Circle, LayoutGrid, Podcast } from "lucide-react";
import styled from "styled-components";

const BaseItem = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-weight: 100;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: #4e4e4eff;
  }

  span {
    padding: 8px;
  }
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  padding: 9px;
  margin: 12px 0;

  background: ${({ theme }) => theme.colors?.backgroundSecondary || "#292929"};
  border-radius: 12px;
  transition: all 0.2s ease;
`;

const NavItem = styled.nav`
  display: flex;
  flex-direction: column;
`;

const Item = styled(BaseItem)``;

function CreatePopup() {
  return (
    <ListItem>
      <NavItem>
        <Item>
          <span>Post</span> <Podcast size={20} />
        </Item>
        <Item>
          <span>AI</span> <LayoutGrid size={20} />
        </Item>
      </NavItem>
    </ListItem>
  );
}

export default CreatePopup;
