import Link from "next/link";

export default function SignupSuccessPage() {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(60%_80%_at_50%_0%,#0b1220_0%,#0a0a0b_60%,#060607_100%)] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.03),transparent_20%)] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 px-8 py-6">
            <h1 className="text-xl font-semibold tracking-tight">Confirm your email</h1>
            <p className="text-sm text-zinc-400">A confirmation link has been sent to the email address you provided.</p>
          </div>

          <div className="px-8 py-6 space-y-4">
            <div className="rounded-2xl bg-zinc-950/70 p-4 text-sm leading-6 text-zinc-200">
              <p>Please open your email inbox and click the confirmation button in the message.</p>
              <p className="pt-2 text-zinc-400">Once confirmed, you should be returned to the deployed app URL.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
              <p>If you do not see the email, check your spam folder or try again with a different address.</p>
            </div>

            <Link
              href="/login"
              className="block rounded-xl bg-blue-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Back to sign in
            </Link>
          </div>

          <div className="rounded-b-2xl border-t border-white/10 bg-black/20 px-8 py-4 text-xs text-zinc-500">
            If the confirmation page does not redirect, use the link in the email directly.
          </div>
        </div>
      </div>
    </div>
  );
}
