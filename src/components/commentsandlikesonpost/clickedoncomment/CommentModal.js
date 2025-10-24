"use client";
import { supabase } from "@/libs/supabseClient";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function CommentModal({ imgId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const commentsRef = useRef(null);

  useEffect(() => {
    if (!imgId) {
      setComments([]);
      return;
    }

    let mounted = true;
    const fetchComments = async () => {
      setLoading(true);
      // Ensure relation name is "profiles" — adjust if yours differs
      const { data, error } = await supabase
        .from("comments")
        .select(
          "id, content, created_at, user_id, profiles(username, avatar_url)"
        )
        .eq("post_id", imgId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        if (mounted) setComments([]);
      } else if (mounted) {
        setComments(data || []);
        // scroll to top of list so newest is visible (list is newest-first)
        setTimeout(() => {
          commentsRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
      }
      if (mounted) setLoading(false);
    };

    fetchComments();

    // Realtime subscription for new comments to keep UI in sync
    const channel = supabase
      .channel(`comments-${imgId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${imgId}`,
        },
        (payload) => {
          // payload.new is the row inserted
          setComments((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [imgId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed || !imgId) return;

    // get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Please sign in to comment.");
      return;
    }

    // optimistic update: show the comment immediately while DB writes
    const optimistic = {
      id: `temp-${Date.now()}`,
      content: trimmed,
      created_at: new Date().toISOString(),
      user_id: user.id,
      profiles: {
        username:
          user.user_metadata?.name || user.email?.split("@")[0] || "You",
        avatar_url: user.user_metadata?.avatar_url || "/default-avatar.png",
      },
    };
    setComments((prev) => [optimistic, ...prev]);
    setNewComment("");

    const { error } = await supabase.from("comments").insert([
      {
        post_id: imgId,
        user_id: user.id,
        content: trimmed,
      },
    ]);

    if (error) {
      console.error("Error posting comment:", error);
      // rollback optimistic update
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
      alert("Failed to post comment. Try again.");
    } else {
      // success: realtime subscription will append the "real" comment row for others.
      // Optionally you could re-fetch to replace the optimistic item with real one.
    }
  };

  return (
    <Container>
      <Header>
        <Title>Comments</Title>
      </Header>

      <CommentsList ref={commentsRef}>
        {loading ? (
          <LoadingText>Loading comments…</LoadingText>
        ) : comments.length === 0 ? (
          <EmptyText>No comments yet — be the first.</EmptyText>
        ) : (
          comments.map((comment) => (
            <Comment key={comment.id}>
              <UserInfo>
                <Avatar
                  src={comment.profiles?.avatar_url || "/default-avatar.png"}
                  alt={comment.profiles?.username || "user"}
                />
                <div>
                  <Username>{comment.profiles?.username || "Unknown"}</Username>
                  <When>{new Date(comment.created_at).toLocaleString()}</When>
                </div>
              </UserInfo>
              <Text>{comment.content}</Text>
            </Comment>
          ))
        )}
      </CommentsList>

      <CommentForm onSubmit={handleSubmit}>
        <Input
          aria-label="Add a comment"
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <SubmitButton type="submit" disabled={!newComment.trim()}>
          Post
        </SubmitButton>
      </CommentForm>
    </Container>
  );
}

/* Styles */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  padding: 1rem;
  color: #d8e3e6;
`;

const Header = styled.div`
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.05rem;
`;

const CommentsList = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  margin-top: 0.75rem;
  padding-right: 0.25rem;
`;

const Comment = styled.div`
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
`;

const UserInfo = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

const Username = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
`;

const When = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Text = styled.p`
  margin: 0.45rem 0 0 46px; /* indent to keep under username */
  font-size: 0.92rem;
  color: #d5d5d5;
`;

const LoadingText = styled.p`
  color: #999;
`;

const EmptyText = styled.p`
  color: #9fb0b6;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.6rem 0.9rem;
  border-radius: 10px;
  color: #fff;
  outline: none;
  font-size: 0.95rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.14);
  }
`;

const SubmitButton = styled.button`
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  background: #0ea5a3;
  color: #04282a;
  border: none;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
