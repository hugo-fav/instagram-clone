"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabseClient";
import styled from "styled-components";

export default function ImgIdModal({ imgId }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imgId) return;

    const fetchImage = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, media_url, caption, created_at, user_id, profiles(username, avatar_url)"
        )
        .eq("id", imgId)
        .single();

      if (error) {
        console.error("Img fetch error:", error);
      }

      console.log("Loaded image:", data.media_url);

      setImage(data);
      setLoading(false);
    };

    fetchImage();
  }, [imgId]);

  if (!imgId) return null;

  return (
    <Container>
      {loading ? (
        <p>Loading...</p>
      ) : image ? (
        <>
          <Image src={image.media_url} alt="Post" />
          {image.caption && <Caption>{image.caption}</Caption>}
        </>
      ) : (
        <p>No image found.</p>
      )}
    </Container>
  );
}

/* Styled components */

const Container = styled.div`
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  height: 600px;
  border-radius: 10px;
  margin-bottom: 0.5rem;
`;

const Caption = styled.p`
  font-size: 0.9rem;
  color: #444;
`;
