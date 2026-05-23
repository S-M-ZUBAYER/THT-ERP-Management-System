// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export const generatePDF = (financeDetailsData) => {
//   if (!financeDetailsData) {
//     console.error("No finance data provided");
//     return;
//   }

//   const doc = new jsPDF();

//   // Add border to the entire page
//   doc.setDrawColor(0, 0, 0);
//   doc.setLineWidth(0.5);
//   doc.rect(
//     5,
//     5,
//     doc.internal.pageSize.width - 10,
//     doc.internal.pageSize.height - 10,
//     "S",
//   );

//   // Title Section
//   doc.setFontSize(20).setTextColor(0, 102, 204).setFont("helvetica", "bold");
//   doc.text("Shipment and Invoice Details", 15, 20);

//   // Main Information Section (as grid)
//   doc.setFontSize(10).setTextColor(0, 0, 0);
//   const mainInfo = [
//     {
//       label: "Country",
//       value: financeDetailsData.transportCountryName || "N/A",
//     },
//     { label: "Port", value: financeDetailsData.transportPort || "N/A" },
//     { label: "Transport Way", value: financeDetailsData.transportWay || "N/A" },
//     { label: "Invoice No", value: financeDetailsData.invoiceNo || "N/A" },
//     { label: "Invoice Value (USD)", value: financeDetailsData.total || "N/A" },
//     { label: "Invoice Date", value: financeDetailsData.invoiceDate || "N/A" },
//     { label: "EP No", value: financeDetailsData.epNo || "N/A" },
//     { label: "Truck No", value: financeDetailsData.truckNo || "N/A" },
//     { label: "Zone", value: financeDetailsData.zone || "N/A" },
//     { label: "Port Of Loading", value: financeDetailsData.loadFrom || "N/A" },
//     {
//       label: "Permit Till Date",
//       value: financeDetailsData.permitedDate || "N/A",
//     },
//     { label: "Export No", value: financeDetailsData.expNo || "N/A" },
//     { label: "Export Date", value: financeDetailsData.expDate || "N/A" },
//     { label: "CM Value", value: financeDetailsData.cmValue || "N/A" },
//     {
//       label: "Consignee Name",
//       value: financeDetailsData.consigneeName || "N/A",
//     },
//     {
//       label: "Consignee Address",
//       value: financeDetailsData.consigneeAddress || "N/A",
//     },
//     { label: "Bank Name", value: financeDetailsData.bankName || "N/A" },
//     { label: "LC/No./TT/P.S/SC/CMT", value: financeDetailsData.sccmt || "N/A" },
//     {
//       label: "Enterprise Employee",
//       value: financeDetailsData.enterpriseEmp || "N/A",
//     },
//     {
//       label: "Verifying Officer",
//       value: financeDetailsData.verifyingEmp || "N/A",
//     },
//     { label: "Permit Officer", value: financeDetailsData.permitEmp || "N/A" },
//     {
//       label: "Total Box Weight",
//       value: financeDetailsData.allTotalBoxWeight || "N/A",
//     },
//   ];

//   // Display the mainInfo in two columns, adjusted for proper alignment and spacing
//   mainInfo.forEach((item, idx) => {
//     const xPos = idx % 2 === 0 ? 15 : 110;
//     const yPos = 30 + Math.floor(idx / 2) * 8; // Increased space between rows
//     doc.text(`${item.label}: ${item.value}`, xPos, yPos);
//   });

//   // Particular Expenses Section
//   doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0, 102, 204);
//   doc.text(
//     `${financeDetailsData.traderServiceProvider} Particular Expenses`,
//     15,
//     130,
//   );

//   // Gross and Net Weight Section
//   doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(0, 0, 0);
//   doc.text(`Gross Weight: ${financeDetailsData.grossWeight || "N/A"}`, 15, 136);
//   doc.text(`Net Weight: ${financeDetailsData.netWeight || "N/A"}`, 15, 142);

