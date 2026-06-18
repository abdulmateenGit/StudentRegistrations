"use client";

import React from 'react';
import { X, Printer } from './Icons';
import MultiCopyInvoice from './MultiCopyInvoice';

const PrintInvoiceModal = ({ student, onClose }) => {
  if (!student) return null;

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-print-area');
    
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice - ${student.studentName}</title>
              <meta charset="utf-8">
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: Arial, Helvetica, sans-serif;
                  background-color: #f4f6f9;
                  margin: 0;
                  padding: 20px;
                  color: #111;
                }
                
                .receipts-container {
                  max-width: 900px;
                  margin: 0 auto;
                  display: flex;
                  flex-direction: column;
                  gap: 40px;
                }
                
                .receipt-card {
                  background: #fff;
                  padding: 30px;
                  border: 1px dashed #777;
                  position: relative;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                
                .receipt-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  border-bottom: 2px solid #000;
                  padding-bottom: 15px;
                  margin-bottom: 20px;
                }
                
                .header-left-spacer {
                  width: 150px;
                }
                
                .header-center {
                  text-align: center;
                  flex-grow: 1;
                }
                
                .school-title {
                  font-size: 28px;
                  font-weight: normal;
                  margin: 0;
                  letter-spacing: 0.5px;
                }
                
                .school-location {
                  font-size: 18px;
                  margin: 5px 0 15px 0;
                }
                
                .receipt-badge {
                  display: inline-block;
                  border: 2px solid #000;
                  font-weight: bold;
                  font-size: 16px;
                  padding: 4px 25px;
                  letter-spacing: 1px;
                }
                
                .copy-tag {
                  width: 150px;
                  text-align: right;
                  font-size: 15px;
                  font-weight: 500;
                  margin-top: 5px;
                }
                
                .meta-row {
                  display: grid;
                  grid-template-columns: repeat(4, 1fr);
                  gap: 15px;
                  margin-bottom: 25px;
                }
                
                .meta-field {
                  font-size: 14px;
                }
                
                .meta-field span {
                  font-weight: bold;
                  border-bottom: 1px solid #111;
                  padding-bottom: 2px;
                  display: inline-block;
                  min-width: 80px;
                }
                
                .receipt-body {
                  display: flex;
                  flex-direction: column;
                  gap: 18px;
                  font-size: 15px;
                  margin-bottom: 35px;
                }
                
                .form-line {
                  display: flex;
                  align-items: bottom;
                }
                
                .label {
                  white-space: nowrap;
                  padding-right: 10px;
                  color: #444;
                }
                
                .fill-blank {
                  flex-grow: 1;
                  border-bottom: 1px dotted #444;
                  font-weight: bold;
                  padding-left: 5px;
                  color: #000;
                }
                
                .split-row {
                  display: grid;
                  grid-template-columns: 2fr 1fr;
                  gap: 20px;
                }
                
                .receipt-footer {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 40px;
                  padding-top: 20px;
                }
                
                .signature-block {
                  text-align: center;
                  width: 220px;
                }
                
                .signature-line {
                  border-top: 1px solid #000;
                  margin-top: 25px;
                  font-size: 12px;
                  font-weight: bold;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  color: #333;
                  padding-top: 8px;
                }
                
                @media print {
                  body {
                    background-color: #fff;
                    padding: 0;
                  }
                  .receipt-card {
                    box-shadow: none;
                    page-break-inside: avoid;
                    margin-bottom: 20px;
                  }
                  .print-controls {
                    display: none;
                  }
                }
                
                .print-controls {
                  text-align: center;
                  margin-bottom: 20px;
                  position: sticky;
                  top: 20px;
                  z-index: 1000;
                  background: white;
                  padding: 10px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .print-button {
                  background: #4f46e5;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 8px;
                  cursor: pointer;
                  font-size: 14px;
                  margin: 0 10px;
                }
                
                .close-button {
                  background: #6b7280;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 8px;
                  cursor: pointer;
                  font-size: 14px;
                  margin: 0 10px;
                }
              </style>
            </head>
            <body>
              <div class="print-controls">
                <button class="print-button" onclick="window.print();">🖨️ Print All Copies</button>
                <button class="close-button" onclick="window.close();">✖️ Close</button>
              </div>
              <div class="receipts-container">
                ${printContent.innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full p-6 max-w-4xl overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900">
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

          <div id="invoice-print-area">
            <MultiCopyInvoice 
              student={student} 
              receiptNumber={student.id} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoiceModal;