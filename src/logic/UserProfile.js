"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal";
import Auth from "@/logic/Auth";
import { supabase } from "@/libs/supabseClient";
import EditProfile from "./EditProfile";
import LoadingSpinner from "@/components/LoadingSpinner";

const ProfileContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 729px) {
    margin: 2.2rem  0;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UsernameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Username = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
`;

const EditButton = styled.button`
  padding: 6px 14px;
  font-size: 0.95rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: white;

  &:hover {
    background: #f2f2f2;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;

  span {
    font-weight: 500;
    cursor: default;
  }
`;

const DisplayName = styled.div`
  margin-top: 1rem;
  font-weight: 500;
`;

// Simple grid for posts
const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const PostItem = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
`;

// ... (styled components from previous example: Avatar, UsernameRow, StatsRow, PostsGrid, etc.) ...

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch profile info
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        return;
      }

      // Fetch posts
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error(postsError);
      }
      console.log("Profile ID:", profile.id);
      const { data: userData } = await supabase.auth.getUser();
      console.log("User ID:", userData.user.id);

      setUserData({
        username: profile.username,
        displayName: profile.full_name,
        avatarUrl: profile.avatar_url || "/default-avatar.png",
        posts: posts || [],
        followers: profile.followers_count || 0,
        following: profile.following_count || 0,
      });
    };

    fetchProfile();
  }, []);

  if (!userData) return <LoadingSpinner />;

  return (
    <ProfileContainer>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Avatar src={userData.avatarUrl} alt="Profile Picture" />
        <div>
          <UsernameRow>
            <Username>{userData.username}</Username>
            <EditButton onClick={() => setShowEditModal(true)}>
              Edit Profile
            </EditButton>
          </UsernameRow>
          <StatsRow>
            <span>{userData.posts.length} posts</span>
            <span>{userData.followers} followers</span>
            <span>{userData.following} following</span>
          </StatsRow>
          <DisplayName>{userData.displayName}</DisplayName>
        </div>
      </div>

      <PostsGrid>
        {userData.posts.map((post) => (
          <PostItem key={post.id} src={post.image_url} alt="Post" />
        ))}
      </PostsGrid>

      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <EditProfile onClose={() => setShowEditModal(false)} />
        </Modal>
      )}
    </ProfileContainer>
  );
}

export default ProfilePage;