//   // Trade Exchange Rate and Invoice Value
//   if (financeDetailsData.tradeExchangeRate > 0) {
//     doc.text(
//       `Trade Exchange Rate: ${financeDetailsData.tradeExchangeRate}`,
//       15,
//       148,
//     );
//     doc.text(
//       `Invoice Value: ${(financeDetailsData.total * financeDetailsData.tradeExchangeRate).toFixed(2)} TK`,
//       15,
//       154,
//     );
//   }

//   // Expense Table
//   // doc?.autoTable({
//   //   head: [["Date", "Expense Name", "Remark", "Cost"]],
//   //   body: financeDetailsData.financeParticularExpenseNames.map((expense) => [
//   //     expense.date || "N/A",
//   //     expense.particularExpenseName || "N/A",
//   //     expense.remark || "N/A",
//   //     expense.particularExpenseCost || "N/A",
//   //   ]),
//   //   startY: 160,
//   //   theme: "grid",
//   //   styles: { fontSize: 10, textColor: [0, 0, 0] },
//   //   headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
//   //   alternateRowStyles: { fillColor: [240, 240, 240] },
//   // });

//   autoTable(doc, {
//     head: [["Date", "Expense Name", "Remark", "Cost"]],
//     body: financeDetailsData.financeParticularExpenseNames.map((expense) => [
//       expense.date || "N/A",
//       expense.particularExpenseName || "N/A",
//       expense.remark || "N/A",
//       expense.particularExpenseCost || "N/A",
//     ]),
//     startY: 160,
//     theme: "grid",
//     styles: { fontSize: 10, textColor: [0, 0, 0] },
//     headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
//     alternateRowStyles: { fillColor: [240, 240, 240] },
//   });

//   const expenseEndY = doc.lastAutoTable.finalY;

//   // Total Individual Cost
//   doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(0, 0, 0);
//   doc.text(
//     `Total Individual Cost: ${financeDetailsData.totalCost || "N/A"}`,
//     15,
//     expenseEndY + 8,
//   );

//   // C&F Commission and Total Amount
//   if (financeDetailsData.tradeExchangeRate > 0) {
//     const candFValue = financeDetailsData.candF || "N/A";
//     const totalAmount =
//       parseFloat(financeDetailsData.totalCost || 0) +
//       parseFloat(candFValue || 0);
//     doc.text(`C&F Commission 0.20%: ${candFValue}`, 15, expenseEndY + 16);
//     doc.text(`Total Amount: ${totalAmount}`, 15, expenseEndY + 24);
//   }

//   // Trade Service Payment Date
//   if (financeDetailsData.tradeExpanseDate) {
//     doc.text(
//       `Trade Service Payment Date: ${financeDetailsData.tradeExpanseDate}`,
//       15,
//       expenseEndY + 32,
//     );
//   }

//   // Products in Boxes Section
//   doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0, 102, 204);
//   doc.text("Products In Boxes", 15, expenseEndY + 60);

//   autoTable(doc, {
//     head: [
//       [
//         "HS Code",
//         "Product Name",
//         "Model",
//         "Quantity",
//         "Truck No",
//         "Pallet No",
//         "Total Box",
//         "Box Weight",
//         "Total Weight",
//         "FOB/CIF/CFR/C&F (US$)",
//         "FOB/CIF/CFR/C&F (USD)",
//       ],
//     ],
//     body: financeDetailsData.financeProductInBoxes.map((product) => [
//       product.hscode || "N/A",
//       product.productName || "N/A",
//       product.productModel || "N/A",
//       product.quantity || "N/A",
//       product.truckNumber || "N/A",
//       product.totalPallet || "N/A",
//       product.totalBox || "N/A",
//       product.weightPerBox || "N/A",
//       product.individualTotalBoxWeight || "N/A",
//       product.c_FUS || "N/A",
//       product.c_FUSD || "N/A",
//     ]),
//     startY: expenseEndY + 70,
//     theme: "grid",
//     styles: { fontSize: 10, textColor: [0, 0, 0] },
//     headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
//     alternateRowStyles: { fillColor: [240, 240, 240] },
//   });

