// components/UploadPost.jsx
"use client";

import { useState } from "react";
import { supabase } from "@/libs/supabseClient";

export default function UploadPost({ userId, onClose, onUploaded }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const bucket = "posts"; // <- confirm that you have a 'posts' bucket in Supabase storage

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
      // create a file path (organize by user id for convenience)
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `${userId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      // get public url
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl =
        publicUrlData?.publicUrl || publicUrlData?.public_url || null;
      if (!publicUrl) {
        console.warn("No public URL returned. Check bucket privacy settings.");
      }

      // insert into posts table
      const { error: insertError } = await supabase.from("posts").insert({
        user_id: userId,
        image_url: publicUrl,
        caption,
      });

      if (insertError) {
        console.error("Insert post error:", insertError);
        throw insertError;
      }

      // success
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
    <div style={{ paddingTop: 12 }}>
      <label style={{ display: "block", marginBottom: 8 }}>
        Select image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "block", marginTop: 8 }}
        />
      </label>

      {previewUrl && (
        <div style={{ marginBottom: 8 }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </div>
      )}

      <textarea
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={3}
        style={{ width: "100%", marginTop: 8, padding: 8, borderRadius: 6 }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            cursor: "pointer",
            background: "#4a90e2",
            color: "#fff",
            border: "none",
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <button
          onClick={() => {
            if (onClose) onClose();
          }}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            cursor: "pointer",
            background: "#eee",
            border: "none",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
