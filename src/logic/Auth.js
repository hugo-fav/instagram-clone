"use client";

import { useState } from "react";
import { supabase } from "@/libs/supabseClient";

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
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([
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
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp} disabled={loading}>
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging In..." : "Login"}
      </button>
    </div>
  );
}
