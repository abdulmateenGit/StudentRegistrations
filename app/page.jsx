"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  buildRegistrationPayload,
  formatDateForDisplay,
  getRegistrationFee,
  isValidCnic,
  isValidDateOfBirth,
  normalizeDateOfBirth,
} from "./_models/registrationModel";

const inputClassName =
  "w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500";

const labelClassName =
  "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const MONTHS = [
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

export default function Home() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [parentCnic, setParentCnic] = useState("");
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    studentContact: "",
    parentContact: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const registrationFee = getRegistrationFee(selectedClass);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("editStudent");
      if (!raw) return;

      const student = JSON.parse(raw);
      sessionStorage.removeItem("editStudent");

      setFormData({
        studentName: student.studentName || "",
        parentName: student.parentName || "",
        studentContact: student.studentContact || "",
        parentContact: student.parentContact || "",
      });
      setSelectedClass(student.class || "");
      setDateOfBirth(student.dob || "");
      setParentCnic(student.parentCnic || "");
      setIsEditing(true);
      setEditingId(student.id || null);
    } catch (e) {
      // ignore JSON errors
    }
  }, []);

  const handleDateOfBirthBlur = () => {
    if (!dateOfBirth.trim()) {
      setDateOfBirthError("");
      return;
    }

    const normalized = normalizeDateOfBirth(dateOfBirth);
    setDateOfBirth(normalized);

    if (!isValidDateOfBirth(normalized)) {
      setDateOfBirthError("Enter a valid date in dd-mmm-yyyy format.");
      return;
    }

    setDateOfBirthError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidDateOfBirth(dateOfBirth)) {
      setDateOfBirthError("Enter a valid date in dd-mmm-yyyy format.");
      return;
    }

    if (!isValidCnic(parentCnic)) {
      alert("Please enter a valid CNIC number in format: XXXXX-XXXXXXX-X");
      return;
    }

    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    if (!registrationFee) {
      alert("Registration fee could not be calculated");
      return;
    }

    const registration = buildRegistrationPayload({
      id: isEditing && editingId ? editingId : undefined,
      studentName: formData.studentName,
      dob: dateOfBirth,
      parentName: formData.parentName,
      parentCnic,
      studentContact: formData.studentContact,
      parentContact: formData.parentContact,
      className: selectedClass,
      registrationFee,
      registrationDate: formatDateForDisplay(new Date()),
    });

    // Send to server API which will insert or update into Supabase
    fetch('/api/registrations', {
      method: isEditing ? 'PUT' : 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registration),
    })
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload?.error || 'Failed to save registration');
        }
        return res.json();
      })
      .then(() => {
        setIsEditing(false);
        setEditingId(null);
        router.push('/registrations');
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || 'Failed to save registration. See console for details.');
      });
  };

  const handleReset = () => {
    setSelectedClass("");
    setDateOfBirth("");
    setDateOfBirthError("");
    setParentCnic("");
    setFormData({
      studentName: "",
      parentName: "",
      studentContact: "",
      parentContact: "",
    });
  };

  const goToRegistrationsList = () => {
    router.push("/registrations");
  };

  return (
    <div className="min-h-full bg-linear-to-br from-indigo-50 via-white to-violet-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
      <main className="flex min-h-full flex-col items-center px-4 py-4 sm:px-6">
        <div className="w-full max-w-3xl">
          <div className="mb-4 flex justify-center">
            <div>
              <Image
                src="/Trinity-2.png"
                alt="Trinity School Lahore logo"
                width={140}
                height={175}
                className="h-32 w-auto object-contain sm:h-36"
                priority
              />
            </div>
          </div>

          <div className="mb-5 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Student Registration Form
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Please fill in all the details below to complete registration.
            </p>
          </div>

          {/* View Registrations Button */}
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={goToRegistrationsList}
              className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:border-indigo-300 dark:border-indigo-800 dark:bg-zinc-900 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
            >
              <svg 
                className="h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              View All Registrations
            </button>
          </div>

          <form
            className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-xl shadow-zinc-200/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none sm:p-8"
            onReset={handleReset}
            onSubmit={handleSubmit}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="studentName" className={labelClassName}>
                  Student Name
                </label>
                <input
                  id="studentName"
                  name="studentName"
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className={labelClassName}>
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="text"
                  required
                  autoComplete="bday"
                  placeholder="dd-mmm-yyyy"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    if (dateOfBirthError) setDateOfBirthError("");
                  }}
                  onBlur={handleDateOfBirthBlur}
                  pattern="(0[1-9]|[12][0-9]|3[01])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9]{4}"
                  title="Use format dd-mmm-yyyy, e.g. 15-Jan-2005"
                  aria-invalid={dateOfBirthError ? true : undefined}
                  aria-describedby={
                    dateOfBirthError ? "dateOfBirthError" : "dateOfBirthHint"
                  }
                  className={`${inputClassName}${dateOfBirthError ? " border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                />
                {dateOfBirthError ? (
                  <p
                    id="dateOfBirthError"
                    className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                  >
                    {dateOfBirthError}
                  </p>
                ) : (
                  <p
                    id="dateOfBirthHint"
                    className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    Format: dd-mmm-yyyy (e.g. 15-Jan-2005)
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="class" className={labelClassName}>
                  Class
                </label>
                <select
                  id="class"
                  name="class"
                  required
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className={inputClassName}
                >
                  <option value="" disabled>
                    Select class
                  </option>
                  <option value="nursery-pyp">Nursery - PYP</option>
                  <option value="kg-pyp">Pre K - PYP</option>
                  <option value="preparatory-pyp">Kindergarten - PYP</option>
                  <option value="grade-1-pyp">Grade 1 - PYP</option>
                  <option value="grade-2-pyp">Grade 2 - PYP</option>
                  <option value="grade-3-pyp">Grade 3 - PYP</option>
                  <option value="grade-4-pyp">Grade 4 - PYP</option>
                  <option value="grade-5-pyp">Grade 5 - PYP</option>
                  <option value="grade-6-myp">Grade 6 - MYP</option>
                  <option value="grade-7-myp">Grade 7 - MYP</option>
                  <option value="grade-8-myp">Grade 8 - MYP</option>
                  <option value="grade-9-myp">Grade 9 - MYP</option>
                  <option value="grade-9-hs">Grade 9 - HS</option>
                  <option value="grade-10-hs">Grade 10 - HS</option>
                  <option value="grade-11-hs">Grade 11 - HS</option>
                  <option value="grade-12-hs">Grade 12 - HS</option>
                  <option value="dp1">Class 11 - DP1</option>
                  <option value="dp2">Class 12 - DP2</option>
                  <option value="a1">A1</option>
                  <option value="a2">A2</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="parentName" className={labelClassName}>
                  Father or Mother Name
                </label>
                <input
                  id="parentName"
                  name="parentName"
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={handleInputChange}
                  placeholder="Enter parent/guardian name"
                  className={inputClassName}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="parentCnic" className={labelClassName}>
                  Father or Mother CNIC Number
                </label>
                <input
                  id="parentCnic"
                  name="parentCnic"
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="XXXXX-XXXXXXX-X"
                  value={parentCnic}
                  onChange={(e) => setParentCnic(formatCnic(e.target.value))}
                  maxLength={15}
                  pattern="[0-9]{5}-[0-9]{7}-[0-9]"
                  title="Enter a 13-digit CNIC number"
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="studentContact" className={labelClassName}>
                  Student Contact Number
                </label>
                <input
                  id="studentContact"
                  name="studentContact"
                  type="tel"
                  required
                  value={formData.studentContact}
                  onChange={handleInputChange}
                  placeholder="03XX-XXXXXXX"
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="parentContact" className={labelClassName}>
                  Parent Contact Number
                </label>
                <input
                  id="parentContact"
                  name="parentContact"
                  type="tel"
                  required
                  value={formData.parentContact}
                  onChange={handleInputChange}
                  placeholder="03XX-XXXXXXX"
                  className={inputClassName}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="registrationFee" className={labelClassName}>
                  Registration Fee
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                    Rs.
                  </span>
                  <input
                    type="hidden"
                    name="registrationFee"
                    value={registrationFee ?? ""}
                    required
                  />
                  <input
                    id="registrationFee"
                    type="text"
                    readOnly
                    tabIndex={-1}
                    value={
                      registrationFee !== null
                        ? registrationFee.toLocaleString()
                        : ""
                    }
                    placeholder="Select a class"
                    aria-describedby="registrationFeeHint"
                    className={`${inputClassName} cursor-not-allowed bg-zinc-50 pl-11 dark:bg-zinc-800/50`}
                  />
                </div>
                <p
                  id="registrationFeeHint"
                  className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400"
                >
                  {registrationFee === 3000
                    ? "Rs. 3,000 for A1, A2, Class 11 - DP1, and Class 12 - DP2."
                    : registrationFee === 10000
                      ? "Rs. 10,000 for all other classes."
                      : "Fee is set automatically based on the selected class."}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="reset"
                className="rounded-lg border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Reset
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              >
                Submit Registration
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}