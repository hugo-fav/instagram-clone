// src/components/sidebarOptions/MobileSearchPopup.js
"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { supabase } from "@/libs/supabseClient";

const Container = styled.div`
  position: fixed;
  top: 55px;
  right: 10px;
  width: 300px;
  max-height: 400px;
  background: ${({ theme }) => theme.colors?.backgroundSecondary || "#0b0b0b"};
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow-y: auto;
  padding: 8px 12px;
  z-index: 1000;
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

export default function MobileSearchPopup({
  query,
  onClose,
  activeMenu,
  setActiveMenu,
}) {
  const searchRef = useRef(null);
  const router = useRouter();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        activeMenu === "mobilesearch"
      ) {
        setActiveMenu(null);
      }
    }

    if (activeMenu === "mobilesearch") {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu, setActiveMenu]);

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
    setActiveMenu(null);
    // navigate to user profile
    router.push(`/profile/${encodeURIComponent(username)}`);
  };

  return (
    <Container role="list" ref={searchRef}>
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
