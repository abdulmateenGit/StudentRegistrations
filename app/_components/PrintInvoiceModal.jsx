"use client";

import React, { useRef, useState } from 'react';
import { X, Printer, Download } from './Icons';
import MultiCopyInvoice from './MultiCopyInvoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PrintInvoiceModal = ({ student, onClose }) => {
  const printRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!student) return null;

  // Function to download PDF
  const downloadPDF = async () => {
    try {
      setIsPrinting(true);
      
      const element = printRef.current;
      if (!element) {
        console.error('Print element not found');
        return;
      }

      // Show loading toast or indicator
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width * 0.75, canvas.height * 0.75],
        hotfixes: ['px_scaling'],
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${student.studentName}_${Date.now()}.pdf`);

      setIsPrinting(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsPrinting(false);
      // Fallback to print
      handlePrint();
    }
  };

  // Function to show print dialog
  const handlePrint = () => {
    try {
      const printContent = document.getElementById('invoice-print-area');
      if (!printContent) {
        console.error('Print area not found');
        return;
      }

      const printWindow = window.open('', '_blank', 'width=900,height=1200');
      
      if (!printWindow) {
        // Fallback: use current window
        window.print();
        return;
      }

      const styles = getPrintStyles();
      const contentHTML = printContent.innerHTML;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - ${student.studentName}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>${styles}</style>
          </head>
          <body>
            <div class="print-controls">
              <button onclick="window.print();" class="print-btn">🖨️ Print All Copies</button>
              <button onclick="window.close();" class="close-btn">✖️ Close</button>
            </div>
            <div class="receipts-container">
              ${contentHTML}
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
    } catch (error) {
      console.error('Error printing:', error);
      // Ultimate fallback
      window.print();
    }
  };

  // Combined function: Print + Download PDF
  const handlePrintAndDownload = async () => {
    try {
      // First download PDF
      await downloadPDF();
      
      // Then show print dialog after a short delay
      setTimeout(() => {
        handlePrint();
      }, 500);
    } catch (error) {
      console.error('Error in print and download:', error);
      // If PDF fails, at least try to print
      handlePrint();
    }
  };

  const getPrintStyles = () => {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: Arial, Helvetica, sans-serif;
        background-color: #fff;
        padding: 20px;
        color: #111;
      }
      
      .print-controls {
        text-align: center;
        margin-bottom: 20px;
        position: sticky;
        top: 0;
        z-index: 1000;
        background: white;
        padding: 15px;
        border-bottom: 2px solid #e5e7eb;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      .print-btn, .close-btn {
        padding: 8px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        margin: 0 8px;
      }
      
      .print-btn {
        background: #4f46e5;
        color: white;
      }
      
      .print-btn:hover {
        background: #4338ca;
      }
      
      .close-btn {
        background: #6b7280;
        color: white;
      }
      
      .close-btn:hover {
        background: #4b5563;
      }
      
      .receipts-container {
        max-width: 1000px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      
      .receipt-card {
        background: #fff;
        padding: 4px 12px;
        border: 1px dashed #777;
        position: relative;
        page-break-inside: avoid;
      }
      
      .receipt-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 2px;
        margin-bottom: 2px;
      }
      
      .header-left-spacer {
        width: 100px;
      }
      
      .header-center {
        text-align: center;
        flex-grow: 1;
      }
      
      .school-title {
        font-size: 24px;
        font-weight: normal;
        margin: 0;
        letter-spacing: 0.5px;
      }
      
      .school-location {
        font-size: 14px;
        margin: 2px 0 5px 0;
      }
      
      .receipt-badge {
        display: inline-block;
        border: 2px solid #000;
        font-weight: bold;
        font-size: 14px;
        padding: 3px 12px;
        letter-spacing: 1px;
      }
      
      .copy-tag {
        width: 150px;
        text-align: right;
        font-size: 13px;
        font-weight: 500;
        margin-top: 5px;
      }
      
      .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        width: 100%;
      }
      
      .receipt-no-field {
        font-size: 13px;
        text-align: left;
      }
      
      .dated-field {
        font-size: 13px;
        text-align: right;
      }
      
      .meta-span {
        font-weight: bold;
        border-bottom: 1px solid #111;
        padding-bottom: 1px;
        display: inline-block;
        min-width: 70px;
      }
      
      .receipt-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        font-size: 14px;
        margin-bottom: 15px;
      }
      
      .form-line {
        display: flex;
        align-items: baseline;
      }
      
      .label {
        white-space: nowrap;
        padding-right: 10px;
        color: #444;
        min-width: 180px;
        font-size: 13px;
      }
      
      .label-small {
        white-space: nowrap;
        padding-right: 10px;
        color: #444;
        min-width: 110px;
        font-size: 13px;
      }
      
      .label-tiny {
        white-space: nowrap;
        padding-right: 8px;
        color: #444;
        min-width: 55px;
        font-size: 13px;
      }
      
      .fill-blank {
        flex-grow: 1;
        border-bottom: 1px dotted #444;
        font-weight: bold;
        padding-left: 5px;
        color: #000;
      }
      
      .fill-blank-small {
        flex-grow: 1;
        border-bottom: 1px dotted #444;
        font-weight: bold;
        padding-left: 5px;
        color: #000;
        min-width: 180px;
      }
      
      .fill-blank-tiny {
        flex-grow: 1;
        border-bottom: 1px dotted #444;
        font-weight: bold;
        padding-left: 5px;
        color: #000;
        min-width: 80px;
      }
      
      .two-column-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        align-items: center;
      }
      
      .three-column-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 10px;
      }
      
      .form-line-compact {
        display: flex;
        align-items: baseline;
        white-space: nowrap;
      }
      
      .receipt-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 35px;
        padding-top: 20px;
      }
      
      .signature-block {
        text-align: center;
        width: 200px;
      }
      
      .signature-line {
        border-top: 1px solid #000;
        margin-top: 20px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #333;
        padding-top: 15px;
      }
      
      @media print {
        .print-controls {
          display: none !important;
        }
        
        body {
          padding: 0 !important;
          background: white !important;
        }
        
        .receipt-card {
          box-shadow: none !important;
          page-break-inside: avoid !important;
          margin-bottom: 10px !important;
        }
      }
    `;
  };

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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl font-bold">Registration Invoice</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors"
                disabled={isPrinting}
              >
                <Printer size={18} />
                Print Only
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
                disabled={isPrinting}
              >
                <Download size={18} />
                {isPrinting ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={handlePrintAndDownload}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors"
                disabled={isPrinting}
              >
                <Printer size={18} />
                <Download size={18} />
                Print & Download
              </button>
            </div>
          </div>

          <div id="invoice-print-area" ref={printRef}>
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