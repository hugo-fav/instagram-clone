import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { supabase } from "@/libs/supabseClient";
import { X } from "lucide-react";
import Link from "next/link";

// Slide-in animation
const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }`;

// Spinner animation
const spin = keyframes`
  100% { transform: rotate(360deg); }`;

// const SideNavbar = styled.div`
//   display: flex;
//   flex-direction: column;
//   background: #1c1c1c;
//   border-right: 1px solid #2c2c2c;
//   border-radius: 0 24px 24px 0;
//   height: 100vh;
//   width: 320px;
//   padding: 1rem;
//   overflow-y: auto;
//   animation: ${slideIn} 0.4s ease-out forwards;
// `;

const SideNavbar = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid #292929ff;
  border-radius: 0 24px 24px 0;
  height: 100vh;
  width: 320px;
  padding: 1rem;
  overflow-y: auto;
  animation: ${slideIn} 0.4s ease-out forwards;
  /* margin: 0; */

  @media (max-width: 729px) {
    display: none;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 999px;
  background: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  &::placeholder {
    color: #888;
  }
  &:focus {
    outline: 2px solid #4a90e2;
  }
`;

const Divider = styled.div`
  margin: 1.5rem 0;
  border-bottom: 1px solid #2c2c2c;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;

  p {
    color: #fff;
    font-weight: 500;
  }
  button {
    background: none;
    border: none;
    color: #4a90e2;
    cursor: pointer;
    font-weight: 500;
  }
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

const ResultsListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #2a2a2a;
  }

  .info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .text {
    color: #fff;
    font-size: 0.95rem;
  }

  button {
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    transition: color 0.2s;
    &:hover {
      color: #fff;
    }
  }
`;

const Loader = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #4a90e2;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  margin: 1rem auto;
`;

export default function SearchPopupSlide() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce user input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .or(
          `full_name.ilike.%${debouncedQuery}%,username.ilike.%${debouncedQuery}%`
        )
        .limit(10);
      setLoading(false);
      if (error) setResults([]);
      else setResults(data || []);
    })();
  }, [debouncedQuery]);

  const handleClearAll = () => setResults([]);
  const handleRemove = (id) =>
    setResults((prev) => prev.filter((user) => user.id !== id));

  return (
    <SideNavbar>
      <Title>Search</Title>
      <SearchInput
        placeholder="Search full name or username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Divider />

      <SectionHeader>
        <p>Recent</p>
        <button onClick={handleClearAll}>Clear All</button>
      </SectionHeader>

      {loading && <Loader />}

      {!loading && results.length === 0 && debouncedQuery && (
        <p style={{ color: "#888", textAlign: "center" }}>No results found.</p>
      )}

      <ResultsList>
        {results.map((user) => (
          <ResultsListItem key={user.id}>
            <Link
              href={`/profile/${encodeURIComponent(user.username)}`}
              className="info"
            >
              {user.avatar_url && (
                <img src={user.avatar_url} alt={`${user.username} avatar`} />
              )}
              <span className="text">
                {user.full_name} (@{user.username})
              </span>
            </Link>
            <button onClick={() => handleRemove(user.id)}>
              <X size={18} />
            </button>
          </ResultsListItem>
        ))}
      </ResultsList>
    </SideNavbar>
  );
}
