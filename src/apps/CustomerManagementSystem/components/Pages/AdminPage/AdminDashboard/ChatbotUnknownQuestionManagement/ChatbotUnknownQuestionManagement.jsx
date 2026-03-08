import React, { useState, useEffect } from "react";

const ChatbotUnknownQuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [products, setProducts] = useState([]);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteFilters, setDeleteFilters] = useState({
    product: "",
    lang: "",
    days: "",
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const uniqueProducts = [...new Set(questions.map((q) => q.product))];
      setProducts(uniqueProducts);
    }
  }, [questions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://grozziie.zjweiting.com:8035/tht/chatBot/unknown-questions",
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        setQuestions(data.data || []);
      } else {
        setError("API returned error");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?",
    );

    if (!confirmDelete) return;

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
        fetchStats();
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete question");
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
        fetchQuestions();
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
    <div className="p-6 max-w-7xl mx-auto">
      <Header stats={stats} />

      <Controls
        products={products}
        selectedProduct={selectedProduct}
        onProductChange={setSelectedProduct}
        onRefresh={fetchQuestions}
        onShowDeleteAll={() => setShowDeleteAllModal(true)}
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <QuestionsTable
          questions={filteredQuestions}
          onDelete={handleDelete}
          onRefresh={fetchQuestions}
        />
      )}

      {showDeleteAllModal && (
        <DeleteAllModal
          filters={deleteFilters}
          onFilterChange={setDeleteFilters}
          onConfirm={handleDeleteAll}
          onCancel={() => setShowDeleteAllModal(false)}
        />
      )}
    </div>
  );
};

// Header Component
const Header = ({ stats }) => (
  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl shadow-lg mb-6 text-white">
    <h1 className="text-3xl font-bold mb-5">Unknown Questions Management</h1>
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
      <button
        className="flex-1 md:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        onClick={onShowDeleteAll}
      >
        <span>🗑️</span> Delete All
      </button>
    </div>
  </div>
);

// Questions Table Component
const QuestionsTable = ({ questions, onDelete, onRefresh }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({
    question: "",
    lang: "",
    product: "",
  });

  const handleEdit = (question) => {
    setEditingQuestion(question.id);
    setEditForm({
      question: question.question,
      lang: question.lang,
      product: question.product,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        "https://grozziie.zjweiting.com:8035/tht/chatBot/unknown-questions/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            ...editForm,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setEditingQuestion(null);
        onRefresh();
      }
    } catch (err) {
      alert("Failed to update question");
    }
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setEditForm({ question: "", lang: "", product: "" });
  };

  if (questions.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  {editingQuestion === question.id ? (
                    <textarea
                      value={editForm.question}
                      onChange={(e) =>
                        setEditForm({ ...editForm, question: e.target.value })
                      }
                      rows="2"
                      className="w-full bg-white px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span
                      className="text-purple-600 hover:text-purple-800 cursor-pointer underline decoration-dotted"
                      onClick={() => setSelectedQuestion(question)}
                    >
                      {question.question.length > 50
                        ? `${question.question.substring(0, 50)}...`
                        : question.question}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingQuestion === question.id ? (
                    <input
                      type="text"
                      value={editForm.product}
                      onChange={(e) =>
                        setEditForm({ ...editForm, product: e.target.value })
                      }
                      className="w-32 px-2 py-1 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    question.product
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.created_at}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingQuestion === question.id ? (
                    <>
                      <button
                        className="text-green-600 hover:text-green-900 mr-3"
                        onClick={() => handleUpdate(question.id)}
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => setSelectedQuestion(question)}
                      >
                        View
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 mr-3"
                        onClick={() => handleEdit(question)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => onDelete(question.id)}
                      >
                        Delete
                      </button>
                    </>
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
          onEdit={() => {
            handleEdit(selectedQuestion);
            setSelectedQuestion(null);
          }}
          onDelete={() => {
            onDelete(selectedQuestion.id);
            setSelectedQuestion(null);
          }}
        />
      )}
    </>
  );
};

// Question Detail Modal Component
const QuestionDetailModal = ({ question, onClose, onEdit, onDelete }) => (
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
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          onClick={onDelete}
        >
          Delete
        </button>
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

// Empty State Component
const EmptyState = () => (
  <div className="text-center py-12 bg-white rounded-lg shadow">
    <div className="text-6xl mb-4">📭</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No Unknown Questions
    </h3>
    <p className="text-gray-500">
      There are no unknown questions to display at this time.
    </p>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="text-center py-12">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600 mb-4"></div>
    <p className="text-gray-600">Loading questions...</p>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message }) => (
  <div className="text-center py-12 bg-red-50 rounded-lg">
    <div className="text-6xl mb-4">⚠️</div>
    <p className="text-red-600 mb-4">{message}</p>
  </div>
);

export default ChatbotUnknownQuestionManagement;
