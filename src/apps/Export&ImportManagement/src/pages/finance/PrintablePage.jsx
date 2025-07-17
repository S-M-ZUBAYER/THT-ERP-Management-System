import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (financeDetailsData) => {
  if (!financeDetailsData) {
    console.error("No finance data provided");
    return;
  }

  const doc = new jsPDF();

  // Add border to the entire page
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10, "S");

  // Title Section
  doc.setFontSize(20).setTextColor(0, 102, 204).setFont("helvetica", "bold");
  doc.text("Shipment and Invoice Details", 15, 20);

  // Main Information Section (as grid)
  doc.setFontSize(10).setTextColor(0, 0, 0);
  const mainInfo = [
    { label: "Country", value: financeDetailsData.transportCountryName || "N/A" },
    { label: "Port", value: financeDetailsData.transportPort || "N/A" },
    { label: "Transport Way", value: financeDetailsData.transportWay || "N/A" },
    { label: "Invoice No", value: financeDetailsData.invoiceNo || "N/A" },
    { label: "Invoice Value (USD)", value: financeDetailsData.total || "N/A" },
    { label: "Invoice Date", value: financeDetailsData.invoiceDate || "N/A" },
    { label: "EP No", value: financeDetailsData.epNo || "N/A" },
    { label: "Truck No", value: financeDetailsData.truckNo || "N/A" },
    { label: "Zone", value: financeDetailsData.zone || "N/A" },
    { label: "Port Of Loading", value: financeDetailsData.loadFrom || "N/A" },
    { label: "Permit Till Date", value: financeDetailsData.permitedDate || "N/A" },
    { label: "Export No", value: financeDetailsData.expNo || "N/A" },
    { label: "Export Date", value: financeDetailsData.expDate || "N/A" },
    { label: "CM Value", value: financeDetailsData.cmValue || "N/A" },
    { label: "Consignee Name", value: financeDetailsData.consigneeName || "N/A" },
    { label: "Consignee Address", value: financeDetailsData.consigneeAddress || "N/A" },
    { label: "Bank Name", value: financeDetailsData.bankName || "N/A" },
    { label: "LC/No./TT/P.S/SC/CMT", value: financeDetailsData.sccmt || "N/A" },
    { label: "Enterprise Employee", value: financeDetailsData.enterpriseEmp || "N/A" },
    { label: "Verifying Officer", value: financeDetailsData.verifyingEmp || "N/A" },
    { label: "Permit Officer", value: financeDetailsData.permitEmp || "N/A" },
    { label: "Total Box Weight", value: financeDetailsData.allTotalBoxWeight || "N/A" },
  ];

  // Display the mainInfo in two columns, adjusted for proper alignment and spacing
  mainInfo.forEach((item, idx) => {
    const xPos = idx % 2 === 0 ? 15 : 110;
    const yPos = 30 + Math.floor(idx / 2) * 8; // Increased space between rows
    doc.text(`${item.label}: ${item.value}`, xPos, yPos);
  });

  // Particular Expenses Section
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0, 102, 204);
  doc.text(`${financeDetailsData.traderServiceProvider} Particular Expenses`, 15, 130);

  // Gross and Net Weight Section
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(0, 0, 0);
  doc.text(`Gross Weight: ${financeDetailsData.grossWeight || 'N/A'}`, 15, 136);
  doc.text(`Net Weight: ${financeDetailsData.netWeight || 'N/A'}`, 15, 142);

  // Trade Exchange Rate and Invoice Value
  if (financeDetailsData.tradeExchangeRate > 0) {
    doc.text(`Trade Exchange Rate: ${financeDetailsData.tradeExchangeRate}`, 15, 148);
    doc.text(`Invoice Value: ${(financeDetailsData.total * financeDetailsData.tradeExchangeRate).toFixed(2)} TK`, 15, 154);
  }

  // Expense Table
  doc.autoTable({
    head: [['Date', 'Expense Name', 'Remark', 'Cost']],
    body: financeDetailsData.financeParticularExpenseNames.map(expense => [
      expense.date || "N/A",
      expense.particularExpenseName || "N/A",
      expense.remark || "N/A",
      expense.particularExpenseCost || "N/A"
    ]),
    startY: 160,
    theme: 'grid',
    styles: { fontSize: 10, textColor: [0, 0, 0] },
    headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  const expenseEndY = doc.lastAutoTable.finalY;

  // Total Individual Cost
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(0, 0, 0);
  doc.text(`Total Individual Cost: ${financeDetailsData.totalCost || 'N/A'}`, 15, expenseEndY + 8);

  // C&F Commission and Total Amount
  if (financeDetailsData.tradeExchangeRate > 0) {
    const candFValue = financeDetailsData.candF || 'N/A';
    const totalAmount = parseFloat(financeDetailsData.totalCost || 0) + parseFloat(candFValue || 0);
    doc.text(`C&F Commission 0.20%: ${candFValue}`, 15, expenseEndY + 16);
    doc.text(`Total Amount: ${totalAmount}`, 15, expenseEndY + 24);
  }

  // Trade Service Payment Date
  if (financeDetailsData.tradeExpanseDate) {
    doc.text(`Trade Service Payment Date: ${financeDetailsData.tradeExpanseDate}`, 15, expenseEndY + 32);
  }

  // Products in Boxes Section
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0, 102, 204);
  doc.text("Products In Boxes", 15, expenseEndY + 60);

  doc.autoTable({
    head: [['HS Code', 'Product Name', 'Model', 'Quantity', 'Truck No', 'Pallet No', 'Total Box', 'Box Weight', 'Total Weight', 'FOB/CIF/CFR/C&F (US$)', 'FOB/CIF/CFR/C&F (USD)']],
    body: financeDetailsData.financeProductInBoxes.map(product => [
      product.hscode || "N/A",
      product.productName || "N/A",
      product.productModel || "N/A",
      product.quantity || "N/A",
      product.truckNumber || "N/A",
      product.totalPallet || "N/A",
      product.totalBox || "N/A",
      product.weightPerBox || "N/A",
      product.individualTotalBoxWeight || "N/A",
      product.c_FUS || "N/A",
      product.c_FUSD || "N/A"
    ]),
    startY: expenseEndY + 70,
    theme: 'grid',
    styles: { fontSize: 10, textColor: [0, 0, 0] },
    headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  const productEndY = doc.lastAutoTable.finalY;

  // Adding the total weight at the end
  doc.text(`All Total Weight: ${financeDetailsData.allTotalBoxWeight || 'N/A'}`, 15, productEndY + 7);

  // Carrier Service Section
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0, 102, 204);
  doc.text(`${financeDetailsData?.containerServiceProvider || 'N/A'} CARRIER SERVICE`, 15, productEndY + 30);

  doc.autoTable({
    head: [['S/L No', 'Date', 'Container No', 'Container T/S', 'Invoice No', 'EP NO', 'Fare Amount', 'Ait/Vat 5%', 'Total Amount/TK']],
    body: financeDetailsData.financeContainerExpenseNames.map(container => [
      container.slNo || "N/A",
      container.date || "N/A",
      container.containerNo || "N/A",
      container.containerTypeSize || "N/A",
      container.invoiceNo || "N/A",
      container.epNumber || "N/A",
      container.fareAmount || "N/A",
      container.aitVat || "N/A",
      container.individualTotalAmount || "N/A"
    ]),
    startY: productEndY + 40,  // Make sure `productEndY` is correct from the previous table
    theme: 'grid',
    styles: { fontSize: 10, textColor: [0, 0, 0] },
    headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  // Correctly capture the Y position after the first table
  const expenseEnd2Y = doc.lastAutoTable.finalY;

  // Add Gross Total Amount table footer directly below the first table
  doc.autoTable({
    body: [[
      "Gross Total Amount", '', '', '', '', '', financeDetailsData.totalFareAmount || "N/A",
      financeDetailsData.totalAitVat || "N/A", financeDetailsData.totalCarrierAmount || "N/A"
    ]],
    startY: expenseEnd2Y + 1,  // Adjust the gap to 5 for minimal space between tables
    theme: 'plain',
    styles: { fontSize: 10, fontStyle: 'bold' },
  });


  // Add FREIGHT SERVICE Section
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0, 102, 204);
  doc.text(`${financeDetailsData.seaServiceProvider || 'N/A'} FREIGHT SERVICE`, 15, expenseEnd2Y + 30);

  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(0, 0, 0);
  const freightInfo = [
    { label: "Shipper", value: financeDetailsData.shipper || "N/A" },
    { label: "B/L No", value: financeDetailsData.blNo || "N/A" },
    { label: "Container No", value: financeDetailsData.containerNo || "N/A" },
    { label: "Destination", value: financeDetailsData.destination || "N/A" },
    { label: "VSL/VOY", value: financeDetailsData.vslVoy || "N/A" },
    { label: "ETD CGP", value: financeDetailsData.etd || "N/A" },
    { label: "Sea Exchange Rate", value: financeDetailsData.exchangeRate || "N/A" },
  ];

  freightInfo.forEach((item, idx) => {
    const xPos = idx % 2 === 0 ? 15 : 110;
    const yPos = expenseEnd2Y + 38 + Math.floor(idx / 2) * 8;
    doc.text(`${item.label}: ${item.value}`, xPos, yPos);
  });

  // Add Charges Table
  doc.autoTable({
    head: [['ID', 'Description', 'Amount (USD)', 'Amount (TK)']],
    body: financeDetailsData.financeCharges.map(charge => [
      charge.id || "N/A",
      charge.description || "N/A",
      charge.amountUSD || "N/A",
      charge.amountBDT || "N/A"
    ]),
    startY: expenseEnd2Y + 70,
    theme: 'grid',
    styles: { fontSize: 10, textColor: [0, 0, 0] },
    headStyles: { fillColor: [204, 229, 255], textColor: [0, 0, 102] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  const chargesEndY = doc.lastAutoTable.finalY;

  // Add Total for Charges Table
  doc.autoTable({
    body: [[
      "Total", '', financeDetailsData.totalAmountUSD || "N/A USD", financeDetailsData.totalAmountBDT || "N/A TK"
    ]],
    startY: chargesEndY + 1,
    theme: 'plain',
    styles: { fontSize: 10, fontStyle: 'bold' },
  });

  // Add Shipment Payment Date
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(0, 0, 0);
  if (financeDetailsData.seaExpanseDate) {
    doc.text(`Shipment Payment Data: ${financeDetailsData.seaExpanseDate}`, 15, chargesEndY + 15);
  }

  // Save PDF
  doc.save(`${financeDetailsData.invoiceNo || 'invoice'}.pdf`);
};

