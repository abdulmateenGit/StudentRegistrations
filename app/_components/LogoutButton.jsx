"use client";

import { logout } from "../(auth)/actions";

export default function LogoutButton({ className = "mt-4 px-4 py-2 bg-red-500 text-white rounded" }) {
  return (
    <form method="post">
      <button
        type="submit"
        formAction={logout}
        className={className}
      >
        Logout
      </button>
    </form>
  );
}
