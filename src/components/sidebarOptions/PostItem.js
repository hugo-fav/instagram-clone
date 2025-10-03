// components/PostItem.jsx
import Image from "next/image";
import styled from "styled-components";

const PostWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0; /* fallback gray */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
`;

export default function PostItem({ src, alt }) {
  if (!src) {
    return <PostWrapper>No image</PostWrapper>; // fallback UI
  }

  return (
    <PostWrapper>
      <Image
        src={src}
        alt={alt || "Post image"}
        fill
        style={{ objectFit: "cover" }}
        sizes="(max-width: 768px) 100vw, 
               (max-width: 1200px) 50vw, 
               33vw"
      />
    </PostWrapper>
  );
}
