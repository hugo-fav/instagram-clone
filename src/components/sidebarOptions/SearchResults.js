// src/components/sidebarOptions/SearchResults.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabseClient";

export default function SearchResults({ query = "", onSelect }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim() === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    const t = setTimeout(async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .ilike("username", `%${query}%`)
        .limit(30);

      if (!mounted) return;
      if (!error && data) setResults(data);
      else setResults([]);
      setLoading(false);
    }, 300); // debounce 300ms

    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [query]);

  return (
    <div>
      {loading && <div style={{ padding: 12, color: "#ccc" }}>Searching…</div>}

      {!loading && query && results.length === 0 && (
        <div style={{ padding: 12, color: "#999" }}>No results</div>
      )}

      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {results.map((u) => (
          <li
            key={u.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              cursor: "pointer",
            }}
            onClick={() => onSelect?.(u)}
          >
            <img
              src={u.avatar_url || "/default-avatar.png"}
              alt={u.username}
              style={{ width: 36, height: 36, borderRadius: "50%" }}
            />
            <div style={{ color: "#fff" }}>{u.username}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
