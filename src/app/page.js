"use client";

import HomeSuggested from "@/components/HomeSuggested";
import LoadingSpinner from "@/components/LoadingSpinner";
import { supabase } from "@/libs/supabseClient";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  font-size: 18px;
  gap: 0;
  width: 100%;
`;

const HomeSug = styled.div`
  flex: 1;
  margin-left: 2rem;

  @media (max-width: 1248px) {
    display: none;
  }
`;

const MainContent = styled.div`
  flex: 2;
  margin-right: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1248px) {
    margin-right: 0;
    justify-content: center;
    width: 100%;
  }

   @media (max-width: 729px) {
    margin-top: 2.3rem;
  }
`;

const PostWrapper = styled.div`
  padding: 1rem;
  /* margin-bottom: 2rem; */
  max-width: 480px;
  width: 100%;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled(Image)`
  border-radius: 50%;
`;

const PostImage = styled(Image)`
  border: 1px solid #292929ff;
  padding: 1rem;
  margin-top: 14px;
  object-fit: contain;
  width: 100%;
  max-width: 800px;
  height: 550px;
  aspect-ratio: 1 / 1;

  @media (max-width: 480px) {
    max-width: 95vw;
    height: 95vw;
    aspect-ratio: 1 / 1;
  }
`;

export default function Page() {
  const [userRandomPosts, setUserRandomPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomPosts = async () => {
      setLoading(true);
      const { data: posts, error: postError } = await supabase
        .from("posts")
        .select(
          "id, media_url, caption, created_at, user_id, profiles(username, avatar_url, full_name)"
        );

      if (postError) {
        console.error("Fetch posts error:", postError);
        setUserRandomPosts([]);
      } else if (posts && posts.length > 0) {
        const shuffled = posts.sort(() => 0.5 - Math.random());
        const postsWithUser = shuffled.map((post) => ({
          id: post.id,
          mediaUrl: post.media_url,
          caption: post.caption,
          createdAt: post.created_at,
          userId: post.user_id,
          username: post.profiles?.username,
          displayName: post.profiles?.full_name,
          avatarUrl: post.profiles?.avatar_url || "/default-avatar.png",
        }));
        setUserRandomPosts(postsWithUser);
      } else {
        setUserRandomPosts([]);
      }
      setLoading(false);
    };

    fetchRandomPosts();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Container>
      <MainContent>
        {userRandomPosts.length === 0
          ? "no users post yet"
          : userRandomPosts.map((post) => (
              <PostWrapper key={post.id}>
                <PostHeader>
                  <Avatar
                    src={post.avatarUrl}
                    alt={post.username}
                    width={30}
                    height={30}
                  />
                  <strong>{post.username}</strong> ({post.displayName})
                </PostHeader>
                <div>{post.caption}</div>
                <PostImage
                  src={post.mediaUrl}
                  alt="post"
                  width={300}
                  height={300}
                />
              </PostWrapper>
            ))}
      </MainContent>
      <HomeSug>
        <HomeSuggested />
      </HomeSug>
    </Container>
  );
}
