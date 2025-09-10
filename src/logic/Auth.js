"use client";

import { useState } from "react";
import { supabase } from "@/libs/supabseClient";
import styled from "styled-components";
import { useRouter } from "next/navigation";

// ---------- styled components ----------
const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #000;
`;

const AuthWrapper = styled.div`
  width: 100%;
  max-width: 350px;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
`;

const Logo = styled.h1`
  font-family: cursive;
  font-size: 3rem;
  text-align: center;
  color: #fff;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 9px 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  background: #121212;
  color: #fff;
  font-size: 13px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  background: ${(props) => (props.$secondary ? "transparent" : "#0095f6")};
  color: ${(props) => (props.$secondary ? "#0095f6" : "#fff")};
  border: ${(props) =>
    props.$secondary ? "1px solid #0095f6" : "1px solid transparent"};
  border-radius: 4px;
  padding: 9px 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$secondary ? "rgba(0,149,246,0.15)" : "#007acc"};
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  margin: 1rem 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  &:not(:empty)::before {
    margin-right: 0.75em;
  }

  &:not(:empty)::after {
    margin-left: 0.75em;
  }
`;

const SmallLink = styled.div`
  text-align: center;
  font-size: 12px;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.7);

  span {
    color: #0095f6;
    cursor: pointer;
    font-weight: 600;
  }
`;

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Signup
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert("Signup successful! Please confirm your email.");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      alert("Login successful!");

      router.push("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <AuthWrapper>
        <Logo>Instagram</Logo>

        <Input
          type="email"
          placeholder="Phone number, username, or email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </Button>

        <Divider>OR</Divider>

        <Button $secondary onClick={handleSignUp} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        <SmallLink>
          Don’t have an account? <span onClick={handleSignUp}>Sign up</span>
        </SmallLink>
      </AuthWrapper>
    </Page>
  );
}
