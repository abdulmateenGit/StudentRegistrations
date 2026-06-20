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

// ADDED: Download Icon
export const Download = (props) => (
  <SvgWrapper {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </SvgWrapper>
);

// ADDED: Plus Icon (useful for add buttons)
export const Plus = (props) => (
  <SvgWrapper {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </SvgWrapper>
);

// ADDED: ChevronDown Icon (useful for dropdowns)
export const ChevronDown = (props) => (
  <SvgWrapper {...props}>
    <polyline points="6 9 12 15 18 9" />
  </SvgWrapper>
);

// ADDED: ChevronUp Icon
export const ChevronUp = (props) => (
  <SvgWrapper {...props}>
    <polyline points="18 15 12 9 6 15" />
  </SvgWrapper>
);

// ADDED: Menu Icon (hamburger menu)
export const Menu = (props) => (
  <SvgWrapper {...props}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </SvgWrapper>
);

// ADDED: User Icon
export const User = (props) => (
  <SvgWrapper {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </SvgWrapper>
);

// ADDED: Calendar Icon
export const Calendar = (props) => (
  <SvgWrapper {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </SvgWrapper>
);

// ADDED: AlertCircle Icon (for warnings/errors)
export const AlertCircle = (props) => (
  <SvgWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </SvgWrapper>
);

// ADDED: CheckCircle Icon (for success)
export const CheckCircle = (props) => (
  <SvgWrapper {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </SvgWrapper>
);

export default SvgWrapper;