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
    // Gracefully handles UUIDs or raw fallback digits matching original styles
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

        {/* Receipt Body with cleaner spacing and explicitly forced dot-gaps */}
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
              {/* Force blank content as requested */}
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
    gap: "12px",
    padding: "12mm 10mm",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  receiptCard: {
    background: "#fff",
    padding: "15px 20px",
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
    // borderBottom: "2px solid #000",
    paddingBottom: "6px",
    marginBottom: "8px",
  },
  headerLeft: { width: "120px" },
  headerCenter: { textAlign: "center", flex: 1 },
  schoolTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#000",
    letterSpacing: "0.5px",
  },
  schoolLocation: { fontSize: "14px", color: "#000", marginTop: "1px" },
  receiptBadge: {
    display: "inline-block",
    // border: "1.5px solid #000",
    borderBottom: "none",
    fontWeight: "bold",
    fontSize: "13px",
    padding: "3px 20px",
    marginTop: "6px",
    color: "#000",
    letterSpacing: "0.5px",
  },
  copyTag: {
    width: "150px",
    textAlign: "right",
    fontSize: "13px",
    fontWeight: "bold",
    color: "#333",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  datedField: { fontSize: "14px", color: "#000" },
  receiptNoField: { fontSize: "14px", color: "#000" },
  metaSpan: {
    fontWeight: "bold",
    borderBottom: "1px solid #000",
    paddingLeft: "6px",
    paddingBottom: "4px", 
    marginBottom: "2px",
    display: "inline-block",
    minWidth: "120px",
    color: "#000",
  },
  receiptBody: {
    display: "flex",
    flexDirection: "column",
    gap: "14px", // Fixed space step between data fields
    flex: 1,
    justifyContent: "center",
  },
  formLine: { display: "flex", alignItems: "baseline", fontSize: "14px" },
  formRow: { display: "flex", gap: "40px", alignItems: "baseline" },
  formLineInline: {
    display: "flex",
    alignItems: "baseline",
    fontSize: "14px",
    flex: 1,
  },
  label: {
    color: "#000",
    fontWeight: "normal",
    marginRight: "8px",
    whiteSpace: "nowrap",
  },
  labelInline: {
    color: "#000",
    fontWeight: "normal",
    marginRight: "8px",
    whiteSpace: "nowrap",
  },
  fillBlank: {
    flex: 1,
    borderBottom: "1px dotted #333",
    fontWeight: "bold",
    paddingLeft: "8px",
    paddingBottom: "4px", 
    marginBottom: "2px",
    color: "#000",
    lineHeight: "1.2",
  },
  fillBlankInline: {
    flex: 1,
    borderBottom: "1px dotted #333",
    fontWeight: "bold",
    paddingLeft: "8px",
    paddingBottom: "4px",
    marginBottom: "2px",
    color: "#000",
    lineHeight: "1.2",
  },
  receiptFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "100px",
  },
  signatureBlock: { textAlign: "center", width: "220px" },
  signatureLine: {
    borderTop: "1.5px solid #000",
    paddingTop: "6px",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#000",
    letterSpacing: "0.3px",
  },
};

export default MultiCopyInvoice;
