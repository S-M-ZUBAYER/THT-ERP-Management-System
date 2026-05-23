import React, { useCallback, useEffect, useState } from "react";
import { FAQ_DRAFT_BASE_URL, FAQ_PRODUCTS, UNKNOWN_QUESTIONS_PAGE_LIMIT } from "./chatbotManagementUtils";
import { ErrorMessage, LoadingSpinner, PaginationControls } from "./SharedChatbotComponents";

const AvailableQAPanel = () => {
  const [selectedProduct, setSelectedProduct] = useState(FAQ_PRODUCTS[0]);
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: UNKNOWN_QUESTIONS_PAGE_LIMIT,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchFaqs = useCallback(async () => {
    try {
      setLoadingFaqs(true);
      setError("");
      const response = await fetch(
        `${FAQ_DRAFT_BASE_URL}/tht/chatBot/faqs?product=${encodeURIComponent(
          selectedProduct,
        )}&page=${currentPage}&limit=${UNKNOWN_QUESTIONS_PAGE_LIMIT}`,
      );
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to fetch available Q&A");
      }

      setFaqs(data.data || []);
      setPagination({
        total: data.total || 0,
        page: data.page || currentPage,
        limit: data.limit || UNKNOWN_QUESTIONS_PAGE_LIMIT,
        totalPages: data.totalPages || 1,
        hasNextPage: Boolean(data.hasNextPage),
        hasPrevPage: Boolean(data.hasPrevPage),
      });
    } catch (fetchError) {
      console.error("Failed to fetch available Q&A:", fetchError);
      setError("Failed to fetch available Q&A.");
      setFaqs([]);
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
    } finally {
      setLoadingFaqs(false);
    }
  }, [currentPage, selectedProduct]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="bg-gradient-to-r from-[#004368] via-[#0b638f] to-[#14a88b] px-6 py-5 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Available Q&A</h2>
              <p className="mt-1 text-sm text-white/80">
                Browse saved FAQ questions and answers by product category.
              </p>
            </div>
            <div className="rounded-lg bg-white/15 px-4 py-3 text-sm backdrop-blur">
              <span className="block text-xs uppercase tracking-wide text-white/70">
                Total
              </span>
              <span className="text-lg font-bold">{pagination.total}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-[minmax(260px,420px)_auto] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Product Category
              </label>
              <select
                value={selectedProduct}
                onChange={handleProductChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {FAQ_PRODUCTS.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="rounded-lg bg-[#004368] px-5 py-2 font-semibold text-white transition-colors hover:bg-[#005985] disabled:cursor-not-allowed disabled:bg-gray-300"
              onClick={fetchFaqs}
              disabled={loadingFaqs}
            >
              {loadingFaqs ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error ? (
            <ErrorMessage message={error} />
          ) : loadingFaqs ? (
            <LoadingSpinner />
          ) : faqs.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
              No available Q&A found for this product.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[#004368] px-3 py-1 text-sm font-bold text-white">
                        {faq.id}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                      {selectedProduct}
                    </span>
                  </div>

                  <div className="rounded-lg bg-white p-4 text-left text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                    {faq.answer || "No answer available."}
                  </div>

                  {faq.variants?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {faq.variants.map((variant, index) => (
                        <span
                          key={`${faq.id}-${index}`}
                          className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
                        >
                          {variant}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <PaginationControls
            pagination={pagination}
            onPageChange={setCurrentPage}
            itemLabel="Q&A"
          />
        </div>
      </div>
    </div>
  );
};



export default AvailableQAPanel;
