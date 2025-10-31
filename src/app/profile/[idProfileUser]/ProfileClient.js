"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

import { supabase } from "@/libs/supabseClient";

import LoadingSpinner from "@/components/LoadingSpinner";
import PostItem from "@/components/sidebarOptions/PostItem";

import CommentandLikeModal from "@/components/commentsandlikesonpost/CommentandLikeModal";
import ClickedOnCommentSty from "@/components/commentsandlikesonpost/clickedoncomment/ClickedOnCommentSty";
import OpenCommentWhenImgClicked from "@/components/commentsandlikesonpost/OpenCommentWhenImgClicked";
import HoverContainer from "@/components/HoverContainer";
import CommentAndLike from "@/components/commentsandlikesonpost/CommentandLike";

/* ---------- styled components (use same styles as src/logic/UserProfile.js) ---------- */
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
  flex-direction: column;
  margin: 0 6rem;

  @media (min-width: 1100px) {
    margin: 0 4rem;
  }

  @media (max-width: 729px) {
    margin: 2rem 0.5rem;
  }
`;

const Centered = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;

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

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-top: 2rem;
  width: 100%;
`;

const ButtonsColumn = styled.div`
  display: flex;
  flex-direction: row; /* row for all viewports */
  gap: 0.75rem;
  align-items: center;
  justify-content: center; /* center the buttons horizontally */
  width: 100%;
  flex-wrap: wrap; /* allow wrap on tiny screens */
`;

const Button = styled.button`
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

/* ---------- component ---------- */
export default function ProfileClient({ username }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // missing states referenced in the effect
  const [error, setError] = useState(null);
  const [debugMsgs, setDebugMsgs] = useState([]);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  const {
    handleOpenComments,
    handleCloseComments,
    showCommentModal,
    selectedPostId,
  } = OpenCommentWhenImgClicked();

  const logDebug = (label, obj) => {
    setDebugMsgs((s) => [...s, `${label}: ${JSON.stringify(obj, null, 2)}`]);
    console.log(label, obj);
  };

  useEffect(() => {
    let mounted = true;

    const fetchProfileAndPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugMsgs([]);

        const rawParam = (username || "").trim();
        const uname = decodeURIComponent(rawParam);
        logDebug("param.username", rawParam);
        logDebug("decoded username", uname);

        // Case-insensitive search
        const { data: pData, error: pError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .ilike("username", uname)
          .limit(1)
          .maybeSingle();

        logDebug("profileQuery (ilike)", { data: pData, error: pError });
        let profilesData = pData;

        // Fallback 1: lowercase exact match
        if (!profilesData) {
          const lc = uname.toLowerCase();
          const { data: eqData, error: eqError } = await supabase
            .from("profiles")
            .select("id, username, full_name, avatar_url")
            .eq("username", lc)
            .limit(1)
            .maybeSingle();
          logDebug("profileQuery (eq lowercased)", {
            data: eqData,
            error: eqError,
          });
          profilesData = eqData || profilesData;
        }

        // Fallback 2: lookup by id if UUID
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!profilesData && uuidRegex.test(uname)) {
          const { data: idData, error: idError } = await supabase
            .from("profiles")
            .select("id, username, full_name, avatar_url")
            .eq("id", uname)
            .limit(1)
            .maybeSingle();
          logDebug("profileQuery (by id)", { data: idData, error: idError });
          profilesData = idData || profilesData;
        }

        if (!profilesData) {
          if (!mounted) return;
          setError("Profile not found");
          setLoading(false);
          return;
        }

        // Fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("id, media_url, caption, created_at")
          .eq("user_id", profilesData.id)
          .order("created_at", { ascending: false });

        if (postsError) {
          console.error("Posts fetch error:", postsError);
          logDebug("postsError", postsError);
        }
        logDebug("postsData length", postsData?.length ?? 0);

        // Followers & following count
        const followersResp = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", profilesData.id);

        const followingResp = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", profilesData.id);

        const followersCount = followersResp?.count ?? 0;
        const followingCount = followingResp?.count ?? 0;

        // Current logged-in user
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user ?? null;

        // Owner?
        const owner = user?.id === profilesData.id;

        // Check follow state
        let followingRowExists = false;
        if (user && !owner) {
          const { data: followRow, error: followRowError } = await supabase
            .from("follows")
            .select("id")
            .eq("follower_id", user.id)
            .eq("following_id", profilesData.id)
            .maybeSingle();

          if (followRowError) {
            console.error("Error checking follow row:", followRowError);
            logDebug("followRowError", followRowError);
          } else {
            followingRowExists = !!followRow;
          }
        }

        if (!mounted) return;

        setProfile(profilesData);
        setPosts(postsData || []);
        setFollowers(followersCount);
        setFollowing(followingCount);
        setCurrentUser(user);
        setIsFollowing(Boolean(followingRowExists));
        setLoading(false);
      } catch (err) {
        console.error("Profile load error:", err);
        logDebug("Profile load error", err?.message || err);
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchProfileAndPosts();

    return () => {
      mounted = false;
    };
  }, [username]);

  const handleToggleFollow = async () => {
    if (!currentUser) {
      alert("Please sign in to follow users.");
      return;
    }
    if (!profile) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUser.id)
          .eq("following_id", profile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: currentUser.id, following_id: profile.id });
        if (error) throw error;
      }

      // Re-count
      const followersResp = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profile.id);

      const followingResp = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", profile.id);

      setFollowers(followersResp?.count ?? 0);
      setFollowing(followingResp?.count ?? 0);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow/unfollow error:", err);
      alert("Could not update follow — try again.");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <ProfileContainer>
        <LoadingSpinner />
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <p>{error}</p>
      </ProfileContainer>
    );
  }

  const userData = {
    username: profile.username,
    displayName: profile.full_name || profile.username,
    avatarUrl: profile.avatar_url || "/default-avatar.png",
    posts: posts || [],
    followers,
    following,
    id: profile.id,
  };

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
          <>
            {currentUser?.id !== profile.id && (
              <Button onClick={handleToggleFollow} disabled={followLoading}>
                {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
              </Button>
            )}

            <Button disabled>Message</Button>
          </>
        </ButtonsColumn>
      </ProfileHeader>

      <PostsGrid>
        {userData.posts.length ? (
          userData.posts.map((post) => (
            <HoverContainer key={post.id} overlayContent={<CommentAndLike />}>
              <PostItem
                onClick={() => handleOpenComments(post.id)}
                key={post.id}
                src={post.media_url || "/placeholder.png"}
                alt={post.caption || "Post"}
              />
            </HoverContainer>
          ))
        ) : (
          <p>user has not posted any images</p>
        )}
      </PostsGrid>

      {showCommentModal && (
        <CommentandLikeModal onClose={handleCloseComments}>
          <ClickedOnCommentSty selectedPostId={selectedPostId} />
        </CommentandLikeModal>
      )}
    </ProfileContainer>
  );
}
