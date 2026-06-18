import React from "react";

const SvgWrapper = ({ size = 16, className = "", children, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    {children}
  </svg>
);

export const Eye = (props) => (
  <SvgWrapper {...props}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </SvgWrapper>
);

export const Pencil = (props) => (
  <SvgWrapper {...props}>
    <path d="M3 21v-3l11-11 3 3L6 21H3z" />
    <path d="M14 7l3 3" />
  </SvgWrapper>
);

export const Printer = (props) => (
  <SvgWrapper {...props}>
    <rect x="6" y="9" width="12" height="8" rx="2" />
    <path d="M6 14H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M8 21h8" />
  </SvgWrapper>
);

export const Trash2 = (props) => (
  <SvgWrapper {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </SvgWrapper>
);

export const Search = (props) => (
  <SvgWrapper {...props}>
    <circle cx="11" cy="11" r="6" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </SvgWrapper>
);

export const ArrowUpDown = (props) => (
  <SvgWrapper {...props}>
    <path d="M12 19V5" />
    <polyline points="19 12 12 19 5 12" />
  </SvgWrapper>
);

export const X = (props) => (
  <SvgWrapper {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </SvgWrapper>
);

export default SvgWrapper;