//   const productEndY = doc.lastAutoTable.finalY;

//   // Adding the total weight at the end
//   doc.text(
//     `All Total Weight: ${financeDetailsData.allTotalBoxWeight || "N/A"}`,
//     15,
//     productEndY + 7,
//   );

//   // Carrier Service Section
//   doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0, 102, 204);
//   doc.text(
//     `${financeDetailsData?.containerServiceProvider || "N/A"} CARRIER SERVICE`,
//     15,
//     productEndY + 30,
//   );

//   // Correctly capture the Y position after the first table

//   autoTable(doc, {
//     head: [
//       [
//         "S/L No",
//         "Date",
//         "Container No",
//         "Container T/S",
//         "Invoice No",
//         "EP NO",
//         "Fare Amount",
//         "Ait/Vat 5%",
//         "Total Amount/TK",
//       ],
//     ],
//     body: financeDetailsData.financeContainerExpenseNames.map((container) => [
//       container.slNo || "N/A",
//       container.date || "N/A",
//       container.containerNo || "N/A",
//       container.containerTypeSize || "N/A",
//       container.invoiceNo || "N/A",
//       container.epNumber || "N/A",
//       container.fareAmount || "N/A",
//       container.aitVat || "N/A",
//       container.individualTotalAmount || "N/A",
//     ]),
//     startY: productEndY + 40,
//     theme: "grid",
//     styles: { fontSize: 10, textColor: [0, 0, 0] },
//     headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
//     alternateRowStyles: { fillColor: [240, 240, 240] },
//   });
//   const expenseEnd2Y = doc.lastAutoTable.finalY;

//   // Add Gross Total Amount table footer directly below the first table

//   autoTable(doc, {
//     body: [
//       [
//         "Gross Total Amount",
//         "",
//         "",
//         "",
//         "",
//         "",
//         financeDetailsData.totalFareAmount || "N/A",
//         financeDetailsData.totalAitVat || "N/A",
//         financeDetailsData.totalCarrierAmount || "N/A",
//       ],
//     ],
//     startY: expenseEnd2Y + 1,
//     theme: "plain",
//     styles: { fontSize: 10, fontStyle: "bold" },
//   });

//   // Block 3 - Charges Table
//   autoTable(doc, {
//     head: [["ID", "Description", "Amount (USD)", "Amount (TK)"]],
//     body: financeDetailsData.financeCharges.map((charge) => [
//       charge.id || "N/A",
//       charge.description || "N/A",
//       charge.amountUSD || "N/A",
//       charge.amountBDT || "N/A",
//     ]),
//     startY: expenseEnd2Y + 70,
//     theme: "grid",
//     styles: { fontSize: 10, textColor: [0, 0, 0] },
//     headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
//     alternateRowStyles: { fillColor: [240, 240, 240] },
//   });

//   // Add FREIGHT SERVICE Section
//   doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0, 102, 204);
//   doc.text(
//     `${financeDetailsData.seaServiceProvider || "N/A"} FREIGHT SERVICE`,
//     15,
//     expenseEnd2Y + 30,
//   );

//   doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(0, 0, 0);
//   const freightInfo = [
//     { label: "Shipper", value: financeDetailsData.shipper || "N/A" },
//     { label: "B/L No", value: financeDetailsData.blNo || "N/A" },
//     { label: "Container No", value: financeDetailsData.containerNo || "N/A" },
//     { label: "Destination", value: financeDetailsData.destination || "N/A" },
//     { label: "VSL/VOY", value: financeDetailsData.vslVoy || "N/A" },
//     { label: "ETD CGP", value: financeDetailsData.etd || "N/A" },
//     {
//       label: "Sea Exchange Rate",
//       value: financeDetailsData.exchangeRate || "N/A",
//     },
//   ];

