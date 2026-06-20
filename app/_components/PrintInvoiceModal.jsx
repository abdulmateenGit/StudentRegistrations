"use client";

import React, { useRef, useState } from "react";
import { X, Printer, Download } from "./Icons";
import MultiCopyInvoice from "./MultiCopyInvoice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PrintInvoiceModal = ({ student, onClose }) => {
  const printRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!student) return null;

  // Function to download PDF
  const downloadPDF = async () => {
    try {
      setIsDownloading(true);

      const element = printRef.current;
      if (!element) {
        console.error("Print element not found");
        setIsDownloading(false);
        return;
      }

      // Wait for images to load
      const images = element.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }),
      );

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("invoice-print-area");
          if (clonedElement) {
            clonedElement.style.transform = "none";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width * 0.75, canvas.height * 0.75],
        hotfixes: ["px_scaling"],
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${student.studentName || "Student"}_${Date.now()}.pdf`);

      setIsDownloading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsDownloading(false);
      handlePrint();
    }
  };

  // Function to show print dialog
  const handlePrint = () => {
    const printContent = document.getElementById("invoice-print-area");

    if (!printContent) {
      console.error("Print area not found");
      return;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow popups for printing.");
      return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice</title>

        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html,
          body {
            width: 100%;
            background: white;
            font-family: Arial, sans-serif;
          }

          @page {
            size: A4;
            margin: 10mm;
          }

          .receipt-card {
            border: 1px dashed #555;
            padding: 10px;
            margin-bottom: 5px;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .receipts-container {
            width: 100%;
          }

          img {
            max-width: 100%;
          }

          @media print {
            body {
              margin: 0;
              padding: 0;
            }

            .receipt-card {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  // Combined function: Print + Download PDF
  const handlePrintAndDownload = async () => {
    try {
      setIsPrinting(true);
      await downloadPDF();
      setTimeout(() => {
        handlePrint();
        setIsPrinting(false);
      }, 500);
    } catch (error) {
      console.error("Error in print and download:", error);
      setIsPrinting(false);
      handlePrint();
    }
  };

  const getPrintStyles = () => {
    return `
      .receipts-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      
      .receipt-card {
        background: #fff;
        padding: 8px 12px;
        border: 1px dashed #777;
        border-radius: 2px;
        page-break-inside: avoid;
        break-inside: avoid;
        margin-bottom: 4px;
      }
      
      .receipt-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 2px;
        margin-bottom: 3px;
      }
      
      .header-left-spacer {
        width: 100px;
      }
      
      .header-center {
        text-align: center;
        flex-grow: 1;
      }
      
      .school-title {
        font-size: 20px;
        font-weight: bold;
        margin: 0;
        letter-spacing: 0.5px;
        color: #000;
      }
      
      .school-location {
        font-size: 13px;
        margin: 1px 0 3px 0;
        color: #000;
      }
      
      .receipt-badge {
        display: inline-block;
        border: none;
        font-weight: bold;
        font-size: 12px;
        padding: 2px 15px;
        margin-top: 3px;
        letter-spacing: 0.5px;
        color: #000;
      }
      
      .copy-tag {
        width: 150px;
        text-align: right;
        font-size: 12px;
        font-weight: 500;
        color: #333;
        margin-top: 3px;
      }
      
      .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        width: 100%;
      }
      
      .receipt-no-field {
        font-size: 13px;
        text-align: left;
        color: #000;
      }
      
      .dated-field {
        font-size: 13px;
        text-align: right;
        color: #000;
      }
      
      .meta-span {
        font-weight: bold;
        border-bottom: 1px solid #000;
        padding: 0 6px 2px 6px;
        display: inline-block;
        min-width: 100px;
        color: #000;
        line-height: 1.2;
      }
      
      .receipt-body {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        margin-bottom: 8px;
      }
      
      .form-line {
        display: flex;
        align-items: baseline;
      }
      
      .label {
        white-space: nowrap;
        padding-right: 8px;
        color: #000;
        font-weight: normal;
        min-width: 180px;
        font-size: 13px;
      }
      
      .label-small {
        white-space: nowrap;
        padding-right: 8px;
        color: #000;
        font-weight: normal;
        min-width: 110px;
        font-size: 13px;
      }
      
      .label-tiny {
        white-space: nowrap;
        padding-right: 6px;
        color: #000;
        font-weight: normal;
        min-width: 55px;
        font-size: 13px;
      }
      
      .fill-blank {
        flex-grow: 1;
        border-bottom: 1px dotted #333;
        font-weight: bold;
        padding: 0 5px 2px 5px;
        color: #000;
        line-height: 1.2;
        font-size: 13px;
      }
      
      .fill-blank-small {
        flex-grow: 1;
        border-bottom: 1px dotted #333;
        font-weight: bold;
        padding: 0 5px 2px 5px;
        color: #000;
        line-height: 1.2;
        min-width: 180px;
        font-size: 13px;
      }
      
      .fill-blank-tiny {
        flex-grow: 1;
        border-bottom: 1px dotted #333;
        font-weight: bold;
        padding: 0 5px 2px 5px;
        color: #000;
        line-height: 1.2;
        min-width: 80px;
        font-size: 13px;
      }
      
      .two-column-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        align-items: baseline;
      }
      
      .three-column-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 15px;
        align-items: baseline;
      }
      
      .form-line-compact {
        display: flex;
        align-items: baseline;
        white-space: nowrap;
      }
      
      .receipt-footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 8px;
        padding-top: 0;
        gap: 30px;
      }
      
      .signature-block {
        text-align: center;
        width: 220px;
        margin-top: 5px;
      }
      
      .signature-line {
        border-top: 1.5px solid #000;
        padding-top: 4px;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        color: #000;
        margin-top: 0;
      }
      
      /* A4 page settings */
      @page {
        size: A4 portrait;
        margin: 10mm 12mm 10mm 12mm;
      }
      
      @media print {
        .print-controls {
          display: none !important;
        }
        
        body {
          padding: 0 !important;
          margin: 0 !important;
          background: white !important;
          width: 100% !important;
        }
        
        .receipts-container {
          padding: 0 !important;
          margin: 0 auto !important;
          gap: 4px !important;
        }
        
        .receipt-card {
          box-shadow: none !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 4px !important;
          border: 1px dashed #555 !important;
          padding: 8px 12px !important;
        }
        
        .receipt-body {
          gap: 4px !important;
        }
      }
    `;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-zinc-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg p-1 no-print"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 no-print">
            <h2 className="text-2xl font-bold">Registration Invoice</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDownloading || isPrinting}
              >
                <Printer size={18} />
                Print Only
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDownloading || isPrinting}
              >
                <Download size={18} />
                {isDownloading ? "Generating..." : "Download PDF"}
              </button>
              <button
                onClick={handlePrintAndDownload}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDownloading || isPrinting}
              >
                <Printer size={18} />
                <Download size={18} />
                {isPrinting ? "Processing..." : "Print & Download"}
              </button>
            </div>
          </div>

          <div id="invoice-print-area" ref={printRef}>
            <MultiCopyInvoice
              student={student}
              receiptNumber={student.id || student.receiptNumber || 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoiceModal;
