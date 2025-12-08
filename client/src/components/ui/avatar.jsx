// add avatar for profile

import React, { useState } from "react";

function initialsOf(name = "", email = "") {
  const src = name?.trim() || email?.trim();
  if (!src) return "?";
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (src[0] || "?").toUpperCase();
}

export default function Avatar({
  src,
  name,
  email,
  size = 56, // px
  className = "",
}) {
  const [broken, setBroken] = useState(false);
  const showImage = src && !broken;

  const style = { width: size, height: size, fontSize: Math.max(12, size / 3.2) };

  return showImage ? (
    <img
      src={src}
      alt={name || email || "avatar"}
      onError={() => setBroken(true)}
      className={`rounded-full object-cover ${className}`}
      style={style}
    />
  ) : (
    <div
      className={`grid place-items-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-100 text-neutral-700 font-semibold ${className}`}
      style={style}
      title={name || email}
    >
      {initialsOf(name, email)}
    </div>
  );

}
