"use client";

import { useEffect, useState } from "react";

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  className,
}) {
  const [visible, setVisible] = useState(false);
  const [internal, setInternal] = useState(value ?? "");

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const handleChange = (e) => {
    setInternal(e.target.value);
    if (onChange) onChange(e);
  };

  const inputValue = value !== undefined ? value : internal;

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`${className ?? ""} pr-10`}
      />

      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
      >
        {visible ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3 3l18 18-1.5 1.5L18.6 21c-1.7.9-3.6 1.4-5.6 1.4C7 22.4 3.6 19.1 1.9 15c.8-2.1 2.2-3.9 4-5.1L3 3zM12 5c2 .1 3.9.7 5.6 1.6l-1.6 1.6C14.9 8 13.5 7.7 12 7.7c-3.9 0-7 2.4-8.6 5.6 1.1 2.3 3.1 4.1 5.6 5.1l-1.5 1.5C7.8 20 9.8 20.6 12 20.6c5 0 9.1-3.6 10.7-8.6C21 8 16.5 5 12 5z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 5c-4.4 0-8 3-9.6 7 1.6 4 5.2 7 9.6 7s8-3 9.6-7C20 8 16.4 5 12 5zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zM12 9a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
        )}
      </button>
    </div>
  );
}