//   freightInfo.forEach((item, idx) => {
//     const xPos = idx % 2 === 0 ? 15 : 110;
//     const yPos = expenseEnd2Y + 38 + Math.floor(idx / 2) * 8;
//     doc.text(`${item.label}: ${item.value}`, xPos, yPos);
//   });

//   // Add Charges Table

//   autoTable(doc, {
//     head: [["ID", "Description", "Amount (USD)", "Amount (TK)"]],
//     body: financeDetailsData.financeCharges.map((charge) => [
//       charge.id || "N/A",
//       charge.description || "N/A",
//       charge.amountUSD || "N/A",
//       charge.amountBDT || "N/A",
//     ]),
//     startY: expenseEnd2Y + 70,
//     theme: "grid",
//     styles: { fontSize: 10, textColor: [0, 0, 0] },
//     headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
//     alternateRowStyles: { fillColor: [240, 240, 240] },
//   });

//   const chargesEndY = doc.lastAutoTable.finalY;

//   // Add Total for Charges Table

//   autoTable(doc, {
//     body: [
//       [
//         "Total",
//         "",
//         financeDetailsData.totalAmountUSD || "N/A USD",
//         financeDetailsData.totalAmountBDT || "N/A TK",
//       ],
//     ],
//     startY: chargesEndY + 1,
//     theme: "plain",
//     styles: { fontSize: 10, fontStyle: "bold" },
//   });

//   // Add Shipment Payment Date
//   doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(0, 0, 0);
//   if (financeDetailsData.seaExpanseDate) {
//     doc.text(
//       `Shipment Payment Data: ${financeDetailsData.seaExpanseDate}`,
//       15,
//       chargesEndY + 15,
//     );
//   }

//   // Save PDF
//   doc.save(`${financeDetailsData.invoiceNo || "invoice"}.pdf`);
// };

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLOR = {
  primary: [10, 45, 90], // deep navy
  accent: [0, 122, 204], // vivid blue
  accentLight: [220, 236, 255], // pale blue tint
  white: [255, 255, 255],
  black: [0, 0, 0],
  gray1: [245, 247, 250], // zebra row
  gray2: [180, 190, 205], // subtle border
  gray3: [100, 115, 135], // muted text
  gold: [195, 155, 60], // accent stripe
};

const FONT = {
  title: 24,
  section: 11,
  body: 9,
  small: 8,
};

