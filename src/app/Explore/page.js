"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import styled from "styled-components";

import { supabase } from "@/libs/supabseClient";
import { useEffect, useState } from "react";

const FeedWrapper = styled.div`
  column-count: 3;
  column-gap: 0;
  margin: 0 6rem;

  @media (max-width: 1024px) {
    padding: 1px;
    margin: 0;
    column-count: 3;
    gap: 0;
  }

  @media (max-width: 729px) {
    padding: 0;
    margin: 0;
    column-count: 3;
    margin-top: 3rem;
    margin-bottom: 60px;
  }
`;

const PostCard = styled.div`
  padding: 1px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  break-inside: avoid; /* important: prevents posts from splitting between columns */
`;

const PostImage = styled.img`
  width: 100%;
  object-fit: cover;
  display: block;
`;

export default function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, media_url, caption, created_at, user_id, profiles(username, avatar_url)"
        );

      if (error) {
        console.error("Fetch posts error:", error);
      } else {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setPosts(shuffled.slice(0, 10));
      }
      setLoading(false);
    };

    fetchRandomPosts();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <FeedWrapper>
      {posts.map((post) => (
        <PostCard key={post.id}>
          <PostImage src={post.media_url} alt={post.caption} />
          {/* <p>
            <strong>@{post.profiles?.username}</strong>
          </p>
          <p>{post.caption}</p> */}
        </PostCard>
      ))}
    </FeedWrapper>
  );
}
