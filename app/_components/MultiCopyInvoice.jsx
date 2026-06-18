"use client";

import React from "react";

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
    return num.toString().padStart(3, "0");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "________";
    // Convert from dd-mmm-yyyy to dd-mmm-yy
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1]}-${parts[2].slice(-2)}`;
    }
    return dateStr;
  };

  const getClassName = (className) => {
    if (!className) return "_____";
    return className.toUpperCase();
  };

  const renderSingleReceipt = (copyType, receiptNum) => {
    return (
      <div style={styles.receiptCard}>
        {/* Header Section */}
        <div style={styles.receiptHeader}>
          <div style={styles.headerLeftSpacer}></div>
          <div style={styles.headerCenter}>
            <h1 style={styles.schoolTitle}>The Trinity School</h1>
            <p style={styles.schoolLocation}>Lahore</p>
            <div style={styles.receiptBadge}>CASH RECEIPT</div>
          </div>
          <div style={styles.copyTag}>{copyType}</div>
        </div>

        {/* Meta Row - Receipt No on left, Dated on right */}
        <div style={styles.metaRow}>
          <div style={styles.receiptNoField}>
            Receipt No:{" "}
            <span style={styles.metaSpan}>
              {formatReceiptNumber(receiptNum)}
            </span>
          </div>
          <div style={styles.datedField}>
            Dated:{" "}
            <span style={styles.metaSpan}>
              {formatDate(student.registrationDate)}
            </span>
          </div>
        </div>

        {/* Receipt Body */}
        <div style={styles.receiptBody}>
          <div style={styles.formLine}>
            <span style={styles.label}>
              Received with thanks from Mr./Ms./Mrs.
            </span>
            <div style={styles.fillBlank}>{student.parentName}</div>
          </div>

          {/* Student Name, Class, Roll No in one row */}
          <div style={styles.threeColumnRow}>
            <div style={styles.formLine}>
              <span style={styles.labelSmall}>Student Name:</span>
              <div style={styles.fillBlankSmall}>{student.studentName}</div>
            </div>
            <div style={styles.formLineCompact}>
              <span style={styles.labelTiny}>Class:</span>
              <div style={styles.fillBlankTiny}>{getClassName(student.class)}</div>
            </div>
            <div style={styles.formLineCompact}>
              <span style={styles.labelTiny}>Roll No:</span>
              <div style={styles.fillBlankTiny}></div>
            </div>
          </div>

          {/* Rupees in Words and a sum of Rs. in one row - reduced gap */}
          <div style={styles.twoColumnRow}>
            <div style={styles.formLineNoGap}>
              <span style={styles.label}>Rupees in Words:</span>
              <div style={styles.fillBlankNoGap}>
                {feeInWords(student.registrationFee)}
              </div>
            </div>
            <div style={styles.formLineNoGap}>
              <span style={styles.label}>a sum of Rs.:</span>
              <div style={styles.fillBlankNoGap}>
                {student.registrationFee.toLocaleString()}/-
              </div>
            </div>
          </div>

          <div style={styles.formLine}>
            <span style={styles.label}>in cash on account of:</span>
            <div style={styles.fillBlank}>Registration Fee</div>
          </div>
        </div>

        {/* Footer Signatures */}
        <div style={styles.receiptFooter}>
          <div style={styles.signatureBlock}>
            <div style={styles.signatureLine}>Account Officer</div>
          </div>
          <div style={styles.signatureBlock}>
            <div style={styles.signatureLine}>Assistant Manager Accounts</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.receiptsContainer}>
      {/* School Copy */}
      {renderSingleReceipt("School Copy", receiptNumber)}

      {/* Personal File Copy */}
      {renderSingleReceipt("Personal File Copy", receiptNumber + 1)}

      {/* Parent Copy */}
      {renderSingleReceipt("Parent Copy", receiptNumber + 2)}
    </div>
  );
};

const styles = {
  receiptsContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "2px", // Minimal gap between receipts
  },
  receiptCard: {
    background: "#fff",
    padding: "4px 12px", // Reduced padding for A4 fit
    border: "1px dashed #777",
    position: "relative",
    boxShadow: "none", // Removed shadow for print
  },
  receiptHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: "2px",
    marginBottom: "2px",
  },
  headerLeftSpacer: {
    width: "100px",
  },
  headerCenter: {
    textAlign: "center",
    flexGrow: 1,
  },
  schoolTitle: {
    fontSize: "24px",
    fontWeight: "normal",
    margin: "0",
    letterSpacing: "0.5px",
  },
  schoolLocation: {
    fontSize: "14px",
    margin: "2px 0 5px 0",
  },
  receiptBadge: {
    display: "inline-block",
    border: "2px solid #000",
    fontWeight: "bold",
    fontSize: "14px",
    padding: "3px 12px",
    letterSpacing: "1px",
  },
  copyTag: {
    width: "150px",
    textAlign: "right",
    fontSize: "13px",
    fontWeight: "500",
    marginTop: "5px",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    width: "100%",
  },
  receiptNoField: {
    fontSize: "13px",
    textAlign: "left",
  },
  datedField: {
    fontSize: "13px",
    textAlign: "right",
  },
  metaSpan: {
    fontWeight: "bold",
    borderBottom: "1px solid #111",
    paddingBottom: "1px",
    display: "inline-block",
    minWidth: "70px",
  },
  receiptBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px", // Reduced gap between form lines
    fontSize: "14px",
    marginBottom: "15px",
  },
  formLine: {
    display: "flex",
    alignItems: "baseline",
  },
  formLineNoGap: {
    display: "flex",
    alignItems: "baseline",
    marginBottom: "0", // No extra margin
  },
  label: {
    whiteSpace: "nowrap",
    paddingRight: "10px",
    color: "#444",
    minWidth: "180px",
    fontSize: "13px",
  },
  labelSmall: {
    whiteSpace: "nowrap",
    paddingRight: "10px",
    color: "#444",
    minWidth: "110px",
    fontSize: "13px",
  },
  labelTiny: {
    whiteSpace: "nowrap",
    paddingRight: "8px",
    color: "#444",
    minWidth: "55px",
    fontSize: "13px",
  },
  fillBlank: {
    flexGrow: 1,
    borderBottom: "1px dotted #444",
    fontWeight: "bold",
    paddingLeft: "5px",
    color: "#000",
  },
  fillBlankNoGap: {
    flexGrow: 1,
    borderBottom: "1px dotted #444",
    fontWeight: "bold",
    paddingLeft: "5px",
    color: "#000",
    paddingBottom: "0", // Reduced padding
  },
  fillBlankSmall: {
    flexGrow: 1,
    borderBottom: "1px dotted #444",
    fontWeight: "bold",
    paddingLeft: "5px",
    color: "#000",
    minWidth: "180px",
  },
  fillBlankTiny: {
    flexGrow: 1,
    borderBottom: "1px dotted #444",
    fontWeight: "bold",
    paddingLeft: "5px",
    color: "#000",
    minWidth: "80px",
  },
  twoColumnRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px", // Reduced gap between the two columns
    alignItems: "center",
  },
  threeColumnRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "10px",
  },
  formLineCompact: {
    display: "flex",
    alignItems: "baseline",
    whiteSpace: "nowrap",
  },
  receiptFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "35px",
    paddingTop: "20px",
  },
  signatureBlock: {
    textAlign: "center",
    width: "200px",
  },
  signatureLine: {
    borderTop: "1px solid #000",
    marginTop: "20px",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#333",
    paddingTop: "15px",
  },
};

export default MultiCopyInvoice;