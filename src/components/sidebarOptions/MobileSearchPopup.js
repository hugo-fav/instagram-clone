// src/components/sidebarOptions/MobileSearchPopup.js
"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { supabase } from "@/libs/supabseClient";

const Container = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors?.backgroundSecondary || "#0b0b0b"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  max-height: calc(100vh - 55px - 60px);
  overflow: auto;
  padding: 8px 12px;
`;

const ResultItem = styled.button`
  width: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 8px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: #fff;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  background: #222;
`;

const Username = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const Sub = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

export default function MobileSearchPopup({ query, onClose }) {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced lookup
  useEffect(() => {
    let mounted = true;
    if (!query || !query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const tid = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, avatar_url")
          .ilike("username", `%${query}%`)
          .limit(20);

        if (error) {
          console.error("Supabase search error:", error);
          if (mounted) {
            setResults([]);
            setLoading(false);
          }
        } else {
          if (mounted) {
            setResults(data || []);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setResults([]);
          setLoading(false);
        }
      }
    }, 260);

    return () => {
      mounted = false;
      clearTimeout(tid);
    };
  }, [query]);

  const handleSelect = (username) => {
    onClose && onClose();
    // navigate to user profile
    router.push(`/profile/${encodeURIComponent(username)}`);
  };

  return (
    <Container role="list">
      {loading && <Sub>Searching…</Sub>}

      {!loading && results.length === 0 && query && <Sub>No users found</Sub>}

      {!loading &&
        results.map((u) => (
          <ResultItem key={u.id} onClick={() => handleSelect(u.username)}>
            <Avatar
              src={u.avatar_url || "/default-avatar.png"}
              alt={u.username}
            />
            <div>
              <Username>{u.username}</Username>
              {/* <Sub>View profile</Sub> */}
            </div>
          </ResultItem>
        ))}

      {/* {!query && <Sub>Type to search users</Sub>} */}
    </Container>
  );
}
