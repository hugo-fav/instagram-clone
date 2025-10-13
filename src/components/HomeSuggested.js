import { supabase } from "@/libs/supabseClient";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import styled from "styled-components";
import Link from "next/link";

const Container = styled.div`
  /* container styles if needed */
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  text-decoration: none;
`;

const UserLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  width: 100%;
  display: block;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const Text = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  margin: auto;
`;

export default function HomeSuggested() {
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [otherSuggestions, setOtherSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [following, setFollowing] = useState({}); // track follow state per user
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchUserSuggestions = async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
        return;
      }

      // Fetch current user profile (your original logic)
      const { data: usersAccounts, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .limit(5);

      if (usersError) {
        console.error("Error fetching user profiles:", usersError);
        setUserSuggestions([]);
      } else {
        setUserSuggestions(usersAccounts || []);
      }
      setLoading(false);

      // Fetch other users
      const { data: otherAccounts, error: otherAccountError } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .limit(5);

      if (otherAccountError) {
        console.error("Error fetching user profiles:", otherAccountError);
        setOtherSuggestions([]);
      } else {
        setOtherSuggestions(otherAccounts || []);
      }

      setLoading(false);
    };
    fetchUserSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    if (!userId) return;
    setFollowLoading(true);

    try {
      // Insert into follows (adjust to your schema!)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("follows").insert([
        {
          follower_id: user.id, // current user
          following_id: userId, // the person being followed
        },
      ]);

      if (error) throw error;

      // Toggle local follow state
      setFollowing((prev) => ({
        ...prev,
        [userId]: !prev[userId],
      }));
    } catch (err) {
      console.error("Error following user:", err.message);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container>
      {userSuggestions.length === 0 ? (
        <Text>No suggestions available.</Text>
      ) : (
        userSuggestions.map((user) => (
          <UserLink href={`/profile/${user.id}`} key={user.id}>
            <UserCard>
              <Avatar
                src={user.avatar_url || "/default-avatar.png"}
                alt="Profile Picture"
              />
              <Text>{user.username}</Text>
            </UserCard>
          </UserLink>
        ))
      )}

      <Text>Suggested for you</Text>

      {otherSuggestions.length === 0 ? (
        <Text>No suggestions available.</Text>
      ) : (
        otherSuggestions.map((user) => (
          <UserLink href={`/profile/${user.id}`} key={user.id}>
            <UserCard>
              <Avatar
                src={user.avatar_url || "/default-avatar.png"}
                alt="Profile Picture"
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {user.username}
              </Text>
              <Button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation when clicking follow
                  handleFollow(user.id);
                }}
              >
                {followLoading && following[user.id] === undefined
                  ? "..."
                  : following[user.id]
                  ? "Unfollow"
                  : "Follow"}
              </Button>
            </UserCard>
          </UserLink>
        ))
      )}
    </Container>
  );
}
