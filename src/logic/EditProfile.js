"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { supabase } from "@/libs/supabseClient";

export default function EditProfile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) console.error(error);
    else setProfile(data || {});
    setLoading(false);
  }

  async function updateProfile(e) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        bio: profile.bio,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
      })
      .eq("id", user.id);

    if (error) alert(error.message);
    else {
      alert("Profile updated!");
      router.refresh();
    }
  }

  // Avatar upload
  async function uploadAvatar(event) {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      // 1️⃣ Get current authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found.");

      // 2️⃣ Prepare file path (inside user.id folder)
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // 3️⃣ Upload file to Supabase Storage (avatars bucket)
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 4️⃣ Get public URL
      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;

      // 5️⃣ Update profile table (must match RLS policy: auth.uid() = id)
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // 6️⃣ Update local state
      setProfile({ ...profile, avatar_url: publicUrl });
      alert("Avatar updated successfully!");
      router.refresh(); // reload page/profile
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <Message>Loading profile...</Message>;

  return (
    <Container>
      <Title>Edit Profile</Title>

      {/* Avatar */}
      <AvatarWrapper>
        {profile.avatar_url ? (
          <Avatar src={profile.avatar_url} alt="Avatar" />
        ) : (
          <AvatarPlaceholder>No Avatar</AvatarPlaceholder>
        )}
        <Label>
          {uploading ? "Uploading..." : "Change Avatar"}
          <HiddenInput
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </Label>
      </AvatarWrapper>

      {/* Form */}
      <Form onSubmit={updateProfile}>
        <FormGroup>
          <LabelText>Full Name</LabelText>
          <Input
            type="text"
            value={profile.full_name || ""}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
            placeholder="Enter full name"
          />
        </FormGroup>

        <FormGroup>
          <LabelText>Username</LabelText>
          <Input
            type="text"
            value={profile.username || ""}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
            placeholder="Enter username"
          />
        </FormGroup>

        <FormGroup>
          <LabelText>Bio</LabelText>
          <Textarea
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tell something about yourself..."
          />
        </FormGroup>

        <Button type="submit">Save Changes</Button>
      </Form>
    </Container>
  );
}

/* ----------------- STYLED COMPONENTS ----------------- */
const Container = styled.div` 
  max-width: 450px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
  border: 2px solid #ddd;
`;

const AvatarPlaceholder = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #f3f3f3;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
`;

const Label = styled.label`
  cursor: pointer;
  color: #2563eb;
  font-size: 0.9rem;
  &:hover {
    text-decoration: underline;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelText = styled.label`
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const Textarea = styled.textarea`
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: none;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #1d4ed8;
  }
`;

const Message = styled.p`
  text-align: center;
  margin-top: 2rem;
  font-size: 1rem;
  color: #555;
`;
