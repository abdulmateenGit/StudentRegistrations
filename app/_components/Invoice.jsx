// Invoice.jsx
"use client";

import Image from "next/image";
import React from "react";

const Invoice = ({ student, receiptNumber }) => {
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
    if (!dateStr) return "05-May-26";
    return dateStr;
  };

  return (
    <div className="invoice" style={styles.invoice}>
      {/* Header */}
      <div style={styles.header}>
        {/* <div style={styles.headerLeft}>
          <Image
            src="/Trinity.png"
            alt="Trinity School Lahore"
            width={80}
            height={100}
            priority
          />
        </div> */}
        <div style={styles.headerCenter}>
          <h2 style={styles.schoolName}>Trinity School</h2>
          <p style={styles.schoolAddress}>Lahore</p>
          <h3 style={styles.receiptTitle}>CASH RECEIPT</h3>
          <p style={styles.receiptSubTitle}>Personal File Copy</p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.receiptNumberBox}>
            <span style={styles.receiptNumberLabel}>Receipt #:</span>
            <span style={styles.receiptNumber}>
              {formatReceiptNumber(receiptNumber)}
            </span>
          </div>
        </div>
      </div>

      {/* Date and Receipt Info */}
      <div style={styles.metaRow}>
        <span style={styles.datedText}>
          Dated:{" "}
          <span style={styles.datedValue}>
            {formatDate(student.registrationDate)}
          </span>
        </span>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <p style={styles.receivedLine}>
          <span style={styles.receivedPrefix}>
            Received with thanks from Mr./Ms./Mrs.
          </span>
          <span style={styles.parentName}>{student.parentName}</span>
        </p>

        <p style={styles.studentLine}>
          Student's Name:{" "}
          <span style={styles.studentName}>{student.studentName}</span>
        </p>

        <div style={styles.amountRow}>
          <span style={styles.amountLabel}>a sum of Rs.:</span>
          <span style={styles.amountValue}>
            {student.registrationFee.toLocaleString()}
          </span>
        </div>

        <p style={styles.classLine}>
          Class:{" "}
          <span style={styles.className}>
            {student.class?.toUpperCase() || "N/A"}
          </span>
        </p>

        <p style={styles.wordsLine}>
          Rupees in Words:{" "}
          <span style={styles.wordsAmount}>
            {feeInWords(student.registrationFee)}
          </span>
        </p>

        <p style={styles.accountLine}>
          in cash on account of:
          <span style={styles.accountType}> Registration Fee</span>
        </p>
      </div>

      {/* Signature */}
      <div style={styles.signatureSection}>
        <div style={styles.signatureBox}>
          <p style={styles.signatureLine}>___________________</p>
          <p style={styles.signatureTitle}>ACCOUNT OFFICER</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  invoice: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px 40px",
    backgroundColor: "white",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #ccc",
    paddingBottom: "15px",
    marginBottom: "15px",
  },
  headerLeft: {
    flex: "0 0 auto",
  },
  headerCenter: {
    flex: "1",
    textAlign: "center",
  },
  headerRight: {
    flex: "0 0 auto",
    alignSelf: "flex-start",
    marginTop: "5px",
  },
  schoolName: {
    margin: "0",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#000",
    letterSpacing: "0.5px",
  },
  schoolAddress: {
    margin: "2px 0",
    fontSize: "14px",
    color: "#000",
  },
  receiptTitle: {
    margin: "8px 0 0",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  receiptSubTitle: {
    margin: "2px 0 0",
    fontSize: "12px",
    color: "#666",
    fontWeight: "bold",
  },
  receiptNumberBox: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13px",
    fontWeight: "bold",
  },
  receiptNumberLabel: {
    fontWeight: "bold",
  },
  receiptNumber: {
    fontWeight: "bold",
  },
  metaRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "15px",
    fontSize: "13px",
  },
  datedText: {
    fontWeight: "normal",
  },
  datedValue: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  content: {
    marginBottom: "30px",
  },
  receivedLine: {
    margin: "8px 0",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  receivedPrefix: {
    marginRight: "5px",
  },
  parentName: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  studentLine: {
    margin: "8px 0",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  studentName: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  amountRow: {
    margin: "8px 0",
    fontSize: "14px",
    lineHeight: "1.6",
    display: "flex",
    alignItems: "baseline",
  },
  amountLabel: {
    marginRight: "5px",
  },
  amountValue: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  classLine: {
    margin: "8px 0",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  className: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  wordsLine: {
    margin: "8px 0",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  wordsAmount: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  accountLine: {
    margin: "8px 0",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  accountType: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  signatureSection: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #ccc",
  },
  signatureBox: {
    textAlign: "center",
    width: "200px",
  },
  signatureName: {
    fontSize: "13px",
    fontWeight: "bold",
    margin: "0 0 5px",
    color: "#000",
  },
  signatureLine: {
    margin: "5px 0",
    fontSize: "14px",
    color: "#000",
  },
  signatureTitle: {
    fontSize: "11px",
    fontWeight: "bold",
    margin: "5px 0 0",
    letterSpacing: "0.5px",
  },
};

export default Invoice;
