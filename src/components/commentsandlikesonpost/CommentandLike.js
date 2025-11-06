"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Heart, MessageCircle } from "lucide-react";
import ClickedOnCommentSty from "./clickedoncomment/ClickedOnCommentSty";
import CommentandLikeModal from "./CommentandLikeModal";
import { supabase } from "@/libs/supabseClient";

export default function CommentAndLike({ postId }) {
  const [likes, setLikes] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get current logged-in user
  useEffect(() => {
    const fetchUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) setUserId(session.user.id);

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) setUserId(session.user.id);
          else setUserId(null);
        }
      );

      return () => listener.subscription.unsubscribe();
    };

    fetchUserSession();
  }, []);

  // ✅ Fetch likes from DB for this post
  useEffect(() => {
    const fetchLikesAndComments = async () => {
      const [{ data: likeData }, { data: commentsData }] = await Promise.all([
        supabase.from("likes").select("*").eq("post_id", postId),
        supabase.from("comments").select("*").eq("post_id", postId),
      ]);

      setLikes(likeData || []);
      setComments(commentsData || []);
    };

    fetchLikesAndComments();
  }, [postId]);

  // ✅ Handle like / unlike
  const handleLikes = async () => {
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const existingLike = likes.find((like) => like.user_id === userId);

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error removing like:", error.message);
      } else {
        setLikes((prevLikes) =>
          prevLikes.filter((like) => like.user_id !== userId)
        );
      }
    } else {
      // Like
      const { data, error } = await supabase
        .from("likes")
        .insert([{ post_id: postId, user_id: userId }])
        .select();

      if (error) {
        console.error("Error adding like:", error.message);
      } else if (data && data.length > 0) {
        setLikes((prevLikes) => [...prevLikes, ...data]);
      }
    }
  };

  // ✅ Open comments modal
  const handleOpenComments = () => {
    setSelectedPostId(postId);
    setShowModal(true);
  };

  const hasLiked = likes.some((like) => like.user_id === userId);

  return (
    <Container>
      <Button
        onClick={handleLikes}
        style={{ color: hasLiked ? "red" : "#333" }}
      >
        <Heart size={20} /> {likes.length}
      </Button>

      <Button onClick={handleOpenComments}>
        <MessageCircle size={20} /> {comments.length}
      </Button>

      {showModal && selectedPostId && (
        <CommentandLikeModal onClose={() => setShowModal(false)}>
          <ClickedOnCommentSty selectedPostId={selectedPostId} />
        </CommentandLikeModal>
      )}
    </Container>
  );
}

// ---------- Styles ----------
const Container = styled.div`
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    transform: scale(1.1);
  }
`;
