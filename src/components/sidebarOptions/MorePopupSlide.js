import { useState } from "react";
import { Activity, MailWarning, Moon, Save, Settings } from "lucide-react";
import { supabase } from "@/libs/supabseClient";

import styled from "styled-components";
import Modal from "@/components/Modal";
import Auth from "@/logic/Auth";

const ButtonItem = styled.button`
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
  margin: 3.2rem 0;

  background: ${({ theme }) => theme.colors?.backgroundSecondary || "#292929"};
  border-radius: 12px;
  transition: all 0.2s ease;
`;

const NavItem = styled.nav`
  display: flex;
  flex-direction: column;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #3a3a3a;
  margin: 8px 0;
`;

const SecButton = styled(ButtonItem)`
  padding: 10px 1.5rem;
  margin: 4px 0;
`;

export default function MorePopupSlide() {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      alert("Logged out successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const [showAuth, setShowAuth] = useState(false);

  return (
    <ListItem>
      <NavItem>
        <ButtonItem>
          <Settings size={20} /> <span>Settings</span>
        </ButtonItem>
        <ButtonItem>
          <Activity size={20} /> <span>Activity</span>
        </ButtonItem>
        <ButtonItem>
          <Save size={20} /> <span>Saved</span>
        </ButtonItem>
        <ButtonItem>
          <Moon size={20} /> <span>Switch Appearance</span>
        </ButtonItem>
        <ButtonItem>
          <MailWarning size={20} /> <span>Report a Problem</span>
        </ButtonItem>
      </NavItem>

      <Divider />
      <SecButton onClick={() => setShowAuth(true)}>Switch accounts</SecButton>
      <SecButton onClick={handleLogout}>Log out</SecButton>

      {showAuth && (
        <Modal onClose={() => setShowAuth(false)}>
          <Auth />
        </Modal>
      )}
    </ListItem>
  );
}
