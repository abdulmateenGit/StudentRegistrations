//MultiCopyInvoice.jsx
"use client";

import React from "react";
import PropTypes from "prop-types";

const MultiCopyInvoice = ({ student, receiptNumber }) => {
  const feeInWords = (amount) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const convertToWords = (num) => {
      if (num === 0) return "Zero";
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] +
          (num % 10 !== 0 ? " " + ones[num % 10] : "")
        );
      if (num < 1000)
        return (
          ones[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 !== 0 ? " " + convertToWords(num % 100) : "")
        );
      if (num < 100000)
        return (
          convertToWords(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 !== 0 ? " " + convertToWords(num % 1000) : "")
        );
      return (
        convertToWords(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 !== 0 ? " " + convertToWords(num % 100000) : "")
      );
    };

    return convertToWords(amount) + " Only";
  };

  const formatReceiptNumber = (num) => {
    return num?.toString() || "557";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "20-Jun-2026";
    return dateStr;
  };

  const renderSingleReceipt = (copyType) => {
    return (
      <div style={styles.receiptCard}>
        {/* Header Section */}
        <div style={styles.receiptHeader}>
          <div style={styles.headerLeft}></div>
          <div style={styles.headerCenter}>
            <div style={styles.schoolTitle}>The Trinity School</div>
            <div style={styles.schoolLocation}>Lahore</div>
            <div style={styles.receiptBadge}>CASH RECEIPT</div>
          </div>
          <div style={styles.copyTag}>{copyType}</div>
        </div>

        {/* Meta Row */}
        <div style={styles.metaRow}>
          <div style={styles.datedField}>
            Dated:{" "}
            <span style={styles.metaSpan}>
              {formatDate(student.registrationDate)}
            </span>
          </div>
          <div style={styles.receiptNoField}>
            Receipt No:{" "}
            <span style={styles.metaSpan}>
              {formatReceiptNumber(receiptNumber)}
            </span>
          </div>
        </div>

        {/* Receipt Body */}
        <div style={styles.receiptBody}>
          <div style={styles.formLine}>
            <span style={styles.label}>
              Received with thanks from Mr./Ms./Mrs.
            </span>
            <span style={styles.fillBlank}>{student.parentName}</span>
          </div>

          <div style={styles.formLine}>
            <span style={styles.label}>Student's Name:</span>
            <span style={styles.fillBlank}>{student.studentName}</span>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formLineInline}>
              <span style={styles.labelInline}>Class:</span>
              <span style={styles.fillBlankInline}>{student.class?.toUpperCase() || "N/A"}</span>
            </div>
            <div style={styles.formLineInline}>
              <span style={styles.labelInline}>Roll #:</span>
              <span style={styles.fillBlankInline}>&nbsp;</span>
            </div>
          </div>

          <div style={styles.formLine}>
            <span style={styles.label}>Rupees in Words:</span>
            <span style={styles.fillBlank}>
              {feeInWords(student.registrationFee)}
            </span>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formLineInline}>
              <span style={styles.labelInline}>a sum of Rs.:</span>
              <span style={styles.fillBlankInline}>
                {(student.registrationFee).toLocaleString()}/-
              </span>
            </div>
            <div style={styles.formLineInline}>
              <span style={styles.labelInline}>in cash on account of:</span>
              <span style={styles.fillBlankInline}>Registration Fee</span>
            </div>
          </div>
        </div>

        {/* Footer Signatures */}
        <div style={styles.receiptFooter}>
          <div style={styles.signatureBlock}>
            <div style={styles.signatureLine}>Admission Manager</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.receiptsContainer}>
      {renderSingleReceipt("School Copy")}
      {renderSingleReceipt("Personal File Copy")}
      {renderSingleReceipt("Parent Copy")}
    </div>
  );
};

