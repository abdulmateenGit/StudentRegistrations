"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import PasswordInput from "../_components/PasswordInput";

function parseHashParams(hash) {
  return new URLSearchParams(hash?.startsWith("#") ? hash.slice(1) : hash || "");
}

export default function PasswordResetForm() {
  const [mode, setMode] = useState("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasSignedOut, setHasSignedOut] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryType = searchParams.get("type");
    const hashParams = parseHashParams(window.location.hash);
    const hashType = hashParams.get("type");
    const type = queryType || hashType;

    const signOutExistingSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        await supabase.auth.signOut();
      }
      setHasSignedOut(true);
    };

    if (type === "recovery") {
      setMode("recovery");

      // Verify the recovery/session from the URL first, before signing out any existing session.
      (async () => {
        setIsVerifying(true);

        if (typeof supabase.auth.getSessionFromUrl === "function") {
          const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
          setIsVerifying(false);

          if (error) {
            setMessage({ type: "error", text: error.message });
            return;
          }

          if (!data?.session) {
            setMessage({ type: "error", text: "Unable to verify reset link. Please request a new link." });
            return;
          }

          setMessage({ type: "success", text: "Reset link verified. Enter a new password below." });
        } else {
          // Fallback for newer/alternative Supabase clients where getSessionFromUrl is not exposed
          const { data, error } = await supabase.auth.getSession();
          setIsVerifying(false);

          if (error) {
            setMessage({ type: "error", text: error.message });
            return;
          }

          if (!data?.session) {
            setMessage({ type: "error", text: "Unable to verify reset link. Please request a new link." });
            return;
          }

          setMessage({ type: "success", text: "Reset link verified. Enter a new password below." });
        }
      })();

      return;
    }

    signOutExistingSession();
  }, [supabase]);

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const redirectTo = `${window.location.origin}/password-reset?type=recovery`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    setIsLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({ type: "success", text: "Password reset email sent. Check your inbox." });
  };

  const handleRecoverySubmit = async (event) => {
    event.preventDefault();
    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    window.location.href = "/login?message=" + encodeURIComponent("Your password has been updated. Sign in with your new password.");
  };

  const trimmedPassword = password.trim();
  const trimmedConfirm = confirmPassword.trim();
  const isValid = trimmedPassword.length >= 6 && trimmedPassword === trimmedConfirm;

  return (
    <div className="space-y-6">
      <div
        className={`rounded-2xl px-4 py-3 text-sm ${
          message?.type === "success"
            ? "bg-emerald-500/15 text-emerald-200"
            : "bg-rose-500/15 text-rose-200"
        }`}
      >
        {message?.text ?? "Enter your email to receive a reset link or continue with a recovery link from your email."}
      </div>

      {mode === "request" ? (
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-sm text-zinc-300">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Sending…" : "Send reset email"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRecoverySubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm text-zinc-300">
              New password
            </label>
            <PasswordInput
              id="new-password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="New password"
              className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm text-zinc-300">
              Confirm password
            </label>
            <PasswordInput
              id="confirm-password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              placeholder="Confirm password"
              className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Updating…" : "Set new password"}
          </button>
        </form>
      )}
    </div>
  );
}
