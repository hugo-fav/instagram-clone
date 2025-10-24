"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { supabase } from "@/libs/supabseClient"; // make sure this path is correct
import Modal from "@/components/Modal"; // assuming you already have a Modal component
import { Heart, MessageCircle } from "lucide-react";
import ClickedOnCommentSty from "./clickedoncomment/ClickedOnCommentSty";

export default function CommentAndLike({ postId }) {
  const [likes, setLikes] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCommentsAndLikes = async () => {
      // Fetch likes
      const { data: likes, error: likesError } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId);

      if (likesError) {
        console.error("Error fetching likes:", likesError);
        return;
      }

      setLikes(likes);
    };

    fetchCommentsAndLikes();
  }, [postId]);

  const handleOpenComments = () => {
    setSelectedPostId(postId);
    setShowModal(true);
  };

  return (
    <Container>
      <Button>
        <Heart /> {likes.length}
      </Button>

      <Button onClick={() => handleOpenComments(true)}>
        <MessageCircle />
      </Button>

      {showModal && selectedPostId && (
        <Modal onClose={() => setShowModal(false)}>
          <ClickedOnCommentSty selectedPostId={selectedPostId} />
        </Modal>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
    color: #e63946;
  }
`;
