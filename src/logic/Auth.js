"use client";

import { useState } from "react";
import { supabase } from "@/libs/supabseClient";

import styled from "styled-components";

// ---------- styled components ----------
const AuthWrapper = styled.div`
  max-width: 350px;
  margin: 3rem auto;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
`;

const Logo = styled.h1`
  font-family: "Billabong", cursive; /* IG-like font if available */
  font-size: 2.5rem;
  text-align: center;
  color: #fff;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: #121212;
  color: #fff;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const Button = styled.button`
  background: ${(props) => (props.$secondary ? "transparent" : "#0095f6")};
  color: ${(props) => (props.$secondary ? "#0095f6" : "#fff")};
  border: ${(props) =>
    props.$secondary ? "1px solid #0095f6" : "1px solid transparent"};
  border-radius: 4px;
  padding: 8px 12px;
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
      props.$secondary ? "rgba(0,149,246,0.1)" : "#007acc"};
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

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Signup: only create auth user
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      alert("Signup successful! Please confirm your email before logging in.");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login: create profile if it doesn't exist
  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw loginError;
      const user = loginData.user;
      if (!user) throw new Error("No user returned from Supabase Auth");

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        // Create profile row now
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            username: "",
            full_name: "",
            bio: "",
            avatar_url: "",
          },
        ]);
        if (insertError) throw insertError;
      }

      alert("Login successful!");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
    </AuthWrapper>
  );
}
