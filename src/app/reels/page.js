"use client";
import styled from "styled-components";
import Link from "next/link";
import { Film } from "lucide-react"; // you can use any icon you like

export default function ReelsPlaceholder() {
  return (
    <Wrapper>
      <Content>
        <IconWrapper>
          <Film size={60} strokeWidth={1.5} />
        </IconWrapper>
        <Heading>Reels</Heading>
        <Text>
          This is where Reels would live if they ever make it to this app 🎥
          <br />
          For now, enjoy scrolling through posts instead!
        </Text>
        <StyledLink href="/explore">Back to Explore</StyledLink>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* background-color: #fff; */
  color: #262626;
  text-align: center;
`;

const Content = styled.div`
  max-width: 400px;
  padding: 2rem;
`;

const IconWrapper = styled.div`
  margin-bottom: 1.5rem;
  color: #737373;
`;

const Heading = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: #555;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  background-color: #0095f6;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #007ac1;
  }
`;
