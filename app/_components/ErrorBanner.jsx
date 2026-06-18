"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  if (!error) return null;
  return (
    <div className="mb-4 rounded-md bg-red-900/60 px-3 py-2 text-sm text-red-100">
      {error}
    </div>
  );
}
