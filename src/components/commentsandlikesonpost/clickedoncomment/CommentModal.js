import { supabase } from "@/libs/supabseClient";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function CommentModal({ imgId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imgId) return;

    const fetchComments = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("comments")
        .select(
          "id, content, created_at, user_id, profiles( username, avatar_url )"
        )
        .eq("post_id", imgId)
        .order("created_at", { ascending: false });

      if (error) console.log("Error fetching comments:", error);
      else setComments(data);

      setLoading(false);
    };
    fetchComments();
  }, [imgId]);

  // post a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from("comments").insert([
      {
        post_id: imgId,
        user_id: user.id,
        content: newComment.trim(),
      },
    ]);

    if (error) {
      console.error("Error posting comment:", error);
    } else {
      setNewComment("");
      // refresh comments
      const { data } = await supabase
        .from("comments")
        .select(
          "id, content, created_at, user_id, profiles(username, avatar_url)"
        )
        .eq("post_id", imgId)
        .order("created_at", { ascending: false });
      setComments(data);
    }
  };

  return (
    <Container>
      <Title>Comments</Title>

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        <CommentsList>
          {comments.map((comment) => (
            <Comment key={comment.id}>
              <UserInfo>
                <Avatar
                  src={comment.profiles?.avatar_url || "/default-avatar.png"}
                  alt="avatar"
                />
                <Username>{comment.profiles?.username || "Unknown"}</Username>
              </UserInfo>
              <Text>{comment.content}</Text>
            </Comment>
          ))}
        </CommentsList>
      ) : (
        <p>No comments yet.</p>
      )}

      <CommentForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <SubmitButton type="submit">Post</SubmitButton>
      </CommentForm>
    </Container>
  );
}

/* Styled Components */
const Container = styled.div`
  width: 100%;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const Title = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const CommentsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
`;

const Comment = styled.div`
  padding: 0.4rem 0;
  border-bottom: 1px solid #f2f2f2;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Avatar = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;

const Username = styled.span`
  font-weight: 500;
  font-size: 0.9rem;
`;

const Text = styled.p`
  font-size: 0.9rem;
  color: #444;
  margin-left: 2rem;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;

  &:focus {
    border-color: #333;
  }
`;

const SubmitButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #0056b3;
  }
`;
