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

  const downloadPDF = async () => {
    try {
      setIsPrinting(true);
      
      const element = printRef.current;
      if (!element) {
        console.error('Print element not found');
        setIsPrinting(false);
        return;
      }

      // Capture the entire content with proper scaling
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (document) => {
          // Ensure all content is visible
          const clonedElement = document.getElementById('invoice-print-area');
          if (clonedElement) {
            clonedElement.style.transform = 'none';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions to maintain aspect ratio and center content
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Center the image on the page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate margins to center content
      const marginX = (pageWidth - pdfWidth) / 2;
      const marginY = (pageHeight - pdfHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', marginX, marginY, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${student.studentName}_${Date.now()}.pdf`);

      setIsPrinting(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsPrinting(false);
      handlePrint();
    }
  };

  const handlePrint = () => {
    try {
      const printContent = document.getElementById('invoice-print-area');
      if (!printContent) {
        console.error('Print area not found');
        return;
      }

      const printWindow = window.open('', '_blank', 'width=900,height=1200');
      
      if (!printWindow) {
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
      window.print();
    }
  };

  const handlePrintAndDownload = async () => {
    try {
      await downloadPDF();
      setTimeout(() => {
        handlePrint();
      }, 500);
    } catch (error) {
      console.error('Error in print and download:', error);
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
        gap: 0px;
        padding: 10px;
      }
      
      .receipt-card {
        background: #fff;
        padding: 20px 25px;
        border: 1px dashed #777;
        position: relative;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        page-break-inside: avoid;
        break-inside: avoid;
        margin-bottom: 2px;
      }
      
      .receipt-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 2px solid #000;
      }
      
      .header-left-spacer {
        width: 120px;
      }
      
      .header-center {
        text-align: center;
        flex-grow: 1;
      }
      
      .school-title {
        font-size: 26px;
        font-weight: bold;
        margin: 0;
        letter-spacing: 0.5px;
        color: #000;
      }
      
      .school-location {
        font-size: 16px;
        margin: 2px 0 8px 0;
        color: #333;
      }
      
      .receipt-badge {
        display: inline-block;
        border: 2px solid #000;
        font-weight: bold;
        font-size: 16px;
        padding: 4px 20px;
        letter-spacing: 1px;
        color: #000;
      }
      
      .copy-tag {
        width: 150px;
        text-align: right;
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }
      
      .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        width: 100%;
        padding: 0 5px;
      }
      
      .receipt-no-field {
        font-size: 14px;
        text-align: right;
      }
      
      .dated-field {
        font-size: 14px;
        text-align: left;
      }
      
      .meta-span {
        font-weight: bold;
        border-bottom: 1px solid #111;
        padding-bottom: 2px;
        display: inline-block;
        min-width: 80px;
        color: #000;
      }
      
      .receipt-body {
        display: flex;
        flex-direction: column;
        gap: 14px;
        font-size: 14px;
        margin-bottom: 20px;
        padding: 0 5px;
      }
      
      .form-line {
        display: flex;
        align-items: baseline;
      }
      
      .label {
        white-space: nowrap;
        padding-right: 10px;
        color: #444;
        min-width: 200px;
        font-size: 14px;
      }
      
      .label-small {
        white-space: nowrap;
        padding-right: 10px;
        color: #444;
        min-width: 120px;
        font-size: 14px;
      }
      
      .label-tiny {
        white-space: nowrap;
        padding-right: 8px;
        color: #444;
        min-width: 55px;
        font-size: 14px;
      }
      
      .fill-blank {
        flex-grow: 1;
        border-bottom: 1px dotted #444;
        font-weight: bold;
        padding-left: 5px;
        padding-bottom: 2px;
        color: #000;
        min-height: 24px;
      }
      
      .fill-blank-small {
        flex-grow: 1;
        border-bottom: 1px dotted #444;
        font-weight: bold;
        padding-left: 5px;
        padding-bottom: 2px;
        color: #000;
        min-width: 180px;
        min-height: 24px;
      }
      
      .fill-blank-tiny {
        flex-grow: 1;
        border-bottom: 1px dotted #444;
        font-weight: bold;
        padding-left: 5px;
        padding-bottom: 2px;
        color: #000;
        min-width: 80px;
        min-height: 24px;
      }
      
      .two-column-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        align-items: center;
      }
      
      .three-column-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 15px;
        align-items: center;
      }
      
      .form-line-compact {
        display: flex;
        align-items: baseline;
        white-space: nowrap;
      }
      
      .receipt-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
      }
      
      .signature-block {
        text-align: center;
        width: 220px;
      }
      
      .signature-line {
        border-top: 1px solid #000;
        margin-top: 20px;
        padding-top: 12px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #333;
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
          break-inside: avoid !important;
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
                Both
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