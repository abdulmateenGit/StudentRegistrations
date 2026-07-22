export const STORAGE_KEY = "student_registrations";
export const RECORDS_PER_PAGE = 10;

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const DATE_OF_BIRTH_PATTERN =
  /^(0[1-9]|[12][0-9]|3[01])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{4})$/;

export const DISCOUNTED_FEE_CLASSES = new Set(["a1", "a2", "dp1", "dp2"]);

export function normalizeDateOfBirth(value) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);
  if (!match) return raw;

  const month = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase();
  return `${match[1]}-${month}-${match[3]}`;
}

export function isValidDateOfBirth(value) {
  const normalized = normalizeDateOfBirth(value);
  const match = DATE_OF_BIRTH_PATTERN.exec(normalized);
  if (!match) return false;

  const day = Number(match[1]);
  const month = MONTHS.indexOf(match[2]);
  const year = Number(match[3]);
  if (month === -1) return false;

  const date = new Date(year, month, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
}

export function getRegistrationFee(classValue) {
  if (!classValue) return null;
  return DISCOUNTED_FEE_CLASSES.has(classValue) ? 3000 : 10000;
}

export function formatCnic(value) {
  if (value === null || value === undefined) return "";

  const digits = String(value).replace(/\D/g, "").slice(0, 13);
  if (!digits) return "";
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;

  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

export function isValidCnic(value) {
  return /^[0-9]{5}-[0-9]{7}-[0-9]$/.test(value);
}

export function formatDateForDisplay(date) {
  const inputDate = date instanceof Date ? date : new Date(date);
  const day = String(inputDate.getDate()).padStart(2, "0");
  const month = MONTHS[inputDate.getMonth()];
  const year = inputDate.getFullYear();
  return `${day}-${month}-${year}`;
}

export function parseDateString(dateStr) {
  const parts = String(dateStr ?? "").split("-");
  if (parts.length !== 3) return new Date(0);

  const day = Number(parts[0]);
  const month = MONTHS.indexOf(parts[1]);
  const year = Number(parts[2]);
  if (Number.isNaN(day) || month === -1 || Number.isNaN(year)) {
    return new Date(0);
  }

  return new Date(year, month, day);
}

export function getStoredRegistrations() {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveStoredRegistrations(registrations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}

export function buildRegistrationPayload({
  id,
  studentName,
  dob,
  parentName,
  parentCnic,
  studentContact,
  parentContact,
  className,
  registrationFee,
  registrationDate,
  timestamp,
}) {
  const digitsOnly = (value) => String(value || "").replace(/\D+/g, "");
  const toNumberOrNull = (value) => {
    const digits = digitsOnly(value);
    return digits ? Number(digits) : null;
  };

  const parseDobToIso = (dobStr) => {
    if (!dobStr) return null;
    const parts = dobStr.split("-");
    if (parts.length !== 3) return null;
    const day = Number(parts[0]);
    const mon = parts[1];
    const yr = Number(parts[2]);
    const monthIndex = MONTHS.indexOf(mon);
    if (monthIndex === -1 || Number.isNaN(day) || Number.isNaN(yr)) return null;

    const month = String(monthIndex + 1).padStart(2, "0");
    const dayText = String(day).padStart(2, "0");
    return `${yr}-${month}-${dayText}`;
  };

  return {
    id: id ?? Date.now(),
    studentName,
    dob: parseDobToIso(dob) || dob,
    parentName,
    parentCnic: toNumberOrNull(parentCnic),
    studentContact: toNumberOrNull(studentContact),
    parentContact: toNumberOrNull(parentContact),
    class: className,
    registrationFee,
    registrationDate: registrationDate ?? formatDateForDisplay(new Date()),
    timestamp: timestamp ?? new Date().toISOString(),
  };
}

export function mapRegistrationFromApi(record) {
  return {
    id: record.id,
    studentName: record.student_name || record.studentName || "",
    dob: normalizeDateOfBirth(record.dob) || normalizeDateOfBirth(record.registration_date) || "",
    parentName: record.parent_name || record.parentName || "",
    parentCnic: formatCnic(record.parent_cnic || record.parentCnic || ""),
    studentContact: record.student_contact || record.studentContact || "",
    parentContact: record.parent_contact || record.parentContact || "",
    class: record.class || record.className || "",
    registrationFee: record.registration_fee || record.registrationFee || 0,
    registrationDate:
      normalizeDateOfBirth(record.registration_date) || record.registrationDate || "",
    raw: record,
  };
}
