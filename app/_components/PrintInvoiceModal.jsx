"use client";

import React from 'react';
import { X, Printer } from './Icons';
import MultiCopyInvoice from './MultiCopyInvoice';

const PrintInvoiceModal = ({ student, onClose }) => {
  if (!student) return null;

  const generateInvoiceHTML = () => {
    // Helper function to convert amount to words
    const feeInWords = (amount) => {
      const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
      const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
      const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

      const convertToWords = (num) => {
        if (num === 0) return "Zero";
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100)
          return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
        if (num < 1000)
          return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + convertToWords(num % 100) : "");
        if (num < 100000)
          return convertToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + convertToWords(num % 1000) : "");
        return convertToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 !== 0 ? " " + convertToWords(num % 100000) : "");
      };
      return convertToWords(amount) + " Only";
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return "________";
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[0]}-${parts[1]}-${parts[2].slice(-2)}`;
      }
      return dateStr;
    };

    const registrationDate = student.registrationDate || student.raw?.registration_date || "";
    const className = student.class || student.className || "_____";
    const feeAmount = student.registrationFee || 0;

    const receiptsHTML = `
      <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px;">
        <!-- School Copy -->
        <div style="background: #fff; padding: 30px; border: 1px dashed #777; position: relative; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px;">
            <div style="width: 150px;"></div>
            <div style="text-align: center; flex-grow: 1;">
              <h2 style="font-size: 28px; font-weight: normal; margin: 0; letter-spacing: 0.5px;">The Trinity School</h2>
              <p style="font-size: 18px; margin: 5px 0 15px 0;">Lahore</p>
              <div style="display: inline-block; border: 2px solid #000; font-weight: bold; font-size: 16px; padding: 4px 25px; letter-spacing: 1px;">CASH RECEIPT</div>
            </div>
            <div style="width: 150px; text-align: right; font-size: 15px; font-weight: 500; margin-top: 5px;">School Copy</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; font-size: 14px;">
            <div><span style="font-weight: bold; border-bottom: 1px solid #111; padding-bottom: 2px; display: inline-block; min-width: 80px;">${formatDate(registrationDate)}</span></div>
            <div><span style="font-weight: bold; border-bottom: 1px solid #111; padding-bottom: 2px; display: inline-block; min-width: 80px;">${student.id?.toString().padStart(6, "0") || "000000"}</span></div>
            <div></div>
            <div></div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 18px; font-size: 15px; margin-bottom: 35px;">
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Student Name:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${student.studentName || ""}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Father Name:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${student.parentName || ""}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Class:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${className.toUpperCase() || "_____"}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Registration Fee:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">Rs. ${feeAmount}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Amount in Words:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${feeInWords(feeAmount)}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px;">
            <div style="text-align: center; width: 220px;">
              <div style="border-top: 1px solid #000; margin-top: 25px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #333; padding-top: 8px;">Received by</div>
            </div>
            <div style="text-align: center; width: 220px;">
              <div style="border-top: 1px solid #000; margin-top: 25px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #333; padding-top: 8px;">Principal</div>
            </div>
          </div>
        </div>

        <!-- Personal File Copy -->
        <div style="background: #fff; padding: 30px; border: 1px dashed #777; position: relative; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px;">
            <div style="width: 150px;"></div>
            <div style="text-align: center; flex-grow: 1;">
              <h2 style="font-size: 28px; font-weight: normal; margin: 0; letter-spacing: 0.5px;">The Trinity School</h2>
              <p style="font-size: 18px; margin: 5px 0 15px 0;">Lahore</p>
              <div style="display: inline-block; border: 2px solid #000; font-weight: bold; font-size: 16px; padding: 4px 25px; letter-spacing: 1px;">CASH RECEIPT</div>
            </div>
            <div style="width: 150px; text-align: right; font-size: 15px; font-weight: 500; margin-top: 5px;">Personal File Copy</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; font-size: 14px;">
            <div><span style="font-weight: bold; border-bottom: 1px solid #111; padding-bottom: 2px; display: inline-block; min-width: 80px;">${formatDate(registrationDate)}</span></div>
            <div><span style="font-weight: bold; border-bottom: 1px solid #111; padding-bottom: 2px; display: inline-block; min-width: 80px;">${(student.id ? student.id + 1 : 1).toString().padStart(6, "0")}</span></div>
            <div></div>
            <div></div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 18px; font-size: 15px; margin-bottom: 35px;">
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Student Name:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${student.studentName || ""}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Father Name:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${student.parentName || ""}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Class:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${className.toUpperCase() || "_____"}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Registration Fee:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">Rs. ${feeAmount}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Amount in Words:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${feeInWords(feeAmount)}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px;">
            <div style="text-align: center; width: 220px;">
              <div style="border-top: 1px solid #000; margin-top: 25px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #333; padding-top: 8px;">Received by</div>
            </div>
            <div style="text-align: center; width: 220px;">
              <div style="border-top: 1px solid #000; margin-top: 25px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #333; padding-top: 8px;">Principal</div>
            </div>
          </div>
        </div>

        <!-- Parent Copy -->
        <div style="background: #fff; padding: 30px; border: 1px dashed #777; position: relative; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px;">
            <div style="width: 150px;"></div>
            <div style="text-align: center; flex-grow: 1;">
              <h2 style="font-size: 28px; font-weight: normal; margin: 0; letter-spacing: 0.5px;">The Trinity School</h2>
              <p style="font-size: 18px; margin: 5px 0 15px 0;">Lahore</p>
              <div style="display: inline-block; border: 2px solid #000; font-weight: bold; font-size: 16px; padding: 4px 25px; letter-spacing: 1px;">CASH RECEIPT</div>
            </div>
            <div style="width: 150px; text-align: right; font-size: 15px; font-weight: 500; margin-top: 5px;">Parent Copy</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; font-size: 14px;">
            <div><span style="font-weight: bold; border-bottom: 1px solid #111; padding-bottom: 2px; display: inline-block; min-width: 80px;">${formatDate(registrationDate)}</span></div>
            <div><span style="font-weight: bold; border-bottom: 1px solid #111; padding-bottom: 2px; display: inline-block; min-width: 80px;">${(student.id ? student.id + 2 : 2).toString().padStart(6, "0")}</span></div>
            <div></div>
            <div></div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 18px; font-size: 15px; margin-bottom: 35px;">
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Student Name:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${student.studentName || ""}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Father Name:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${student.parentName || ""}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Class:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${className.toUpperCase() || "_____"}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Registration Fee:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">Rs. ${feeAmount}</span>
            </div>
            <div style="display: flex; align-items: baseline;">
              <span style="white-space: nowrap; padding-right: 10px; color: #444; min-width: 180px; font-size: 13px;">Amount in Words:</span>
              <span style="flex-grow: 1; border-bottom: 1px dotted #444; font-weight: bold; padding-left: 5px; color: #000;">${feeInWords(feeAmount)}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px;">
            <div style="text-align: center; width: 220px;">
              <div style="border-top: 1px solid #000; margin-top: 25px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #333; padding-top: 8px;">Received by</div>
            </div>
            <div style="text-align: center; width: 220px;">
              <div style="border-top: 1px solid #000; margin-top: 25px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #333; padding-top: 8px;">Principal</div>
            </div>
          </div>
        </div>
      </div>
    `;
    return receiptsHTML;
  };

  const handlePrint = () => {
    try {
      // Open new window FIRST (before any async operations)
      const printWindow = window.open('', '_blank', 'width=900,height=1200');
      
      if (!printWindow) {
        // Fallback if popup is blocked
        console.warn('Popup blocked, trying fallback method');
        alert('Please allow popups for this site to print invoices');
        return;
      }

      // Ensure window is focused
      if (printWindow.focus) {
        printWindow.focus();
      }

      // Write content to the new window
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - ${student.studentName}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
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
            ${generateInvoiceHTML()}
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (error) {
      console.error('Error opening print window:', error);
      alert('Failed to open print dialog. Please check your browser settings.');
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