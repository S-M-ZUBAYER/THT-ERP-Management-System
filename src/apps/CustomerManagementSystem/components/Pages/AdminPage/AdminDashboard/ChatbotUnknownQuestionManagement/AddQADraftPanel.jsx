import React, { useCallback, useEffect, useState } from "react";
import { FAQ_APPLY_URLS, FAQ_DRAFT_BASE_URL, FAQ_PRODUCTS, getSavedUserEmail } from "./chatbotManagementUtils";
import { ConfirmActionModal, LoadingSpinner } from "./SharedChatbotComponents";

const AddQADraftPanel = () => {
  const [selectedProduct, setSelectedProduct] = useState(FAQ_PRODUCTS[0]);
  const [userEmail] = useState(getSavedUserEmail());
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [selectedDraftIds, setSelectedDraftIds] = useState([]);
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [editForm, setEditForm] = useState({ question: "", answer: "" });
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [applyingDrafts, setApplyingDrafts] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchDrafts = useCallback(async () => {
    if (!selectedProduct || !userEmail) {
      setDrafts([]);
      return;
    }

    try {
      setLoadingDrafts(true);
      const response = await fetch(
        `${FAQ_DRAFT_BASE_URL}/tht/chatBot/faq-drafts?product=${encodeURIComponent(
          selectedProduct,
        )}&userEmail=${encodeURIComponent(userEmail)}&status=pending`,
      );
      const data = await response.json();
      setDrafts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch drafts:", error);
      setStatusMessage("Failed to fetch pending Q/A drafts.");
    } finally {
      setLoadingDrafts(false);
    }
  }, [selectedProduct, userEmail]);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  useEffect(() => {
    setSelectedDraftIds((prev) =>
      prev.filter((id) => drafts.some((draft) => draft.id === id)),
    );
  }, [drafts]);

  const resetForm = () => {
    setQuestionText("");
    setAnswerText("");
  };

  const handleSaveDraft = async (event) => {
    event.preventDefault();

    if (!selectedProduct || !userEmail || !questionText || !answerText) {
      setStatusMessage(
        "Please select product and add question and answer. Logged-in user email is required.",
      );
      return;
    }

    try {
      setSavingDraft(true);
      setStatusMessage("");
      const response = await fetch(
        `${FAQ_DRAFT_BASE_URL}/tht/chatBot/faq-drafts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: selectedProduct,
            userEmail,
            question: questionText,
            answer: answerText,
            variants: [],
          }),
        },
      );
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to save draft");
      }

      resetForm();
      setStatusMessage("Q/A draft saved successfully.");
      fetchDrafts();
    } catch (error) {
      console.error("Failed to save draft:", error);
      setStatusMessage("Failed to save Q/A draft.");
    } finally {
      setSavingDraft(false);
    }
  };

  const handleEditDraft = (draft) => {
    setEditingDraftId(draft.id);
    setEditForm({
      question: draft.question || "",
      answer: draft.answer || "",
    });
  };

  const handleUpdateDraft = async (draftId) => {
    try {
      const response = await fetch(
        `${FAQ_DRAFT_BASE_URL}/tht/chatBot/faq-drafts/${draftId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: editForm.question,
            answer: editForm.answer,
            variants: [],
          }),
        },
      );
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to update draft");
      }

      setEditingDraftId(null);
      setStatusMessage("Draft updated successfully.");
      fetchDrafts();
    } catch (error) {
      console.error("Failed to update draft:", error);
      setStatusMessage("Failed to update draft.");
    }
  };

  const handleDeleteDraft = async (draftId) => {
    try {
      const response = await fetch(
        `${FAQ_DRAFT_BASE_URL}/tht/chatBot/faq-drafts/${draftId}`,
        { method: "DELETE" },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to delete draft");
      }

      setStatusMessage("Draft deleted successfully.");
      fetchDrafts();
    } catch (error) {
      console.error("Failed to delete draft:", error);
      setStatusMessage("Failed to delete draft.");
    }
  };

  const handleApplyDrafts = async (ids = []) => {
    if (!userEmail) {
      setStatusMessage("User email is required before updating embedding.");
      return;
    }

    try {
      setApplyingDrafts(true);
      setStatusMessage("");
      const response = await fetch(
        `${FAQ_DRAFT_BASE_URL}${FAQ_APPLY_URLS[selectedProduct]}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail,
            category: "FAQ",
            ...(ids.length ? { ids } : {}),
          }),
        },
      );
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to update embedding");
      }

      setSelectedDraftIds([]);
      setStatusMessage("Embedding updated successfully.");
      fetchDrafts();
    } catch (error) {
      console.error("Failed to update embedding:", error);
      setStatusMessage("Failed to update TXT and embedding.");
    } finally {
      setApplyingDrafts(false);
    }
  };

  const isAllDraftsSelected =
    drafts.length > 0 && selectedDraftIds.length === drafts.length;

  const handleSelectAllDrafts = (event) => {
    if (event.target.checked) {
      setSelectedDraftIds(drafts.map((draft) => draft.id));
      return;
    }

    setSelectedDraftIds([]);
  };

  const handleSelectDraft = (id) => {
    setSelectedDraftIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg mb-6">
        <div className="bg-gradient-to-r from-[#004368] via-[#0b638f] to-[#14a88b] px-6 py-5 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Add Q&A Draft</h2>
              <p className="mt-1 text-sm text-white/80">
                Save a pending answer, review it below, then update the product
                embedding.
              </p>
            </div>
            <div className="rounded-lg bg-white/15 px-4 py-3 text-sm backdrop-blur">
              <span className="block text-xs uppercase tracking-wide text-white/70">
                User Email
              </span>
              <span className="font-semibold">{userEmail || "Not found"}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveDraft} className="space-y-5 p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product
              </label>
              <select
                value={selectedProduct}
                onChange={(event) => setSelectedProduct(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {FAQ_PRODUCTS.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question
            </label>
            <textarea
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              rows="3"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write the customer question"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Answer
            </label>
            <textarea
              value={answerText}
              onChange={(event) => setAnswerText(event.target.value)}
              rows="4"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write the answer"
            />
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-500">
              Draft status will be saved as pending until embedding is updated.
            </p>
            <button
              type="submit"
              disabled={savingDraft}
              className="rounded-lg bg-[#004368] px-5 py-2 font-semibold text-white transition-colors hover:bg-[#005985] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {savingDraft ? "Saving..." : "Save Draft"}
            </button>
          </div>
        </form>

        {statusMessage && (
          <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            {statusMessage}
          </p>
        )}
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#004368]">
              Pending Q/A List
            </h2>
            <p className="text-sm text-gray-500">
              Showing pending drafts for {selectedProduct}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              className="rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              onClick={() =>
                setConfirmAction({
                  title: "Update Embedding",
                  message: `Apply all pending Q/A drafts for ${selectedProduct}?`,
                  confirmLabel: "Update Embedding",
                  confirmClassName: "bg-purple-600 hover:bg-purple-700",
                  onConfirm: () => handleApplyDrafts(),
                })
              }
              disabled={applyingDrafts || drafts.length === 0}
            >
              {applyingDrafts ? "Updating..." : "Update Embedding"}
            </button>
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              onClick={() =>
                setConfirmAction({
                  title: "Update Selected Embedding",
                  message: `Apply ${selectedDraftIds.length} selected Q/A draft${
                    selectedDraftIds.length > 1 ? "s" : ""
                  } for ${selectedProduct}?`,
                  confirmLabel: "Update Selected",
                  confirmClassName: "bg-blue-600 hover:bg-blue-700",
                  onConfirm: () => handleApplyDrafts(selectedDraftIds),
                })
              }
              disabled={applyingDrafts || selectedDraftIds.length === 0}
            >
              Update Selected
            </button>
          </div>
        </div>

        {loadingDrafts ? (
          <LoadingSpinner />
        ) : drafts.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
            No pending Q/A drafts found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isAllDraftsSelected}
                      onChange={handleSelectAllDrafts}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      aria-label="Select all pending drafts"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Q ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Question
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Answer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {drafts.map((draft) => (
                  <tr key={draft.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedDraftIds.includes(draft.id)}
                        onChange={() => handleSelectDraft(draft.id)}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        aria-label={`Select draft ${draft.id}`}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {draft.qId || draft.q_id || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {editingDraftId === draft.id ? (
                        <textarea
                          rows="2"
                          value={editForm.question}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              question: event.target.value,
                            })
                          }
                          className="w-full rounded border border-gray-300 bg-white px-2 py-1"
                        />
                      ) : (
                        draft.question
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {editingDraftId === draft.id ? (
                        <textarea
                          rows="2"
                          value={editForm.answer}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              answer: event.target.value,
                            })
                          }
                          className="w-full rounded border border-gray-300 bg-white px-2 py-1"
                        />
                      ) : (
                        draft.answer
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {draft.status}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      {editingDraftId === draft.id ? (
                        <>
                          <button
                            className="mr-3 text-green-600 hover:text-green-900"
                            onClick={() => handleUpdateDraft(draft.id)}
                          >
                            Save
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => setEditingDraftId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="mr-3 text-green-600 hover:text-green-900"
                            onClick={() => handleEditDraft(draft)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() =>
                              setConfirmAction({
                                title: "Delete Draft",
                                message:
                                  "Are you sure you want to delete this Q/A draft?",
                                confirmLabel: "Delete",
                                confirmClassName:
                                  "bg-red-500 hover:bg-red-600",
                                onConfirm: () => handleDeleteDraft(draft.id),
                              })
                            }
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
        )}
      </div>

      {confirmAction && (
        <ConfirmActionModal
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          confirmClassName={confirmAction.confirmClassName}
          onConfirm={async () => {
            await confirmAction.onConfirm();
            setConfirmAction(null);
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </>
  );
};



export default AddQADraftPanel;
