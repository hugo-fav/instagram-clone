"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal";
import { supabase } from "@/libs/supabseClient";
import EditProfile from "./EditProfile";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CameraIcon, Heart, MessageCircle, PlusCircle } from "lucide-react";
import UploadPost from "@/components/UploadPost";
import PostItem from "@/components/sidebarOptions/PostItem";
import OpenCommentWhenImgClicked from "@/components/commentsandlikesonpost/OpenCommentWhenImgClicked";
import CommentandLikeModal from "@/components/commentsandlikesonpost/CommentandLikeModal";
import ClickedOnCommentSty from "@/components/commentsandlikesonpost/clickedoncomment/ClickedOnCommentSty";
import CommentAndLike from "@/components/commentsandlikesonpost/CommentandLike";
import HoverContainer from "@/components/HoverContainer";

const ProfileContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;

  /* responsive padding for smaller screens */

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
  flex-direction: column;

  /* remove large fixed horizontal margin and instead use padding from container */
  margin: 0 6rem;

  /* allow header spacing tweaks on wide screens */
  @media (min-width: 1100px) {
    margin: 0 4rem;
  }

  @media (max-width: 729px) {
    margin: 2rem 0.5rem;
  }
`;

/* Centered: allow stacking on narrow screens while keeping horizontal layout on wider screens */
const Centered = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;

  /* allow wrapping on smaller viewports so avatar and info stack vertically */
  @media (max-width: 729px) {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }
`;

const Avatar = styled.img`
  width: 150px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 1024px) {
    width: 150px;
    height: 120px;
  }

  @media (max-width: 729px) {
    width: 100px;
    height: 100px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  /* ensure text doesn't overflow on small screens */
  min-width: 0;
  width: 100%;
`;

const UsernameRow = styled.div`
  display: flex;
  align-items: center;
`;

const Username = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;

  @media (max-width: 720px) {
    font-size: 1.4rem;
    text-align: center;
    word-break: break-word;
  }
`;

const EditButton = styled.button`
  margin: 1.4rem 0 2rem 0;
  padding: 14px 6.2rem;
  font-size: 0.95rem;
  border-radius: 13px;
  border: none;
  cursor: pointer;
  background: #292929ff;
  color: #fff;
  transition: transform 120ms ease, opacity 120ms ease;
  min-width: 110px;

  /* scale down padding on smaller screens while keeping shape */
  @media (max-width: 900px) {
    padding: 10px 2rem;
  }

  @media (max-width: 420px) {
    padding: 8px 1.2rem;
    font-size: 0.85rem;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  span {
    font-size: 0.9rem;
    font-weight: 100;
    cursor: default;
  }

  @media (max-width: 480px) {
    gap: 0.6rem;

    span {
      font-size: 0.85rem;
    }
  }
`;

const DisplayName = styled.div`
  margin-top: 1rem;
  font-weight: 500;
  word-break: break-word;
`;

/* Make grid responsive with auto-fit / minmax so posts adapt to screen size */
const PostsGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 2rem;
`;

const Line = styled.div`
  margin: 20px 0;
  border-top: 1px solid #292929ff;
`;

const ButtonsColumn = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap; /* allow wrap on tiny screens */
`;

const UploadingContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 0 1rem;
`;

const UploadingContainerHead = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;



export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const {
    handleOpenComments,
    handleCloseComments,
    showCommentModal,
    selectedPostId,
  } = OpenCommentWhenImgClicked();

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
      <ProfileHeader>
        <Centered>
          <Avatar src={userData.avatarUrl} alt="Profile Picture" />

          <UserInfo>
            <UsernameRow>
              <Username>{userData.username}</Username>
            </UsernameRow>

            <DisplayName>{userData.displayName}</DisplayName>

            <StatsRow>
              <span>{userData.posts.length} posts</span>
              <span>{userData.followers} followers</span>
              <span>{userData.following} following</span>
            </StatsRow>
          </UserInfo>
        </Centered>

        <ButtonsColumn>
          <EditButton onClick={() => setShowEditModal(true)}>
            Edit Profile
          </EditButton>
          <EditButton>View archive</EditButton>
        </ButtonsColumn>

        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            margin: "20px 0",
            cursor: "pointer",
            color: "#292929ff",
            alignItems: "flex-start",
          }}
          onClick={() => setShowUploadModal(true)}
        >
          <PlusCircle size={80} />
          <span
            style={{
              fontSize: "14px",
              color: "white",
              margin: "6px 0 0 25px",
              marginTop: "5px",
              fontWeight: "500",
              letterSpacing: "1px",
              cursor: "pointer",
            }}
          >
            New
          </span>
        </div>
      </ProfileHeader>

      <Line></Line>

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
            return (
              <HoverContainer key={post.id} overlayContent={<CommentAndLike />}>
                <PostItem
                  onClick={() => handleOpenComments(post.id)}
                  src={post.media_url}
                  alt="Post"
                />
              </HoverContainer>
            );
          })}
        </PostsGrid>
      )}

      {showCommentModal && (
        <CommentandLikeModal onClose={handleCloseComments}>
          <ClickedOnCommentSty selectedPostId={selectedPostId} />
        </CommentandLikeModal>
      )}

      {/* Edit Profile Modal  */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <EditProfile onClose={() => setShowEditModal(false)} />
        </Modal>
      )}
      {/* Upload Post Modal */}
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

ProfilePage;
