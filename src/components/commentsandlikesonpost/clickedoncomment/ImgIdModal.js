"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabseClient";
import styled from "styled-components";

export default function ImgIdModal({ imgId }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imgId) {
      setImage(null);
      return;
    }

    let mounted = true;
    const fetchImage = async () => {
      setLoading(true);

      // fetch post row (adjust select fields if your relation name differs)
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, media_url, caption, created_at, user_id, profiles(username, avatar_url)"
        )
        .eq("id", imgId)
        .single();

      if (error) {
        console.error("Img fetch error:", error);
        if (mounted) {
          setImage(null);
          setLoading(false);
        }
        return;
      }

      // if media_url is a storage path (not a full URL), get public url
      let mediaUrl = data?.media_url ?? null;
      if (mediaUrl && !/^https?:\/\//i.test(mediaUrl)) {
        try {
          // change "post-images" to your storage bucket name if different
          const { data: publicUrlData } = supabase.storage
            .from("post-images")
            .getPublicUrl(mediaUrl);

          mediaUrl = publicUrlData?.publicUrl ?? mediaUrl;
        } catch (err) {
          console.warn("Couldn't get public url for media:", err);
        }
      }

      if (mounted) {
        setImage({ ...data, media_url: mediaUrl });
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      mounted = false;
    };
  }, [imgId]);

  if (!imgId) return null;

  return (
    <Container>
      {loading ? (
        <Message>Loading image…</Message>
      ) : image ? (
        <Figure>
          <Image src={image.media_url} alt={image.caption || "Post image"} />
          {image.caption && <Caption>{image.caption}</Caption>}
        </Figure>
      ) : (
        <Message>No image found.</Message>
      )}
    </Container>
  );
}

/* Styles */
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
  background: #000;
`;

const Figure = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  max-height: 100%;
  object-fit: contain; 
  /* preserves aspect without cropping */
  display: block;
  background: #000;
`;

const Caption = styled.p`
  margin-top: 0.6rem;
  color: #333;
  font-size: 0.95rem;
  text-align: left;
`;

const Message = styled.p`
  color: #666;
`;
