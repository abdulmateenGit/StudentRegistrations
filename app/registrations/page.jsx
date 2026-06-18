"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Pencil,
  Printer,
  Trash2,
  Search,
  ArrowUpDown,
  X,
} from "../_components/Icons";
import { useRouter } from "next/navigation";
import PrintInvoiceModal from "../_components/PrintInvoiceModal";
import LogoutButton from "../_components/LogoutButton";

// Storage key
const STORAGE_KEY = "student_registrations";

// Helper to get registrations
const getRegistrations = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save registrations
const saveRegistrations = (registrations) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
};

// Helper function to parse date string (dd-mmm-yyyy) to Date object
const parseDate = (dateStr) => {
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  return new Date(0);
};

const formatCnic = (value) => {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
};

export default function RegistrationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("studentName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [registrations, setRegistrations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    // Load registrations from server API
    fetch("/api/registrations", { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((payload) => {
        const list = payload?.data ?? [];
        // Map DB fields to UI-friendly keys
        const isoToDisplay = (iso) => {
          if (!iso) return "";
          // if already dd-MMM-YYYY, return as-is
          if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(iso)) return iso;
          // if ISO YYYY-MM-DD convert to dd-MMM-YYYY
          const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
          if (!m) return iso;
          const [_, y, mm, dd] = m;
          const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          const mi = Number(mm) - 1;
          if (mi < 0 || mi > 11) return iso;
          return `${dd}-${monthNames[mi]}-${y}`;
        };

        const mapped = list.map((r) => ({
          id: r.id,
          studentName: r.student_name || r.studentName || "",
          dob: isoToDisplay(r.dob) || isoToDisplay(r.registration_date) || "",
          parentName: r.parent_name || r.parentName || "",
          parentCnic: r.parent_cnic || r.parentCnic || "",
          studentContact: r.student_contact || r.studentContact || "",
          parentContact: r.parent_contact || r.parentContact || "",
          class: r.class || r.className || "",
          registrationFee: r.registration_fee || r.registrationFee || 0,
          registrationDate: isoToDisplay(r.registration_date) || r.registrationDate || "",
          raw: r,
        }));
        setRegistrations(mapped);
      })
      .catch((err) => {
        console.error("Failed to load registrations:", err);
        // fallback to localStorage
        const loaded = getRegistrations();
        setRegistrations(loaded);
      });
  }, []);

  // Sorting function
  const sortStudents = (students) => {
    const sorted = [...students];

    switch (sortBy) {
      case "registrationFee":
        sorted.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.registrationFee - b.registrationFee;
          } else {
            return b.registrationFee - a.registrationFee;
          }
        });
        break;

      case "registrationDate":
        sorted.sort((a, b) => {
          const dateA = parseDate(a.registrationDate);
          const dateB = parseDate(b.registrationDate);
          if (sortOrder === "asc") {
            return dateA.getTime() - dateB.getTime();
          } else {
            return dateB.getTime() - dateA.getTime();
          }
        });
        break;

      case "studentName":
      default:
        sorted.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.studentName.localeCompare(b.studentName);
          } else {
            return b.studentName.localeCompare(a.studentName);
          }
        });
        break;
    }

    return sorted;
  };

  // Filter and sort students
  const filteredAndSortedStudents = sortStudents(
    registrations.filter(
      (student) =>
        student.studentName.toLowerCase().includes(search.toLowerCase()) ||
        student.parentName.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    // Call API to delete
    fetch("/api/registrations", {
      method: "DELETE",
      credentials: 'same-origin',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(() => {
        const updated = registrations.filter((s) => s.id !== id);
        setRegistrations(updated);
      })
      .catch((err) => {
        console.error("Failed to delete registration:", err);
        alert("Failed to delete. See console for details.");
      });
  };

  const handleEdit = (student) => {
    const editedStudent = {
      id: student.id,
      studentName: student.student_name ?? student.studentName ?? "",
      parentName: student.parent_name ?? student.parentName ?? "",
      studentContact: student.student_contact ?? student.studentContact ?? "",
      parentContact: student.parent_contact ?? student.parentContact ?? "",
      parentCnic: formatCnic(student.parent_cnic ?? student.parentCnic ?? ""),
      class: student.class ?? student.className ?? "",
      dob: student.dob ?? student.registration_date ?? student.registrationDate ?? "",
    };

    sessionStorage.setItem("editStudent", JSON.stringify(editedStudent));
    router.push("/");
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handlePrintInvoice = (student) => {
    setSelectedStudent(student);
    setShowInvoiceModal(true);
  };

  const handleSort = (sortField) => {
    if (sortBy === sortField) {
      // Toggle order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New field, set to ascending by default
      setSortBy(sortField);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field)
      return <ArrowUpDown size={16} className="opacity-50" />;
    return (
      <ArrowUpDown
        size={16}
        className={sortOrder === "asc" ? "rotate-0" : "rotate-180"}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Student Registrations
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                View and manage all student registrations. Total:{" "}
                {registrations.length} students
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push("/")}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
              >
                New Registration
              </button>
              <LogoutButton />
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                type="text"
                placeholder="Search student or parent..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort("studentName")}
                  className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition ${
                    sortBy === "studentName"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  }`}
                >
                  Name
                  {getSortIcon("studentName")}
                </button>

                <button
                  onClick={() => handleSort("registrationDate")}
                  className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition ${
                    sortBy === "registrationDate"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  }`}
                >
                  Date
                  {getSortIcon("registrationDate")}
                </button>

                <button
                  onClick={() => handleSort("registrationFee")}
                  className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition ${
                    sortBy === "registrationFee"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  }`}
                >
                  Fee
                  {getSortIcon("registrationFee")}
                </button>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-xl shadow-zinc-200/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-zinc-100 dark:bg-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      #
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                      onClick={() => handleSort("studentName")}
                    >
                      <div className="flex items-center gap-2">
                        Student Name
                        {getSortIcon("studentName")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      DOB
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Parent Name
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                      onClick={() => handleSort("registrationFee")}
                    >
                      <div className="flex items-center gap-2">
                        Registration Fee
                        {getSortIcon("registrationFee")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                      onClick={() => handleSort("registrationDate")}
                    >
                      <div className="flex items-center gap-2">
                        Registration Date
                        {getSortIcon("registrationDate")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAndSortedStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className="border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {student.studentName}
                      </td>
                      <td className="px-6 py-4 text-sm">{student.dob}</td>
                      <td className="px-6 py-4 text-sm">
                        {student.parentName}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        Rs. {student.registrationFee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {student.registrationDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(student)}
                            title="View"
                            className="rounded-lg border border-green-200 p-2 text-green-600 transition hover:bg-green-50"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => handleEdit(student)}
                            title="Edit"
                            className="rounded-lg border border-amber-200 p-2 text-amber-600 transition hover:bg-amber-50"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => handlePrintInvoice(student)}
                            title="Print Invoice"
                            className="rounded-lg border border-indigo-200 p-2 text-indigo-600 transition hover:bg-indigo-50"
                          >
                            <Printer size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(student.id)}
                            title="Delete"
                            className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAndSortedStudents.length === 0 && (
                <div className="p-10 text-center text-zinc-500">
                  {registrations.length === 0
                    ? "No registrations yet. Click 'New Registration' to add one."
                    : "No registrations found matching your search."}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* View Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <h2 className="mb-6 text-2xl font-bold">Student Details</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500">
                      Student Name
                    </label>
                    <p className="mt-1 font-medium">
                      {selectedStudent.studentName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">
                      Date of Birth
                    </label>
                    <p className="mt-1 font-medium">{selectedStudent.dob}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">
                      Class
                    </label>
                    <p className="mt-1 font-medium">
                      {selectedStudent.class || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">
                      Parent Name
                    </label>
                    <p className="mt-1 font-medium">
                      {selectedStudent.parentName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">
                      Parent CNIC
                    </label>
                    <p className="mt-1 font-medium">
                      {selectedStudent.parentCnic || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">
                      Student Contact
                    </label>
                    <p className="mt-1 font-medium">
                      {selectedStudent.studentContact}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">
                      Parent Contact
                    </label>
                    <p className="mt-1 font-medium">
                      {selectedStudent.parentContact}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">
                      Registration Fee
                    </label>
                    <p className="mt-1 font-medium">
                      Rs. {selectedStudent.registrationFee.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">
                      Registration Date
                    </label>
                    <p className="mt-1 font-medium">
                      {selectedStudent.registrationDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    handlePrintInvoice(selectedStudent);
                    setShowModal(false);
                  }}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  Print Invoice
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 hover:bg-zinc-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <PrintInvoiceModal
          student={selectedStudent}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}
