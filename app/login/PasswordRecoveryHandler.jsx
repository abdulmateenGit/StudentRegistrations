"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import PasswordInput from "../_components/PasswordInput";

export default function PasswordRecoveryHandler({ initialError, initialMessage }) {
  const [status, setStatus] = useState({ type: "idle", text: null });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    const queryParams = new URLSearchParams(search);
    const type = queryParams.get("type") || hashParams.get("type");
    const error = queryParams.get("error") || hashParams.get("error");
    const errorDescription = queryParams.get("error_description") || hashParams.get("error_description");

    if (error) {
      setStatus({ type: "error", text: errorDescription || error });
    }

    if (type !== "recovery") {
      if (!error) {
        if (initialError) setStatus({ type: "error", text: initialError });
        else if (initialMessage) setStatus({ type: "success", text: initialMessage });
      }
      return;
    }

    setRecoveryMode(true);
    setIsVerifying(true);
    if (typeof supabase.auth.getSessionFromUrl === "function") {
      supabase.auth.getSessionFromUrl({ storeSession: true }).then(async ({ data, error }) => {
        setIsVerifying(false);
        if (error) {
          setStatus({ type: "error", text: error.message });
          return;
        }

        if (data?.session) {
          setStatus({ type: "success", text: "Reset link verified. Enter a new password below." });
        } else if (!error) {
          setStatus({ type: "error", text: "Unable to verify password reset link. Please request a new one." });
        }
      });
    } else {
      (async () => {
        const { data, error } = await supabase.auth.getSession();
        setIsVerifying(false);
        if (error) {
          setStatus({ type: "error", text: error.message });
          return;
        }

        if (data?.session) {
          setStatus({ type: "success", text: "Reset link verified. Enter a new password below." });
        } else {
          setStatus({ type: "error", text: "Unable to verify password reset link. Please request a new one." });
        }
      })();
    }
  }, [initialError, initialMessage, supabase]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();
    if (trimmedPassword.length < 6) {
      setStatus({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (trimmedPassword !== trimmedConfirm) {
      setStatus({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsUpdating(true);
    setStatus({ type: "idle", text: null });

    const { error } = await supabase.auth.updateUser({ password });
    setIsUpdating(false);

    if (error) {
      setStatus({ type: "error", text: error.message });
      return;
    }

    window.location.href = "/login?message=" + encodeURIComponent("Your password has been updated. Sign in with your new password.");
  };

  if (!recoveryMode) {
    if (!status.text) return null;

    return (
      <div className={`mb-4 rounded-md px-3 py-2 text-sm ${status.type === "success" ? "bg-emerald-900/60 text-emerald-100" : "bg-red-900/60 text-red-100"}`}>
        {status.text}
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-3xl border border-white/10 bg-zinc-950/80 p-5 text-sm text-zinc-100 shadow-lg">
      {status.text ? (
        <div className={`mb-4 rounded-2xl px-3 py-2 ${status.type === "success" ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
          {status.text}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-sm text-zinc-300">New password</label>
          <PasswordInput
            id="new-password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-zinc-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-blue-500/60"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm text-zinc-300">Confirm password</label>
          <PasswordInput
            id="confirm-password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-zinc-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-blue-500/60"
          />
        </div>

        <button
          type="submit"
          disabled={isUpdating || password.trim().length < 6 || password.trim() !== confirmPassword.trim()}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUpdating ? "Updating…" : "Set new password"}
        </button>
      </form>
    </div>
  );
}
