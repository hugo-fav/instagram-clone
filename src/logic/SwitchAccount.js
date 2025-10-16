"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { supabase } from "@/libs/supabseClient";
import { Check } from "lucide-react";

// ---------- styled components ----------
const Page = styled.div`
  display: flex;
  /* justify-content: flex-start; */
  /* Keep left position */
  align-items: flex-start;
  /* Keep top position */
  min-height: 100vh;
  width: auto;
`;

const AuthWrapper = styled.div`
  width: 100%;
  /* max-width: 540px; */
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  /* gap: 0.9rem; */
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 18px; /* More curved edges */
  background: #181818;
  margin-top: 2.5rem;
  margin-left: 2.5rem;
  align-items: center; /* Center content inside */
`;

const Logo = styled.h1`
  font-family: cursive;
  font-size: 1rem;
  text-align: center; /* Centered text */
  color: #fff;
  margin-bottom: 0.5rem;
`;

const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin: 1.2rem 0 1.2rem 0;
  width: 100%;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  /* margin: 1rem 0; */
  cursor: text;
  text-decoration: none;
  border-radius: 18px; /* More curved edges */
  padding: 0.5rem 1rem;
  width: fit-content;

  justify-content: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const Text = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

const CheckIcon = styled(Check)`
  color: #0095f6;
  width: 22px;
  height: 22px;
`;

const SwitchText = styled.p`
  color: #0095f6;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  margin-top: 2rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export default function SwitchAuthForm() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return;
      setUser(data.user);
    };
    fetchUser();
  }, []);

  return (
    <Page>
      <AuthWrapper>
        <Logo>Switch Account</Logo>
        <Divider />
        {user && (
          <UserCard>
            <UserInfo>
              <Avatar
                src={user.user_metadata?.avatar_url || "/default-avatar.png"}
                alt="Profile Picture"
              />
              <Text>{user.user_metadata?.username || user.email}</Text>
            </UserInfo>
            <CheckIcon />
          </UserCard>
        )}
        <SwitchText onClick={() => router.push("/auth")}>
          Login to an existing account
        </SwitchText>
      </AuthWrapper>
    </Page>
  );
}
