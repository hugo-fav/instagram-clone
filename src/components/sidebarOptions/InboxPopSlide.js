"use client";

import { supabase } from "@/libs/supabseClient";
import { useEffect, useState } from "react";
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

const SearchInput = styled.input`
  border: none;
  border-radius: 4px;
  padding: 14px 22px;
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

export default function InboxPopSlide() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (user) {
        // Fetch profile info using user.id
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id) // 👈 assumes your profiles table uses id = auth.user.id
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setUsername(profile.username);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <SideNavbar isVisible={true}>
      <Title>{username ? username : "Loading..."}</Title>

      <SearchInput id="search-input" placeholder="Search" />

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