const MARGIN = 14;
const PW = 210; // A4 width mm
const PH = 297; // A4 height mm
const CONTENT = PW - MARGIN * 2;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Draw the repeating page chrome (header band + footer + page border) */
function drawPageChrome(doc, invoiceNo, pageNum, totalPages) {
  const w = PW;
  const h = PH;

  // Outer border
  doc.setDrawColor(...COLOR.gray2);
  doc.setLineWidth(0.4);
  doc.rect(4, 4, w - 8, h - 8, "S");

  // Top header band
  doc.setFillColor(...COLOR.primary);
  doc.rect(4, 4, w - 8, 18, "F");

  // Gold accent stripe
  doc.setFillColor(...COLOR.gold);
  doc.rect(4, 22, w - 8, 1.5, "F");

  // Company / doc title in header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR.white);
  doc.text("SHIPMENT & INVOICE DETAILS", MARGIN, 14.5);

  // Invoice no right-aligned in header
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice: ${invoiceNo || "N/A"}`, w - MARGIN, 14.5, {
    align: "right",
  });

  // Footer band
  doc.setFillColor(...COLOR.primary);
  doc.rect(4, h - 12, w - 8, 8, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR.gray2);
  doc.text("Confidential — For authorised use only", MARGIN, h - 7);
  doc.text(`Page ${pageNum} of ${totalPages}`, w - MARGIN, h - 7, {
    align: "right",
  });
}

/** Bold label + normal value inline */
function labelValue(doc, label, value, x, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT.small);
  doc.setTextColor(...COLOR.gray3);
  doc.text(`${label}:`, x, y);

  const labelW = doc.getTextWidth(`${label}: `);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR.black);
  doc.text(String(value || "N/A"), x + labelW, y);
}

/** Section heading with colored left-bar */
function sectionHeading(doc, title, y) {
  doc.setFillColor(...COLOR.accent);
  doc.rect(MARGIN, y - 4, 2.5, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT.section);
  doc.setTextColor(...COLOR.primary);
  doc.text(title, MARGIN + 5, y);

  // thin rule under heading
  doc.setDrawColor(...COLOR.accentLight);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y + 1.5, MARGIN + CONTENT, y + 1.5);

  return y + 6;
}

/** Shared autoTable styles */
function tableStyle() {
  return {
    theme: "grid",
    styles: {
      fontSize: FONT.body,
      textColor: COLOR.black,
      cellPadding: 2.2,
      lineColor: COLOR.gray2,
      lineWidth: 0.25,
    },
    headStyles: {
      fillColor: COLOR.primary,
      textColor: COLOR.white,
      fontStyle: "bold",
      fontSize: FONT.body,
    },
    alternateRowStyles: { fillColor: COLOR.gray1 },
    margin: { left: MARGIN, right: MARGIN, top: 32 }, // 👈 add top: 32
  };
}

/** Summary footer row appended right below a table */
function summaryRow(doc, cells, startY) {
  autoTable(doc, {
    body: [cells],
    startY,
    theme: "plain",
    styles: {
      fontSize: FONT.body,
      fontStyle: "bold",
      textColor: COLOR.primary,
      fillColor: COLOR.accentLight,
      cellPadding: 2.2,
    },
    margin: { left: MARGIN, right: MARGIN, top: 32 }, // 👈 add top: 32
  });
}

/** Two-column key-value grid */
function infoGrid(doc, items, startY) {
  const colW = CONTENT / 2 - 3;
  items.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = MARGIN + col * (colW + 6);
    const y = startY + row * 7.5;

    // subtle row shading every other row
    if (row % 2 === 0) {
      doc.setFillColor(...COLOR.gray1);
      doc.rect(x - 1, y - 3.5, colW + 2, 6, "F");
    }

    labelValue(doc, item.label, item.value, x, y);
  });
  return startY + Math.ceil(items.length / 2) * 7.5 + 3;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export const generatePDF = (financeDetailsData) => {
  if (!financeDetailsData) {
    console.error("No finance data provided");
    return;
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const invoiceNo = financeDetailsData.invoiceNo || "invoice";

  // We'll add chrome after we know total pages via a two-pass approach.
  // jsPDF doesn't support total-page count natively, so we track manually.
  // Strategy: build all content, then loop pages to stamp chrome.

  const CONTENT_TOP = 30; // below header band

  // ── PAGE 1 ────────────────────────────────────────────────────────────────

  // ── Main Info Grid ────────────────────────────────────────────────────────
  const mainInfo = [
    { label: "Country", value: financeDetailsData.transportCountryName },
    { label: "Port", value: financeDetailsData.transportPort },
    { label: "Transport Way", value: financeDetailsData.transportWay },
    { label: "Invoice No", value: financeDetailsData.invoiceNo },
    { label: "Invoice Value (USD)", value: financeDetailsData.total },
    { label: "Invoice Date", value: financeDetailsData.invoiceDate },
    { label: "EP No", value: financeDetailsData.epNo },
    { label: "Truck No", value: financeDetailsData.truckNo },
    { label: "Zone", value: financeDetailsData.zone },
    { label: "Port Of Loading", value: financeDetailsData.loadFrom },
    { label: "Permit Till Date", value: financeDetailsData.permitedDate },
    { label: "Export No", value: financeDetailsData.expNo },
    { label: "Export Date", value: financeDetailsData.expDate },
    { label: "CM Value", value: financeDetailsData.cmValue },
    { label: "Consignee Name", value: financeDetailsData.consigneeName },
    { label: "Consignee Address", value: financeDetailsData.consigneeAddress },
    { label: "Bank Name", value: financeDetailsData.bankName },
    { label: "LC/TT/PS/SC/CMT", value: financeDetailsData.sccmt },
    { label: "Enterprise Employee", value: financeDetailsData.enterpriseEmp },
    { label: "Verifying Officer", value: financeDetailsData.verifyingEmp },
    { label: "Permit Officer", value: financeDetailsData.permitEmp },
    { label: "Total Box Weight", value: financeDetailsData.allTotalBoxWeight },
  ];

  let y = CONTENT_TOP;
  y = sectionHeading(doc, "Shipment Information", y);
  y = infoGrid(doc, mainInfo, y + 3);

  // ── Particular Expenses ───────────────────────────────────────────────────
  y += 4;
  y = sectionHeading(
    doc,
    `${financeDetailsData.traderServiceProvider || ""} — Particular Expenses`,
    y,
  );

  // Weights + rates
  doc
    .setFont("helvetica", "normal")
    .setFontSize(FONT.body)
    .setTextColor(...COLOR.black);
  const weightItems = [
    { label: "Gross Weight", value: financeDetailsData.grossWeight },
    { label: "Net Weight", value: financeDetailsData.netWeight },
  ];
  if (financeDetailsData.tradeExchangeRate > 0) {
    weightItems.push(
      {
        label: "Trade Exchange Rate",
        value: financeDetailsData.tradeExchangeRate,
      },
      {
        label: "Invoice Value (TK)",
        value:
          (
            financeDetailsData.total * financeDetailsData.tradeExchangeRate
          ).toFixed(2) + " TK",
      },
    );
  }
  y = infoGrid(doc, weightItems, y + 2);

  // Expense table
  autoTable(doc, {
    ...tableStyle(),
    head: [["Date", "Expense Name", "Remark", "Cost"]],
    body: (financeDetailsData.financeParticularExpenseNames || []).map((e) => [
      e.date || "N/A",
      e.particularExpenseName || "N/A",
      e.remark || "N/A",
      e.particularExpenseCost || "N/A",
    ]),
    startY: y + 2,
  });

  let expenseEndY = doc.lastAutoTable.finalY + 4;

  // Totals under expense table
  const expTotals = [
    { label: "Total Individual Cost", value: financeDetailsData.totalCost },
  ];
  if (financeDetailsData.tradeExchangeRate > 0) {
    const candF = financeDetailsData.candF || 0;
    expTotals.push(
      { label: "C&F Commission (0.20%)", value: candF },
      {
        label: "Total Amount",
        value:
          parseFloat(financeDetailsData.totalCost || 0) + parseFloat(candF),
      },
    );
  }
  if (financeDetailsData.tradeExpanseDate) {
    expTotals.push({
      label: "Trade Service Payment Date",
      value: financeDetailsData.tradeExpanseDate,
    });
  }
  expenseEndY = infoGrid(doc, expTotals, expenseEndY);

  // ── Products In Boxes ─────────────────────────────────────────────────────
  expenseEndY += 4;
  expenseEndY = sectionHeading(doc, "Products In Boxes", expenseEndY);

  autoTable(doc, {
    ...tableStyle(),
    head: [
      [
        "HS Code",
        "Product Name",
        "Model",
        "Qty",
        "Truck No",
        "Pallet No",
        "Total Box",
        "Box Wt",
        "Total Wt",
        "C&F (US$)",
        "C&F (USD)",
      ],
    ],
    body: (financeDetailsData.financeProductInBoxes || []).map((p) => [
      p.hscode || "N/A",
      p.productName || "N/A",
      p.productModel || "N/A",
      p.quantity || "N/A",
      p.truckNumber || "N/A",
      p.totalPallet || "N/A",
      p.totalBox || "N/A",
      p.weightPerBox || "N/A",
      p.individualTotalBoxWeight || "N/A",
      p.c_FUS || "N/A",
      p.c_FUSD || "N/A",
    ]),
    startY: expenseEndY + 2,
    columnStyles: {
      0: { cellWidth: 16 },
      1: { cellWidth: 28 },
      9: { cellWidth: 18 },
      10: { cellWidth: 18 },
    },
  });

  let productEndY = doc.lastAutoTable.finalY + 2;

  // All Total Weight
  infoGrid(
    doc,
    [
      {
        label: "All Total Weight",
        value: financeDetailsData.allTotalBoxWeight,
      },
    ],
    productEndY,
  );
  productEndY += 10;

  // ── Carrier Service ───────────────────────────────────────────────────────
  productEndY += 2;
  productEndY = sectionHeading(
    doc,
    `${financeDetailsData.containerServiceProvider || "N/A"} — Carrier Service`,
    productEndY,
  );

  autoTable(doc, {
    ...tableStyle(),
    head: [
      [
        "S/L No",
        "Date",
        "Container No",
        "Container T/S",
        "Invoice No",
        "EP No",
        "Fare Amount",
        "AIT/VAT 5%",
        "Total Amt (TK)",
      ],
    ],
    body: (financeDetailsData.financeContainerExpenseNames || []).map((c) => [
      c.slNo || "N/A",
      c.date || "N/A",
      c.containerNo || "N/A",
      c.containerTypeSize || "N/A",
      c.invoiceNo || "N/A",
      c.epNumber || "N/A",
      c.fareAmount || "N/A",
      c.aitVat || "N/A",
      c.individualTotalAmount || "N/A",
    ]),
    startY: productEndY + 2,
  });

  const expenseEnd2Y = doc.lastAutoTable.finalY + 1;

  summaryRow(
    doc,
    [
      "Gross Total Amount",
      "",
      "",
      "",
      "",
      "",
      financeDetailsData.totalFareAmount || "N/A",
      financeDetailsData.totalAitVat || "N/A",
      financeDetailsData.totalCarrierAmount || "N/A",
    ],
    expenseEnd2Y,
  );

  // ── Freight Service ───────────────────────────────────────────────────────
  let freightY = doc.lastAutoTable.finalY + 8;
  freightY = sectionHeading(
    doc,
    `${financeDetailsData.seaServiceProvider || "N/A"} — Freight Service`,
    freightY,
  );

  const freightInfo = [
    { label: "Shipper", value: financeDetailsData.shipper },
    { label: "B/L No", value: financeDetailsData.blNo },
    { label: "Container No", value: financeDetailsData.containerNo },
    { label: "Destination", value: financeDetailsData.destination },
    { label: "VSL/VOY", value: financeDetailsData.vslVoy },
    { label: "ETD CGP", value: financeDetailsData.etd },
    { label: "Sea Exchange Rate", value: financeDetailsData.exchangeRate },
  ];
  freightY = infoGrid(doc, freightInfo, freightY + 2);

  autoTable(doc, {
    ...tableStyle(),
    head: [["ID", "Description", "Amount (USD)", "Amount (TK)"]],
    body: (financeDetailsData.financeCharges || []).map((c) => [
      c.id || "N/A",
      c.description || "N/A",
      c.amountUSD || "N/A",
      c.amountBDT || "N/A",
    ]),
    startY: freightY + 2,
  });

  const chargesEndY = doc.lastAutoTable.finalY + 1;

  summaryRow(
    doc,
    [
      "Total",
      "",
      financeDetailsData.totalAmountUSD
        ? `${financeDetailsData.totalAmountUSD} USD`
        : "N/A",
      financeDetailsData.totalAmountBDT
        ? `${financeDetailsData.totalAmountBDT} TK`
        : "N/A",
    ],
    chargesEndY,
  );

  // Shipment payment date
  if (financeDetailsData.seaExpanseDate) {
    const payY = doc.lastAutoTable.finalY + 6;
    infoGrid(
      doc,
      [
        {
          label: "Shipment Payment Date",
          value: financeDetailsData.seaExpanseDate,
        },
      ],
      payY,
    );
  }

  // ── Stamp page chrome on every page ───────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageChrome(doc, invoiceNo, p, totalPages);
  }

  doc.save(`${invoiceNo}.pdf`);
};