MultiCopyInvoice.propTypes = {
  student: PropTypes.shape({
    studentName: PropTypes.string,
    parentName: PropTypes.string,
    registrationFee: PropTypes.number,
    class: PropTypes.string,
    rollNo: PropTypes.string,
    registrationDate: PropTypes.string,
  }).isRequired,
  receiptNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

const styles = {
  receiptsContainer: {
    width: "210mm",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "6px", // Reduced from 12px to 6px
    padding: "6mm 8mm", // Reduced from 12mm 10mm to 6mm 8mm
    backgroundColor: "#fff",
    boxSizing: "border-box",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  receiptCard: {
    background: "#fff",
    padding: "10px 15px", // Reduced from 15px 20px to 10px 15px
    border: "1px dashed #555",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    pageBreakInside: "avoid",
    breakInside: "avoid",
  },
  receiptHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "3px", // Reduced from 6px to 3px
    marginBottom: "4px", // Reduced from 8px to 4px
  },
  headerLeft: { width: "120px" },
  headerCenter: { textAlign: "center", flex: 1 },
  schoolTitle: {
    fontSize: "20px", // Reduced from 22px to 20px
    fontWeight: "bold",
    color: "#000",
    letterSpacing: "0.5px",
  },
  schoolLocation: { 
    fontSize: "12px", // Reduced from 14px to 12px
    color: "#000", 
    marginTop: "0px" // Reduced from 1px to 0px
  },
  receiptBadge: {
    display: "inline-block",
    fontWeight: "bold",
    fontSize: "12px", // Reduced from 13px to 12px
    padding: "2px 15px", // Reduced from 3px 20px to 2px 15px
    marginTop: "3px", // Reduced from 6px to 3px
    color: "#000",
    letterSpacing: "0.5px",
  },
  copyTag: {
    width: "150px",
    textAlign: "right",
    fontSize: "12px", // Reduced from 13px to 12px
    fontWeight: "bold",
    color: "#333",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px", // Reduced from 10px to 6px
  },
  datedField: { 
    fontSize: "12px", // Reduced from 14px to 12px
    color: "#000" 
  },
  receiptNoField: { 
    fontSize: "12px", // Reduced from 14px to 12px
    color: "#000" 
  },
  metaSpan: {
    fontWeight: "bold",
    borderBottom: "1px solid #000",
    paddingLeft: "4px", // Reduced from 6px to 4px
    paddingBottom: "1px", // Reduced from 2px to 1px
    marginBottom: "0px",
    display: "inline-block",
    minWidth: "100px", // Reduced from 120px to 100px
    color: "#000",
    lineHeight: "1.2", // Reduced from 1.3 to 1.2
  },
  receiptBody: {
    display: "flex",
    flexDirection: "column",
    gap: "6px", // Reduced from 10px to 6px
    flex: 1,
    justifyContent: "center",
  },
  formLine: { 
    display: "flex", 
    alignItems: "baseline", 
    fontSize: "13px" // Reduced from 14px to 13px
  },
  formRow: { 
    display: "flex", 
    gap: "30px", // Reduced from 40px to 30px
    alignItems: "baseline" 
  },
  formLineInline: {
    display: "flex",
    alignItems: "baseline",
    fontSize: "13px", // Reduced from 14px to 13px
    flex: 1,
  },
  label: {
    color: "#000",
    fontWeight: "normal",
    marginRight: "6px", // Reduced from 8px to 6px
    whiteSpace: "nowrap",
  },
  labelInline: {
    color: "#000",
    fontWeight: "normal",
    marginRight: "6px", // Reduced from 8px to 6px
    whiteSpace: "nowrap",
  },
  fillBlank: {
    flex: 1,
    borderBottom: "1px dotted #333",
    fontWeight: "bold",
    paddingLeft: "6px", // Reduced from 8px to 6px
    paddingBottom: "1px", // Reduced from 2px to 1px
    marginBottom: "0px",
    color: "#000",
    lineHeight: "1.2", // Reduced from 1.3 to 1.2
  },
  fillBlankInline: {
    flex: 1,
    borderBottom: "1px dotted #333",
    fontWeight: "bold",
    paddingLeft: "6px", // Reduced from 8px to 6px
    paddingBottom: "1px", // Reduced from 2px to 1px
    marginBottom: "0px",
    color: "#000",
    lineHeight: "1.2", // Reduced from 1.3 to 1.2
  },
  receiptFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "10px", // Reduced from 15px to 10px
    gap: "30px",
  },
  signatureBlock: { 
    textAlign: "center", 
    width: "200px", // Reduced from 220px to 200px
    marginTop: "25px", // Reduced from 35px to 25px
  },
  signatureLine: {
    borderTop: "1.5px solid #000",
    paddingTop: "4px", // Kept at 4px
    fontSize: "10px", // Reduced from 11px to 10px
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#000",
    letterSpacing: "0.3px",
  },
};

export default MultiCopyInvoice;