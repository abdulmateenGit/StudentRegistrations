import Link from "next/link";
import PasswordResetForm from "./PasswordResetForm";

export default function PasswordResetPage() {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.95),transparent_55%)] text-zinc-100">
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/90 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Reset password</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Enter your email to receive a reset link, or continue with a recovery link from your email.
            </p>
          </div>

          <PasswordResetForm />

          <div className="mt-6 text-center text-sm text-zinc-400">
            Remembered your password?{' '}
            <Link href="/login" className="font-medium text-blue-300 transition hover:text-blue-200">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
