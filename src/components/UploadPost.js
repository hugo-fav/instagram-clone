"use client";

import { useState } from "react";
import { supabase } from "@/libs/supabseClient";
import Image from "next/image";
import styled from "styled-components";

export default function UploadPost({ userId, onClose, onUploaded }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const bucket = "posts";

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image to upload.");
    if (!userId) return alert("Missing user id.");

    setLoading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl =
        publicUrlData?.publicUrl || publicUrlData?.public_url || null;

      const { error: insertError } = await supabase.from("posts").insert({
        user_id: userId,
        media_url: publicUrl,
        caption,
      });

      if (insertError) throw insertError;

      if (onUploaded) onUploaded();
      if (onClose) onClose();
    } catch (err) {
      console.error("UploadPost error:", err);
      alert("Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Label>
        Select image
        <FileInput type="file" accept="image/*" onChange={handleFileChange} />
      </Label>

      {previewUrl && (
        <PreviewWrapper>
          <Image src={previewUrl} alt="preview" width={80} height={80} />
        </PreviewWrapper>
      )}

      <CaptionInput
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={3}
      />

      <ButtonGroup>
        <UploadButton onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </UploadButton>
        <CancelButton onClick={onClose}>Cancel</CancelButton>
      </ButtonGroup>
    </Container>
  );
}

// ---------------- Styled Components ---------------- //

const Container = styled.div`
  background-color: #545353ff;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
`;

const FileInput = styled.input`
  display: block;
  margin-top: 8px;
`;

const PreviewWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
`;

const CaptionInput = styled.textarea`
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: none;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: #4a90e2;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const UploadButton = styled.button`
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #4a90e2;
  color: white;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #357ab8;
  }

  &:disabled {
    background: #9cc3ee;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #e5e7eb;
  color: #333;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #d1d5db;
  }
`;
