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
    return num.toString().padStart(6, "0");
  };

  return (
    <div className="invoice" style={styles.invoice}>
      {/* Header */}
      <div style={styles.header} className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <Image
            src="/Trinity.png"
            alt="Trinity School Lahore logo"
            width={140}
            height={175}
            className="h-32 w-auto object-contain sm:h-36"
            priority
          />
        </div>
        <div className="items-center">
          <h2 style={styles.schoolName}>The Trinity School</h2>
          <p style={styles.schoolAddress}>Lahore</p>
          <h3 style={styles.receiptTitle}>CASH RECEIPT</h3>
        </div>
      </div>

      {/* Receipt Number */}
      <div style={styles.receiptNumberContainer}>
        <span style={styles.receiptNumberLabel}>Receipt #:</span>
        <span style={styles.receiptNumber}>
          {formatReceiptNumber(receiptNumber)}
        </span>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <p style={styles.receivedLine}>
          Received with thanks from Mr./Ms./Mrs.
          <span style={styles.parentName}> {student.parentName}</span>
        </p>

        <p style={styles.studentLine}>
          Student&apos;s Name:{" "}
          <span style={styles.studentName}>{student.studentName}</span>
        </p>

        <div style={styles.amountRow}>
          <span style={styles.amountLabel}>a sum of Rs.:</span>
          <span style={styles.amount}>
            {student.registrationFee.toLocaleString()}
          </span>
        </div>

        <p style={styles.classLine}>
          Class: <span style={styles.className}>{student.class || "N/A"}</span>
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

      {/* Signatures */}
      <div style={styles.signatures}>
        <div style={styles.signatureLeft}>
          <p>___________________</p>
          <p style={styles.signatureTitle}>ACCOUNT OFFICER</p>
        </div>
        <div style={styles.signatureRight}>
          <p>___________________</p>
          <p style={styles.signatureTitle}>ASSISTANT MANAGER ACCOUNTS</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  invoice: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "white",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "4px",
    position: "relative",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
  },
  schoolName: {
    margin: "0",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
  },
  schoolAddress: {
    margin: "5px 0",
    fontSize: "14px",
    color: "#666",
  },
  receiptTitle: {
    margin: "10px 0 0",
    fontSize: "18px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  receiptNumberContainer: {
    textAlign: "right",
    marginBottom: "20px",
    fontSize: "12px",
  },
  receiptNumberLabel: {
    fontWeight: "bold",
  },
  receiptNumber: {
    marginLeft: "5px",
  },
  content: {
    marginBottom: "30px",
  },
  receivedLine: {
    margin: "10px 0",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  parentName: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  studentLine: {
    margin: "10px 0",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  studentName: {
    fontWeight: "bold",
  },
  amountRow: {
    margin: "10px 0",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  amountLabel: {
    fontWeight: "bold",
  },
  amount: {
    fontWeight: "bold",
    marginLeft: "5px",
  },
  classLine: {
    margin: "10px 0",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  className: {
    fontWeight: "bold",
  },
  wordsLine: {
    margin: "10px 0",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  wordsAmount: {
    fontWeight: "bold",
  },
  accountLine: {
    margin: "10px 0",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  accountType: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  signatures: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "1px solid #ddd",
  },
  signatureLeft: {
    textAlign: "center",
    flex: 1,
  },
  signatureRight: {
    textAlign: "center",
    flex: 1,
  },
  signatureTitle: {
    fontSize: "12px",
    fontWeight: "bold",
    marginTop: "5px",
  },
};

export default Invoice;
