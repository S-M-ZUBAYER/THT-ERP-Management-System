import React, { useCallback, useEffect, useState } from "react";
import { FAQ_DRAFT_BASE_URL, UNKNOWN_QUESTIONS_PAGE_LIMIT, exportQuestionsToExcel, getQuestionAnswer } from "./chatbotManagementUtils";
import { ConfirmActionModal, EmptyState, ErrorMessage, LoadingSpinner, PaginationControls } from "./SharedChatbotComponents";

const QuestionsListPanel = ({ allowDelete }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: UNKNOWN_QUESTIONS_PAGE_LIMIT,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteFilters, setDeleteFilters] = useState({
    product: "",
    lang: "",
    days: "",
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (questions.length > 0) {
      const uniqueProducts = [...new Set(questions.map((q) => q.product))];
      setProducts(uniqueProducts);
    } else {
      setProducts([]);
    }
  }, [questions]);

  const fetchQuestions = useCallback(async (pageToFetch = 1) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${FAQ_DRAFT_BASE_URL}/tht/chatBot/unknown-questions-paginated?page=${pageToFetch}&limit=${UNKNOWN_QUESTIONS_PAGE_LIMIT}`,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        setQuestions(data.data || []);
        setPagination({
          total: data.total || 0,
          page: data.page || pageToFetch,
          limit: data.limit || UNKNOWN_QUESTIONS_PAGE_LIMIT,
          totalPages: data.totalPages || 1,
          hasNextPage: Boolean(data.hasNextPage),
          hasPrevPage: Boolean(data.hasPrevPage),
        });
      } else {
        setError("API returned error");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        "https://grozziie.zjweiting.com:8035/tht/chatBot/unknown-questions-stats",
      );
      const data = await response.json();
      if (data.success) {
        setStats({
          ...data.data,
          overview: Array.isArray(data.data.overview)
            ? data.data.overview[0]
            : data.data.overview,
        });
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchQuestions(currentPage);
    fetchStats();
  }, [currentPage, fetchQuestions]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        "https://grozziie.zjweiting.com:8035/tht/chatBot/unknown-questions/delete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        fetchQuestions(currentPage);
        fetchStats();
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete question");
    }
  };

  const handleDeleteSelected = async (ids) => {
    if (!ids.length) return;

    try {
      await Promise.all(
        ids.map((id) =>
          fetch(
            "https://grozziie.zjweiting.com:8035/tht/chatBot/unknown-questions/delete",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
            },
          ).then((response) => response.json()),
        ),
      );

      setQuestions((prev) => prev.filter((q) => !ids.includes(q.id)));
      fetchQuestions(currentPage);
      fetchStats();
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected questions");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch(
        "https://grozziie.zjweiting.com:8035/tht/chatBot/unknown-questions/delete-all",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deleteFilters),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setShowDeleteAllModal(false);
        fetchQuestions(currentPage);
        fetchStats();
        setDeleteFilters({ product: "", lang: "", days: "" });
      }
    } catch (err) {
      alert("Failed to delete questions");
      console.error(err);
    }
  };

  const filteredQuestions =
    selectedProduct === "all"
      ? questions
      : questions.filter((q) => q.product === selectedProduct);

  return (
    <>
      <Header stats={stats} title="Available Unknown Question" />
      <Controls
        products={products}
        selectedProduct={selectedProduct}
        onProductChange={setSelectedProduct}
        onRefresh={() => fetchQuestions(currentPage)}
        onShowDeleteAll={() => setShowDeleteAllModal(true)}
        allowDelete={allowDelete}
      />
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <QuestionsTable
          questions={filteredQuestions}
          onDelete={handleDelete}
          onDeleteSelected={handleDeleteSelected}
          allowDelete={allowDelete}
        />
      )}
      <PaginationControls pagination={pagination} onPageChange={setCurrentPage} />
      {allowDelete && showDeleteAllModal && (
        <DeleteAllModal
          filters={deleteFilters}
          onFilterChange={setDeleteFilters}
          onConfirm={handleDeleteAll}
          onCancel={() => setShowDeleteAllModal(false)}
        />
      )}
    </>
  );
};

// Header Component
const Header = ({ stats, title }) => (
  <div className="bg-gradient-to-r from-[#004368] via-[#0b638f] to-[#14a88b] p-6 rounded-xl shadow-lg mb-6 text-white">
    <h1 className="text-3xl font-bold mb-5">{title}</h1>
    {stats && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          label="Total Questions"
          value={stats.overview?.total_questions || 0}
        />
        {/* <StatCard
          label="Languages"
          value={stats.overview?.unique_languages || 0}
        /> */}
        <StatCard
          label="Products"
          value={stats.overview?.unique_products || 0}
        />
      </div>
    )}
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-lg text-center">
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm opacity-90">{label}</div>
  </div>
);

// Controls Component
const Controls = ({
  products,
  selectedProduct,
  onProductChange,
  onRefresh,
  onShowDeleteAll,
  allowDelete,
}) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow">
    <div className="flex items-center gap-3 w-full md:w-auto">
      <label className="font-medium text-gray-900">Filter by Product:</label>
      <select
        value={selectedProduct}
        onChange={(e) => onProductChange(e.target.value)}
        className="px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 md:flex-none"
      >
        <option value="all">All Products</option>
        {products.map((product) => (
          <option key={product} value={product}>
            {product}
          </option>
        ))}
      </select>
    </div>
    <div className="flex gap-3 w-full md:w-auto">
      <button
        className="flex-1 md:flex-none px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        onClick={onRefresh}
      >
        <span>🔄</span> Refresh
      </button>
      {allowDelete && (
      <button
        className="flex-1 md:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        onClick={onShowDeleteAll}
      >
        <span>🗑️</span> Delete All
      </button>
      )}
    </div>
  </div>
);


// Questions Table Component
const QuestionsTable = ({
  questions,
  onDelete,
  onDeleteSelected,
  allowDelete,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    setSelectedQuestionIds((prev) =>
      prev.filter((id) => questions.some((question) => question.id === id)),
    );
  }, [questions]);

  const isAllSelected =
    questions.length > 0 && selectedQuestionIds.length === questions.length;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedQuestionIds(questions.map((question) => question.id));
      return;
    }

    setSelectedQuestionIds([]);
  };

  const handleSelectQuestion = (id) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  };

  const closeConfirmAction = () => setConfirmAction(null);

  const handleExportAll = async () => {
    try {
      await exportQuestionsToExcel(
        questions,
        `all_unknown_questions_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Failed to export all questions:", error);
      alert("Failed to export all questions");
    }
  };

  const confirmExportAll = () => {
    setConfirmAction({
      title: "Export All Questions",
      message: `Export ${questions.length} unknown question${
        questions.length > 1 ? "s" : ""
      } to an XLSX file?`,
      confirmLabel: "Export All",
      confirmClassName: "bg-green-600 hover:bg-green-700",
      onConfirm: handleExportAll,
    });
  };

  const handleExportSelected = async () => {
    const selectedQuestions = questions.filter((question) =>
      selectedQuestionIds.includes(question.id),
    );

    try {
      await exportQuestionsToExcel(
        selectedQuestions,
        `selected_unknown_questions_${
          new Date().toISOString().split("T")[0]
        }.xlsx`,
      );
    } catch (error) {
      console.error("Failed to export selected questions:", error);
      alert("Failed to export selected questions");
    }
  };

  const confirmExportSelected = () => {
    setConfirmAction({
      title: "Export Selected Questions",
      message: `Export ${selectedQuestionIds.length} selected unknown question${
        selectedQuestionIds.length > 1 ? "s" : ""
      } to an XLSX file?`,
      confirmLabel: "Export Selected",
      confirmClassName: "bg-blue-600 hover:bg-blue-700",
      onConfirm: handleExportSelected,
    });
  };

  const confirmDeleteQuestion = (id) => {
    setConfirmAction({
      title: "Delete Question",
      message: "Are you sure you want to delete this question?",
      confirmLabel: "Delete",
      confirmClassName: "bg-red-500 hover:bg-red-600",
      onConfirm: () => onDelete(id),
    });
  };

  const confirmDeleteSelected = () => {
    setConfirmAction({
      title: "Delete Selected Questions",
      message: `Are you sure you want to delete ${
        selectedQuestionIds.length
      } selected question${selectedQuestionIds.length > 1 ? "s" : ""}?`,
      confirmLabel: "Delete Selected",
      confirmClassName: "bg-red-500 hover:bg-red-600",
      onConfirm: async () => {
        await onDeleteSelected(selectedQuestionIds);
        setSelectedQuestionIds([]);
      },
    });
  };

  if (questions.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="mb-3 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-end">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={confirmExportAll}
          disabled={questions.length === 0}
        >
          Export All XLSX
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={confirmExportSelected}
          disabled={selectedQuestionIds.length === 0}
        >
          Export Selected XLSX
        </button>
      </div>

      {allowDelete && selectedQuestionIds.length > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 px-4 py-3">
          <p className="text-sm font-medium text-purple-700">
            {selectedQuestionIds.length} question
            {selectedQuestionIds.length > 1 ? "s" : ""} selected
          </p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={confirmDeleteSelected}
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  aria-label="Select all questions"
                />
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial No
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question, index) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    checked={selectedQuestionIds.includes(question.id)}
                    onChange={() => handleSelectQuestion(question.id)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    aria-label={`Select question ${index + 1}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <span
                    className="text-purple-600 hover:text-purple-800 cursor-pointer underline decoration-dotted"
                    onClick={() => setSelectedQuestion(question)}
                  >
                    {question.question.length > 50
                      ? `${question.question.substring(0, 50)}...`
                      : question.question}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {question.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.created_at}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => setSelectedQuestion(question)}
                  >
                    View
                  </button>
                  {allowDelete && (
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => confirmDeleteQuestion(question.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onDelete={
            allowDelete
              ? () => {
                  confirmDeleteQuestion(selectedQuestion.id);
                  setSelectedQuestion(null);
                }
              : null
          }
          allowDelete={allowDelete}
        />
      )}

      {confirmAction && (
        <ConfirmActionModal
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          confirmClassName={confirmAction.confirmClassName}
          onConfirm={async () => {
            await confirmAction.onConfirm();
            closeConfirmAction();
          }}
          onCancel={closeConfirmAction}
        />
      )}
    </>
  );
};


// Question Detail Modal Component
const QuestionDetailModal = ({
  question,
  onClose,
  onDelete,
  allowDelete,
}) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Question Details</h2>
          <button
            className="text-white hover:text-gray-200 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="flex">
            <label className="font-semibold text-gray-700 w-24">ID:</label>
            <span className="text-gray-900">{question.id}</span>
          </div>
          <div className="flex">
            <label className="font-semibold text-gray-700 w-24">
              Question:
            </label>
            <div className="flex-1 bg-gray-50 p-3 rounded-lg text-gray-900 whitespace-pre-wrap">
              {question.question}
            </div>
          </div>

          <div className="flex">
            <label className="font-semibold text-gray-700 w-24">Answer:</label>
            <div className="flex-1 bg-green-50 p-3 rounded-lg text-gray-900 whitespace-pre-wrap">
              {getQuestionAnswer(question)}
            </div>
          </div>

          <div className="flex">
            <label className="font-semibold text-gray-700 w-24">Product:</label>
            <span className="text-gray-900">{question.product}</span>
          </div>
          <div className="flex">
            <label className="font-semibold text-gray-700 w-24">
              Created At:
            </label>
            <span className="text-gray-900">{question.created_at}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
        {allowDelete && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);


// Delete All Modal Component
const DeleteAllModal = ({ filters, onFilterChange, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-xl max-w-md w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-xl">
        <h2 className="text-xl font-bold text-white">
          Delete Multiple Questions
        </h2>
      </div>

      <div className="p-6">
        <p className="text-red-600 font-semibold mb-4 p-3 bg-red-50 rounded-lg">
          ⚠️ This action cannot be undone!
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Product:
            </label>
            <input
              type="text"
              placeholder="Product name (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={filters.product}
              onChange={(e) =>
                onFilterChange({ ...filters, product: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Older than (days):
            </label>
            <input
              type="number"
              placeholder="Days (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={filters.days}
              onChange={(e) =>
                onFilterChange({ ...filters, days: e.target.value })
              }
              min="1"
            />
          </div>

          <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
            Leave filters empty to delete ALL questions
          </p>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          onClick={onConfirm}
        >
          Confirm Delete All
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);



export default QuestionsListPanel;
