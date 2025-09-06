// app/profile/[username]/page.jsx

import ProfileClient from "./ProfileClient";

export default function Page({ params }) {
  // pass the param through (Next usually decodes it for you, but be explicit)
  const username = decodeURIComponent(params.idProfileUser || "");
  return <ProfileClient username={username} />;
}
