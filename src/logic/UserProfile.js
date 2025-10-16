"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal";
import { supabase } from "@/libs/supabseClient";
import EditProfile from "./EditProfile";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CameraIcon, PlusCircle } from "lucide-react";
import UploadPost from "@/components/UploadPost";
import PostItem from "@/components/sidebarOptions/PostItem";

const ProfileContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;

  @media (max-width: 1024px) {
    margin: 2.2rem auto;
    padding: 1rem;
  }

  @media (max-width: 729px) {
    
    margin: 2.2rem 0;
    padding: 0.5rem;
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

  @media (max-width: 1024px) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 729px) {
    width: 150px;
    height: 150px;
  }
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
  margin-left: 1rem;
  margin-top: 3rem;
  padding: 6px 14px;
  font-size: 0.95rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  /* background: white; */
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  span {
    font-size: 0.9rem;
    font-weight: 100;
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
  grid-template-columns: repeat(3, 1fr); /* Always 3 columns */
  gap: 10px;
  margin-top: 2rem;
`;

const UploadingContainers = styled.div`
  flex: 1; /* take up available space */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center; /* centers vertically */
  min-height: 60vh; /* fallback so it's tall enough */
`;

const UploadingContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

const UploadingContainerHead = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
`;

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("No user logged in.");
        return;
      }

      // if (!user) return;

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
      console.log("Posts data:", posts);

      // get followers
      const { count: followersCount, error: followersError } = await supabase
        .from("follows")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("following_id", profile.id);

      if (followersError) {
        console.error("Followers error:", followersError);
      }

      // get following
      const { count: followingCount, error: followingError } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", profile.id);

      if (followingError) {
        console.error("Following error:", followingError);
      }

      const { data: userData } = await supabase.auth.getUser();
      console.log("User ID:", userData.user.id);

      setUserData({
        id: profile.id,
        username: profile.username,
        displayName: profile.full_name,
        avatarUrl: profile.avatar_url || "/default-avatar.png",
        posts: posts || [],
        followers: followersCount ?? 0,
        following: followingCount ?? 0,
      });
    };

    fetchProfile();
  }, []);

  if (!userData) return <LoadingSpinner />;

  return (
    <ProfileContainer>
      <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
        <Avatar src={userData.avatarUrl} alt="Profile Picture" />

        <div>
          <UsernameRow>
            <Username>{userData.username}</Username>
          </UsernameRow>

          <DisplayName>{userData.displayName}</DisplayName>

          <StatsRow>
            <span>{userData.posts.length} posts</span>
            <span>{userData.followers} followers</span>
            <span>{userData.following} following</span>
          </StatsRow>
        </div>
      </div>

      <EditButton onClick={() => setShowEditModal(true)}>
        Edit Profile
      </EditButton>
      <EditButton>View archive</EditButton>

      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <EditProfile onClose={() => setShowEditModal(false)} />
        </Modal>
      )}

      <div
        style={{
          margin: "20px 0",
          cursor: "pointer",
        }}
        onClick={() => setShowUploadModal(true)}
      >
        <PlusCircle size={80} />
      </div>

      <div style={{ margin: "20px 0", borderTop: "1px solid #ccc" }}></div>

      {userData.posts.length === 0 ? (
        <UploadingContainer>
          <CameraIcon size={60} />
          <UploadingContainerHead>Share Photos</UploadingContainerHead>
          <p style={{ fontSize: "14px" }}>
            When you share photos, they will appear on your profile
          </p>
          <p
            style={{ fontSize: "14px", color: "skyblue", cursor: "pointer" }}
            onClick={() => setShowUploadModal(true)}
          >
            Share your first Photo
          </p>
        </UploadingContainer>
      ) : (
        <PostsGrid>
          {userData.posts.map((post) => {
            return <PostItem key={post.id} src={post.media_url} alt="Post" />;
          })}
        </PostsGrid>
      )}

      {showUploadModal && (
        <Modal onClose={() => setShowUploadModal(false)}>
          <UploadPost
            userId={userData.id}
            onClose={() => setShowUploadModal(false)}
          />
        </Modal>
      )}
    </ProfileContainer>
  );
}

export default ProfilePage;
