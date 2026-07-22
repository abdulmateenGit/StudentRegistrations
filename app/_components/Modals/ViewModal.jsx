import React from "react";
import { X } from "../Icons";

export default function ViewModal({ student, open, onClose, onPrintInvoice }) {
  if (!open || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900">
        <button
          onClick={onClose}
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
                <p className="mt-1 font-medium">{student.studentName}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Date of Birth
                </label>
                <p className="mt-1 font-medium">{student.dob}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Class
                </label>
                <p className="mt-1 font-medium">
                  {student.class?.toUpperCase() || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Student Contact
                </label>
                <p className="mt-1 font-medium">{student.studentContact}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Parent Name
                </label>
                <p className="mt-1 font-medium">{student.parentName}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Parent CNIC
                </label>
                <p className="mt-1 font-medium">{student.parentCnic || "N/A"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Parent Contact
                </label>
                <p className="mt-1 font-medium">{student.parentContact}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Registration Fee
                </label>
                <p className="mt-1 font-medium">
                  Rs. {student.registrationFee?.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">
                  Registration Date
                </label>
                <p className="mt-1 font-medium">{student.registrationDate}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                onPrintInvoice?.(student);
                onClose();
              }}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 hover:bg-zinc-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
