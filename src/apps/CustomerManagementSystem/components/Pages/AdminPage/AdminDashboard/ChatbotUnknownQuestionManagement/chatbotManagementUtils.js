import ExcelJS from "exceljs";

export const exportQuestionsToExcel = async (questions, fileName) => {
  if (!questions.length) {
    alert("No questions available to export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Unknown Questions");

  worksheet.columns = [
    { header: "Serial No", key: "serial", width: 12 },
    { header: "ID", key: "id", width: 12 },
    { header: "Question", key: "question", width: 60 },
    { header: "Answer", key: "answer", width: 60 },
    { header: "Product", key: "product", width: 24 },
    { header: "Created At", key: "createdAt", width: 24 },
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

  questions.forEach((question, index) => {
    worksheet.addRow({
      serial: index + 1,
      id: question.id,
      question: question.question || "",
      answer: getQuestionAnswer(question),
      product: question.product || "",
      createdAt: question.created_at || "",
    });
  });

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "top", wrapText: true };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

export const getQuestionAnswer = (question) => {
  const possibleAnswer =
    question.answer ||
    question.answers ||
    question.answerText ||
    question.response ||
    question.reply ||
    question.botAnswer ||
    question.answer_EN ||
    question.answer_CN ||
    question.answer_BN;

  if (Array.isArray(possibleAnswer)) {
    return possibleAnswer
      .map((answer) =>
        typeof answer === "object" ? JSON.stringify(answer) : String(answer),
      )
      .join("\n");
  }

  if (possibleAnswer && typeof possibleAnswer === "object") {
    return JSON.stringify(possibleAnswer, null, 2);
  }

  return possibleAnswer || "No answer found in this question data.";
};

export const FAQ_DRAFT_BASE_URL = "https://grozziie.zjweiting.com:8035";
export const UNKNOWN_QUESTIONS_PAGE_LIMIT = 20;

export const FAQ_PRODUCTS = [
  "Attendance Machine",
  "Manual Attendance Machine",
  "Dot Printer",
  "Thermal Printer",
  "Power Bank",
  "Face Attendance",
  "Device Face Attendance Machine",
];

export const FAQ_APPLY_URLS = {
  "General Chat": "/tht/chatBot/faq/applyDrafts",
  "Attendance Machine": "/tht/chatBot/attendanceMachine/faq/applyDrafts",
  "Manual Attendance Machine":
    "/tht/chatBot/manualAttendanceMachine/faq/applyDrafts",
  "Dot Printer": "/tht/chatBot/dotPrinter/faq/applyDrafts",
  "Thermal Printer": "/tht/chatBot/thermalPrinter/faq/applyDrafts",
  "Power Bank": "/tht/chatBot/powerBank/faq/applyDrafts",
  "Face Attendance": "/tht/chatBot/faceAttendance/faq/applyDrafts",
  "Device Face Attendance Machine":
    "/tht/chatBot/deviceFaceAttendanceMachine/faq/applyDrafts",
};

export const getSavedUserEmail = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.email || user?.userEmail || "";
  } catch {
    return "";
  }
};
