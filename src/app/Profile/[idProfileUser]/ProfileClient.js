// app/profile/[username]/ProfileClient.jsx
"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal";
import { supabase } from "@/libs/supabseClient";
import EditProfile from "@/logic/EditProfile";
import LoadingSpinner from "@/components/LoadingSpinner"; // Add this import

/* ---------- styled components (kept your style) ---------- */
const ProfileContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;

  @media (max-width: 729px) {
    margin: 2rem 0rem;
  }
`;
const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  background: #2a2a2a;
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
  margin: 0;
`;
const EditButton = styled.button`
  padding: 6px 14px;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: white;
  color: #111;
  &:hover {
    background: #f2f2f2;
  }
`;
const FollowButton = styled.button`
  padding: 6px 14px;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1px solid #4a90e2;
  cursor: pointer;
  background: #4a90e2;
  color: white;
`;
const StatsRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  span {
    font-weight: 500;
  }
`;
const DisplayName = styled.div`
  margin-top: 1rem;
  font-weight: 500;
`;
const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;
const PostItem = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 8px;
`;
const DebugBox = styled.pre`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  padding: 12px;
  color: #fff;
  font-size: 12px;
  overflow: auto;
  max-height: 180px;
  margin-top: 12px;
`;

/* ---------- component ---------- */
export default function ProfileClient({ username }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [error, setError] = useState(null);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  // UI debug toggle and messages
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugMsgs, setDebugMsgs] = useState([]);

  const logDebug = (label, obj) => {
    setDebugMsgs((s) => [...s, `${label}: ${JSON.stringify(obj, null, 2)}`]);
    // also console.log for convenience
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

        // First attempt: case-insensitive search for username using ilike
        // limit(1) + maybeSingle() keeps it safe for duplicates
        const { data: pData, error: pError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .ilike("username", uname)
          .limit(1)
          .maybeSingle();

        logDebug("profileQuery (ilike)", { data: pData, error: pError });

        let profilesData = pData;

        // Fallback 1: if not found, try exact eq (lowercased) — helpful if stored lowercased
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

        // Fallback 2: if still not found and the param looks like a uuid, try lookup by id
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

        // fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("id, image_url, caption, created_at")
          .eq("user_id", profilesData.id)
          .order("created_at", { ascending: false });

        if (postsError) {
          console.error("Posts fetch error:", postsError);
          logDebug("postsError", postsError);
        }
        logDebug("postsData length", postsData?.length ?? 0);

        // followers count
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

        // current logged-in user
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user ?? null;

        // owner?
        const owner = user?.id === profilesData.id;

        // check if current user follows
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
        setIsOwnProfile(Boolean(owner));
        setIsFollowing(Boolean(followingRowExists));
        setLoading(false);
      } catch (err) {
        console.error("Profile load error:", err);
        logDebug("Profile load error", err?.message || err);
        if (!mounted) return;
        setError(err?.message || "Unable to load profile.");
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

      // re-count
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
        <p style={{ color: "#ff6b6b" }}>{error}</p>
        <button
          style={{ marginTop: 12 }}
          onClick={() => setDebugOpen((d) => !d)}
        >
          {debugOpen ? "Hide debug" : "Show debug"}
        </button>
        {debugOpen && <DebugBox>{debugMsgs.join("\n\n")}</DebugBox>}
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
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Avatar src={userData.avatarUrl} alt={`${userData.username} avatar`} />
        <UserInfo>
          <UsernameRow>
            <Username>{userData.username}</Username>

            {isOwnProfile ? (
              <EditButton onClick={() => setShowEditModal(true)}>
                Edit Profile
              </EditButton>
            ) : (
              <FollowButton
                onClick={handleToggleFollow}
                disabled={followLoading}
              >
                {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
              </FollowButton>
            )}
          </UsernameRow>

          <StatsRow>
            <span>{userData.posts.length} posts</span>
            <span>{userData.followers} followers</span>
            <span>{userData.following} following</span>
          </StatsRow>

          <DisplayName>{userData.displayName}</DisplayName>
        </UserInfo>
      </div>

      <PostsGrid>
        {userData.posts.length ? (
          userData.posts.map((post) => (
            <PostItem
              key={post.id}
              src={post.image_url || "/placeholder.png"}
              alt={post.caption || "Post"}
            />
          ))
        ) : (
          <p style={{ color: "#aaa" }}>No posts yet.</p>
        )}
      </PostsGrid>

      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <EditProfile onClose={() => setShowEditModal(false)} />
        </Modal>
      )}
    </ProfileContainer>
  );
}
