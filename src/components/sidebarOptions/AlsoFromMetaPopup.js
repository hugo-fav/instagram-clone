import { Bot, Circle, LayoutGrid } from "lucide-react";
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

function AlsoFromMetaPopup() {
  return (
    <ListItem>
      <NavItem>
        <Item>
          <Circle size={20} /> <span>Meta AI</span>
        </Item>
        <Item>
          <LayoutGrid size={20} /> <span>AI Studio</span>
        </Item>
        <Item>
          <Bot size={20} /> <span>Threads</span>
        </Item>
      </NavItem>
    </ListItem>
  );
}

export default AlsoFromMetaPopup;
