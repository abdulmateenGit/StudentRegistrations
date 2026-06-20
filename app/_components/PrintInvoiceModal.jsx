"use client";

import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { X, Printer } from './Icons';
import MultiCopyInvoice from './MultiCopyInvoice';

const PrintInvoiceModal = ({ student, onClose }) => {
  const printRef = useRef(null);

  if (!student) return null;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          background: white !important;
        }
      }
    `,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        // Ensure content is ready
        setTimeout(resolve, 100);
      });
    },
    onPrintError: (error) => {
      console.error('Print error:', error);
      // Fallback: try using window.print()
      window.print();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-zinc-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Registration Invoice</h2>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              <Printer size={18} />
              Print All Copies
            </button>
          </div>

          <div ref={printRef}>
            <MultiCopyInvoice 
              student={student} 
              receiptNumber={student.id || 1} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoiceModal;