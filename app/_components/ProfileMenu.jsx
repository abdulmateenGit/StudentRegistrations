"use client";

import { useState, useRef, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import { createClient } from "../../utils/supabase/client";

export default function ProfileMenu({ onResetPassword }) {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error && data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getEmailInitials = (email) => {
    if (!email) return "?";
    const parts = email.split("@")[0].split(".");
    return parts.map((part) => part.charAt(0).toUpperCase()).join("");
  };

  const getEmailUsername = (email) => {
    if (!email) return "User";
    return email.split("@")[0];
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-900"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold">
          {getEmailInitials(userEmail)}
        </div>
        <span className="hidden sm:inline max-w-30 truncate">
          {getEmailUsername(userEmail)}
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-3xl border border-white/10 bg-zinc-950 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
          <div className="mb-3 rounded-2xl bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
            <p className="font-semibold text-white">Signed in as</p>
            <p className="truncate text-zinc-400">{userEmail || "Unknown user"}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onResetPassword();
            }}
            className="w-full rounded-2xl px-4 py-3 text-left text-sm text-zinc-200 transition hover:bg-white/5"
          >
            Reset password
          </button>
          <div className="mt-2 border-t border-white/10" />
          <LogoutButton className="w-full rounded-2xl px-4 py-3 text-left text-sm text-zinc-200 transition hover:bg-white/5" />
        </div>
      ) : null}
    </div>
  );
}
