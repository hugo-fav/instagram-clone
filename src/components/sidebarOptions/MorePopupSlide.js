import { Activity, MailWarning, Moon, Save, Settings } from "lucide-react";
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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #3a3a3a;
  margin: 8px 0;
`;

const SecItem = styled(BaseItem)`
  padding: 10px 1.5rem;
  margin: 4px 0;
`;

function MorePopupSlide() {
  return (
    <ListItem>
      <NavItem>
        <Item>
          <Settings size={20} /> <span>Settings</span>
        </Item>
        <Item>
          <Activity size={20} /> <span>Activity</span>
        </Item>
        <Item>
          <Save size={20} /> <span>Saved</span>
        </Item>
        <Item>
          <Moon size={20} /> <span>Switch Appearance</span>
        </Item>
        <Item>
          <MailWarning size={20} /> <span>Report a Problem</span>
        </Item>
      </NavItem>

      <Divider />
      <SecItem>Switch accounts</SecItem>
      <SecItem>Log out</SecItem>
    </ListItem>
  );
}

export default MorePopupSlide;
