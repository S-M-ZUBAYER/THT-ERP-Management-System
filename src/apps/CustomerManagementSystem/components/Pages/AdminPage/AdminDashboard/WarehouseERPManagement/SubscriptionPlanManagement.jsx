import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Edit3, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import erpApi, { hasErpSession } from "@/lib/erpApi";
import LoadingSpinner from "../Online Print/OnlinePrintComponent/LoadingSpinner";

const COUNTRY_OPTIONS = ["US", "MY", "TH", "PH", "ID", "VN", "CN", "SG"];
const CURRENCY_OPTIONS = ["USD", "MYR", "THB", "PHP", "IDR", "VND", "CNY", "SGD"];
const LANGUAGE_OPTIONS = ["en", "zh", "ms", "th", "vi", "id", "fil"];

const TAB_OPTIONS = [
  { key: "prices", label: "Plan Prices" },
  { key: "features", label: "Plan Features" },
  { key: "translations", label: "Plan Translations" },
];

const emptyPriceForm = {
  country: "MY",
  currency: "MYR",
  amount: "",
  compareAmount: "",
  isAvailable: true,
};

const emptyPlanForm = {
  name: "",
  code: "",
  durationDays: "",
  isTrial: false,
  isActive: true,
  sortOrder: "",
  badgeLabel: "",
};

const emptyFeatureForm = {
  language: "en",
  text: "",
  sortOrder: 1,
  isIncluded: true,
};

const emptyTranslationForm = {
  language: "en",
  displayName: "",
  description: "",
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
};

const normalizePrice = (price) => ({
  id: price?.id ?? null,
  country: price?.country ?? price?.marketplace_country ?? "",
  currency: price?.currency ?? "",
  amount: price?.amount ?? "",
  compareAmount: price?.compareAmount ?? price?.compare_amount ?? "",
  isAvailable: price?.isAvailable ?? price?.is_available ?? true,
  updatedAt: price?.updatedAt ?? price?.updated_at ?? null,
});

const parseTranslations = (translations) => {
  if (!translations) return null;
  if (typeof translations === "object") return translations;

  try {
    return JSON.parse(translations);
  } catch (error) {
    return null;
  }
};

const getFeatureText = (feature, translation) =>
  translation?.text ||
  translation?.title ||
  translation?.description ||
  feature?.text ||
  feature?.featureText ||
  feature?.feature_text ||
  feature?.title ||
  feature?.description ||
  feature?.feature_key ||
  "";

const normalizeFeatures = (feature) => {
  const translations = parseTranslations(feature?.translations);
  const baseFeature = {
    id: feature?.id ?? null,
    language: feature?.language ?? feature?.lang ?? "en",
    text: getFeatureText(feature),
    sortOrder: feature?.sortOrder ?? feature?.sort_order ?? feature?.serial_no ?? 0,
    isIncluded: feature?.isIncluded ?? feature?.is_included ?? feature?.is_active ?? true,
    title: feature?.title ?? "",
    description: feature?.description ?? "",
    featureKey: feature?.featureKey ?? feature?.feature_key ?? "",
    translations,
  };

  if (!translations || Array.isArray(translations)) return [baseFeature];

  const translatedRows = Object.entries(translations).map(([language, translation]) => ({
    ...baseFeature,
    language,
    text: getFeatureText(feature, translation),
  }));

  return translatedRows.length > 0 ? translatedRows : [baseFeature];
};

const normalizeTranslation = (translation) => ({
  id: translation?.id ?? null,
  language: translation?.language ?? translation?.lang ?? "en",
  displayName:
    translation?.displayName ??
    translation?.display_name ??
    translation?.name ??
    "",
  description: translation?.description ?? "",
});

const normalizePlan = (plan) => ({
  id: plan?.id ?? plan?.planId ?? plan?.plan_id ?? "",
  code: plan?.code ?? "",
  name: plan?.name ?? plan?.displayName ?? plan?.display_name ?? "",
  durationDays: plan?.durationDays ?? plan?.duration_days ?? "",
  isTrial: plan?.isTrial ?? plan?.is_trial ?? false,
  isActive: plan?.isActive ?? plan?.is_active ?? true,
  sortOrder: plan?.sortOrder ?? plan?.sort_order ?? "",
  badgeLabel: plan?.badgeLabel ?? plan?.badge_label ?? "",
  prices: Array.isArray(plan?.prices) ? plan.prices.map(normalizePrice) : [],
  features: Array.isArray(plan?.features) ? plan.features.flatMap(normalizeFeatures) : [],
  translations: Array.isArray(plan?.translations)
    ? plan.translations.map(normalizeTranslation)
    : [],
});

const extractPlans = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.plans)) return payload.data.plans;
  if (Array.isArray(payload?.data?.rows)) return payload.data.rows;
  if (Array.isArray(payload?.data?.data?.plans)) return payload.data.data.plans;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.plans)) return payload.plans;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

const extractMutationData = (payload) => payload?.data?.data || payload?.data || payload || {};

const isTemporaryLocalId = (value) => String(value || "").startsWith("local-");

const getErrorMessage = (error, fallback) => {
  const status = error?.response?.status;
  if (status === 401) return "ERP session required. Please login again.";
  if (status === 403) return "You do not have ERP admin permission.";
  if (error?.code === "ECONNABORTED") {
    return "ERP request timed out. Please click Refresh or try again.";
  }
  return error?.response?.data?.message || error?.message || fallback;
};

const Badge = ({ active, children }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
      active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
    }`}
  >
    {children}
  </span>
);

const FieldLabel = ({ children }) => (
  <label className="mb-1 block text-sm font-semibold text-gray-700">{children}</label>
);

const inputClass =
  "h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]";

const SubscriptionPlanManagement = () => {
  const [activeTab, setActiveTab] = useState("prices");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [erpConnected, setErpConnected] = useState(hasErpSession());

  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState(emptyPlanForm);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const [selectedPricePlanId, setSelectedPricePlanId] = useState("");
  const [priceForm, setPriceForm] = useState(emptyPriceForm);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const [selectedFeaturePlanId, setSelectedFeaturePlanId] = useState("");
  const [featureForm, setFeatureForm] = useState(emptyFeatureForm);
  const [editingFeature, setEditingFeature] = useState(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

  const [selectedTranslationPlanId, setSelectedTranslationPlanId] = useState("");
  const [translationForm, setTranslationForm] = useState(emptyTranslationForm);
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
  const [editingTranslationId, setEditingTranslationId] = useState(null);
  const [confirmSaveType, setConfirmSaveType] = useState(null);

  const planOptions = useMemo(
    () =>
      plans.map((plan) => ({
        value: String(plan.id),
        label: `${plan.name || plan.code || "Plan"} (${plan.code || plan.id})`,
      })),
    [plans],
  );

  const selectedPricePlan = useMemo(
    () => plans.find((plan) => String(plan.id) === String(selectedPricePlanId)),
    [plans, selectedPricePlanId],
  );

  const selectedFeaturePlan = useMemo(
    () => plans.find((plan) => String(plan.id) === String(selectedFeaturePlanId)),
    [plans, selectedFeaturePlanId],
  );

  const selectedTranslationPlan = useMemo(
    () => plans.find((plan) => String(plan.id) === String(selectedTranslationPlanId)),
    [plans, selectedTranslationPlanId],
  );

  const priceRows = useMemo(
    () =>
      plans.flatMap((plan) =>
        plan.prices.map((price) => ({
          ...price,
          planId: plan.id,
          planName: plan.name,
          planCode: plan.code,
        })),
      ),
    [plans],
  );

  const featureRows = useMemo(
    () =>
      plans
        .flatMap((plan) =>
          plan.features.map((feature) => ({
            ...feature,
            planId: plan.id,
            planName: plan.name,
            planCode: plan.code,
          })),
        )
        .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)),
    [plans],
  );

  const upsertLocalPrice = (price) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) => {
        if (String(plan.id) !== String(selectedPricePlanId)) return plan;

        const hasMatchingPrice = plan.prices.some((item) =>
          editingPriceId
            ? String(item.id) === String(editingPriceId)
            : item.country === price.country && item.currency === price.currency,
        );

        return {
          ...plan,
          prices: hasMatchingPrice
            ? plan.prices.map((item) =>
                (editingPriceId
                  ? String(item.id) === String(editingPriceId)
                  : item.country === price.country && item.currency === price.currency)
                  ? price
                  : item,
              )
            : [...plan.prices, price],
        };
      }),
    );
  };

  const upsertLocalPlan = (planUpdate) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) =>
        String(plan.id) === String(editingPlanId)
          ? {
              ...plan,
              ...planUpdate,
            }
          : plan,
      ),
    );
  };

  const upsertLocalFeature = (feature) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) => {
        if (String(plan.id) !== String(selectedFeaturePlanId)) return plan;

        const hasMatchingFeature = plan.features.some((item) =>
          editingFeature?.id
            ? String(item.id) === String(editingFeature.id) && item.language === feature.language
            : item.language === feature.language && item.text === feature.text,
        );

        return {
          ...plan,
          features: hasMatchingFeature
            ? plan.features.map((item) =>
                (editingFeature?.id
                  ? String(item.id) === String(editingFeature.id) && item.language === feature.language
                  : item.language === feature.language && item.text === feature.text)
                  ? feature
                  : item,
              )
            : [...plan.features, feature],
        };
      }),
    );
  };

  const removeLocalFeature = (feature) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) => {
        if (String(plan.id) !== String(feature.planId)) return plan;
        return {
          ...plan,
          features: plan.features.filter((item) => String(item.id) !== String(feature.id)),
        };
      }),
    );
  };

  const upsertLocalTranslation = (translation) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) => {
        if (String(plan.id) !== String(selectedTranslationPlanId)) return plan;

        const hasMatchingTranslation = plan.translations.some((item) =>
          editingTranslationId
            ? String(item.id || `${plan.id}-${item.language}`) === String(editingTranslationId)
            : item.language === translation.language,
        );

        return {
          ...plan,
          translations: hasMatchingTranslation
            ? plan.translations.map((item) =>
                (editingTranslationId
                  ? String(item.id || `${plan.id}-${item.language}`) === String(editingTranslationId)
                  : item.language === translation.language)
                  ? translation
                  : item,
              )
            : [...plan.translations, translation],
        };
      }),
    );
  };

  const loadPlans = useCallback(async ({ showLoading = true, showTopError = true } = {}) => {
    if (!hasErpSession()) {
      setErpConnected(false);
      setError("ERP session required. Please login again.");
      setLoading(false);
      return;
    }

    setErpConnected(true);
    if (showLoading) setLoading(true);
    if (showTopError) setError("");

    try {
      const response = await erpApi.get("/pricing/admin/plans", { timeout: 60000 });
      const nextPlans = extractPlans(response.data || {}).map(normalizePlan);
      setPlans(nextPlans);
      setError("");

      const firstPlanId = nextPlans[0]?.id ? String(nextPlans[0].id) : "";
      setSelectedPricePlanId((current) => current || firstPlanId);
      setSelectedFeaturePlanId((current) => current || firstPlanId);
      setSelectedTranslationPlanId((current) => current || firstPlanId);
    } catch (fetchError) {
      const message = getErrorMessage(fetchError, "Failed to load subscription plans.");
      if (showTopError) setError(message);
      if (fetchError?.response?.status === 401) setErpConnected(false);
      toast.error(showTopError ? message : "Saved, but refreshing plan data took too long. Please click Refresh.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    if (!isTranslationModalOpen || !editingTranslationId || !selectedTranslationPlan) return;
    const existingTranslation = selectedTranslationPlan.translations.find(
      (translation) => translation.language === translationForm.language,
    );

    setTranslationForm((current) => ({
      ...current,
      displayName: existingTranslation?.displayName || "",
      description: existingTranslation?.description || "",
    }));
  }, [editingTranslationId, isTranslationModalOpen, selectedTranslationPlan, translationForm.language]);

  const resetPriceForm = () => {
    setPriceForm(emptyPriceForm);
    setEditingPriceId(null);
  };

  const resetPlanForm = () => {
    setPlanForm(emptyPlanForm);
    setEditingPlanId(null);
  };

  const resetFeatureForm = () => {
    setFeatureForm(emptyFeatureForm);
    setEditingFeature(null);
  };

  const closePriceModal = () => {
    setIsPriceModalOpen(false);
    resetPriceForm();
  };

  const closePlanModal = () => {
    setIsPlanModalOpen(false);
    resetPlanForm();
  };

  const closeFeatureModal = () => {
    setIsFeatureModalOpen(false);
    resetFeatureForm();
  };

  const closeTranslationModal = () => {
    setIsTranslationModalOpen(false);
    setTranslationForm(emptyTranslationForm);
    setEditingTranslationId(null);
  };

  const openPriceAddModal = () => {
    resetPriceForm();
    setSelectedPricePlanId((current) => current || planOptions[0]?.value || "");
    setIsPriceModalOpen(true);
  };

  const openFeatureAddModal = () => {
    resetFeatureForm();
    setSelectedFeaturePlanId((current) => current || planOptions[0]?.value || "");
    setIsFeatureModalOpen(true);
  };

  const openTranslationAddModal = () => {
    setTranslationForm(emptyTranslationForm);
    setEditingTranslationId(null);
    setSelectedTranslationPlanId((current) => current || planOptions[0]?.value || "");
    setIsTranslationModalOpen(true);
  };

  const handlePriceEdit = (row) => {
    setSelectedPricePlanId(String(row.planId));
    setEditingPriceId(row.id);
    setPriceForm({
      country: row.country || "MY",
      currency: row.currency || "MYR",
      amount: row.amount ?? "",
      compareAmount: row.compareAmount ?? "",
      isAvailable: Boolean(row.isAvailable),
    });
    setIsPriceModalOpen(true);
  };

  const handlePlanEdit = (plan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name || "",
      code: plan.code || "",
      durationDays: plan.durationDays ?? "",
      isTrial: Boolean(plan.isTrial),
      isActive: Boolean(plan.isActive),
      sortOrder: plan.sortOrder ?? "",
      badgeLabel: plan.badgeLabel || "",
    });
    setIsPlanModalOpen(true);
  };

  const validatePlanForm = () => {
    const durationDays = Number(planForm.durationDays);
    const sortOrder = Number(planForm.sortOrder);

    if (!editingPlanId) {
      toast.error("Please select a plan.");
      return false;
    }

    if (!planForm.code.trim()) {
      toast.error("Plan code is required.");
      return false;
    }

    if (!planForm.name.trim()) {
      toast.error("Plan name is required.");
      return false;
    }

    if (!Number.isFinite(durationDays) || durationDays < 0) {
      toast.error("Duration days must be 0 or greater.");
      return false;
    }

    if (!Number.isFinite(sortOrder) || sortOrder < 0) {
      toast.error("Sort order must be 0 or greater.");
      return false;
    }

    return true;
  };

  const requestPlanSave = (event) => {
    event.preventDefault();
    if (validatePlanForm()) setConfirmSaveType("plan");
  };

  const savePlan = async () => {
    const planUpdate = {
      code: planForm.code.trim(),
      name: planForm.name.trim(),
      durationDays: Number(planForm.durationDays),
      isTrial: planForm.isTrial,
      isActive: planForm.isActive,
      sortOrder: Number(planForm.sortOrder),
      badgeLabel: planForm.badgeLabel.trim(),
    };

    setSaving(true);
    try {
      await erpApi.put(`/pricing/admin/plans/${editingPlanId}`, planUpdate);
      upsertLocalPlan(planUpdate);
      toast.success("Plan updated successfully.");
      closePlanModal();
      setConfirmSaveType(null);
    } catch (saveError) {
      toast.error(getErrorMessage(saveError, "Failed to update plan."));
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureEdit = (row) => {
    setSelectedFeaturePlanId(String(row.planId));
    setEditingFeature(row);
    setFeatureForm({
      language: row.language || "en",
      text: row.text || "",
      sortOrder: row.sortOrder || 1,
      isIncluded: Boolean(row.isIncluded),
    });
    setIsFeatureModalOpen(true);
  };

  const handleTranslationEdit = (plan, translation) => {
    setSelectedTranslationPlanId(String(plan.id));
    setEditingTranslationId(translation.id || `${plan.id}-${translation.language}`);
    setTranslationForm({
      language: translation.language || "en",
      displayName: translation.displayName || "",
      description: translation.description || "",
    });
    setIsTranslationModalOpen(true);
  };

  const validatePriceForm = () => {
    const amount = toNumberOrNull(priceForm.amount);
    const compareAmount = toNumberOrNull(priceForm.compareAmount);

    if (!selectedPricePlanId) {
      toast.error("Please select a plan.");
      return false;
    }

    if (amount === null || amount < 0) {
      toast.error("Amount must be 0 or greater.");
      return false;
    }

    if (compareAmount !== null && compareAmount < 0) {
      toast.error("Compare amount must be 0 or greater.");
      return false;
    }

    return true;
  };

  const requestPriceSave = (event) => {
    event.preventDefault();
    if (validatePriceForm()) setConfirmSaveType("price");
  };

  const savePrice = async () => {
    const amount = toNumberOrNull(priceForm.amount);
    const compareAmount = toNumberOrNull(priceForm.compareAmount);

    setSaving(true);
    try {
      const response = await erpApi.post(`/pricing/admin/plans/${selectedPricePlanId}/prices`, {
        ...(editingPriceId && !isTemporaryLocalId(editingPriceId) ? { id: editingPriceId } : {}),
        country: priceForm.country,
        currency: priceForm.currency,
        amount,
        compareAmount,
        isAvailable: priceForm.isAvailable,
      });
      const savedPrice = normalizePrice({
        ...extractMutationData(response.data),
        id: extractMutationData(response.data)?.id || editingPriceId || `local-price-${Date.now()}`,
        country: priceForm.country,
        currency: priceForm.currency,
        amount,
        compareAmount,
        isAvailable: priceForm.isAvailable,
        updatedAt: new Date().toISOString(),
      });
      upsertLocalPrice(savedPrice);
      toast.success("Plan price saved successfully.");
      closePriceModal();
      setConfirmSaveType(null);
    } catch (saveError) {
      toast.error(getErrorMessage(saveError, "Failed to save plan price."));
    } finally {
      setSaving(false);
    }
  };

  const validateFeatureForm = () => {
    if (!selectedFeaturePlanId) {
      toast.error("Please select a plan.");
      return false;
    }

    if (!featureForm.text.trim()) {
      toast.error("Feature text is required.");
      return false;
    }

    return true;
  };

  const requestFeatureSave = (event) => {
    event.preventDefault();
    if (validateFeatureForm()) setConfirmSaveType("feature");
  };

  const saveFeature = async () => {
    const mergedTranslations = {
      ...(parseTranslations(editingFeature?.translations) || {}),
      [featureForm.language]: {
        ...(parseTranslations(editingFeature?.translations)?.[featureForm.language] || {}),
        title: featureForm.text.trim(),
      },
    };

    setSaving(true);
    try {
      const response = await erpApi.post(`/pricing/admin/plans/${selectedFeaturePlanId}/features`, {
        ...(editingFeature?.id && !isTemporaryLocalId(editingFeature.id) ? { id: editingFeature.id } : {}),
        ...(editingFeature?.featureKey ? { featureKey: editingFeature.featureKey } : {}),
        serialNo: Number(featureForm.sortOrder || 0),
        title: featureForm.text.trim(),
        description: editingFeature?.description || featureForm.text.trim(),
        translations: mergedTranslations,
        isActive: featureForm.isIncluded,
      });
      const mutationData = extractMutationData(response.data);
      upsertLocalFeature({
        id: mutationData?.id || editingFeature?.id || `local-feature-${Date.now()}`,
        language: featureForm.language,
        text: featureForm.text.trim(),
        sortOrder: Number(featureForm.sortOrder || 0),
        isIncluded: featureForm.isIncluded,
        title: featureForm.text.trim(),
        description: editingFeature?.description || featureForm.text.trim(),
        featureKey: mutationData?.featureKey || mutationData?.feature_key || editingFeature?.featureKey || "",
        translations: mergedTranslations,
      });
      toast.success("Plan feature saved successfully.");
      closeFeatureModal();
      setConfirmSaveType(null);
    } catch (saveError) {
      toast.error(getErrorMessage(saveError, "Failed to save plan feature."));
    } finally {
      setSaving(false);
    }
  };

  const deleteFeature = async (row) => {
    if (!row?.id || !row?.planId) return;
    const confirmed = window.confirm("Delete this plan feature?");
    if (!confirmed) return;

    if (isTemporaryLocalId(row.id)) {
      removeLocalFeature(row);
      toast.success("Plan feature deleted successfully.");
      return;
    }

    setSaving(true);
    try {
      await erpApi.delete(`/pricing/admin/plans/${row.planId}/features/${row.id}`);
      removeLocalFeature(row);
      toast.success("Plan feature deleted successfully.");
      if (editingFeature?.id === row.id) resetFeatureForm();
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, "Failed to delete plan feature."));
    } finally {
      setSaving(false);
    }
  };

  const validateTranslationForm = () => {
    if (!selectedTranslationPlanId) {
      toast.error("Please select a plan.");
      return false;
    }

    if (!translationForm.displayName.trim()) {
      toast.error("Display name is required.");
      return false;
    }

    return true;
  };

  const requestTranslationSave = (event) => {
    event.preventDefault();
    if (validateTranslationForm()) setConfirmSaveType("translation");
  };

  const saveTranslation = async () => {
    setSaving(true);
    try {
      const response = await erpApi.post(`/pricing/admin/plans/${selectedTranslationPlanId}/translations`, {
        language: translationForm.language,
        displayName: translationForm.displayName.trim(),
        description: translationForm.description.trim(),
      });
      const mutationData = extractMutationData(response.data);
      upsertLocalTranslation(
        normalizeTranslation({
          ...mutationData,
          id: mutationData?.id || editingTranslationId || `local-translation-${Date.now()}`,
          language: translationForm.language,
          displayName: translationForm.displayName.trim(),
          description: translationForm.description.trim(),
        }),
      );
      toast.success("Plan display text saved successfully.");
      closeTranslationModal();
      setConfirmSaveType(null);
    } catch (saveError) {
      toast.error(getErrorMessage(saveError, "Failed to save plan display text."));
    } finally {
      setSaving(false);
    }
  };

  const runConfirmedSave = async () => {
    if (confirmSaveType === "plan") {
      await savePlan();
      return;
    }
    if (confirmSaveType === "price") {
      await savePrice();
      return;
    }
    if (confirmSaveType === "feature") {
      await saveFeature();
      return;
    }
    if (confirmSaveType === "translation") {
      await saveTranslation();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-[#f7f9fb]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!erpConnected) {
    return (
      <div className="min-h-[420px] bg-[#f7f9fb] p-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-800">
          ERP session required. Please login again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plan Management</h1>
          <p className="text-sm text-gray-500">Manage ERP plan prices, features, and display text.</p>
        </div>
        <button
          type="button"
          onClick={() => loadPlans()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Plans</h2>
          <span className="text-sm text-gray-500">Total plans: {plans.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-700">
                <th className="px-4 py-3 font-semibold">Plan ID</th>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Duration days</th>
                <th className="px-4 py-3 font-semibold">Trial</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Sort order</th>
                <th className="px-4 py-3 font-semibold">Badge label</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No subscription plans found.
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id || plan.code} className="border-b last:border-b-0">
                    <td className="px-4 py-3">{formatValue(plan.id)}</td>
                    <td className="px-4 py-3 font-semibold text-[#004368]">{formatValue(plan.code)}</td>
                    <td className="px-4 py-3">{formatValue(plan.name)}</td>
                    <td className="px-4 py-3">{formatValue(plan.durationDays)}</td>
                    <td className="px-4 py-3">
                      <Badge active={Boolean(plan.isTrial)}>{plan.isTrial ? "Yes" : "No"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge active={Boolean(plan.isActive)}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{formatValue(plan.sortOrder)}</td>
                    <td className="px-4 py-3">{formatValue(plan.badgeLabel)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handlePlanEdit(plan)}
                        className="inline-flex h-9 items-center gap-1 rounded-md border border-blue-200 px-3 text-sm font-semibold text-[#004368] hover:bg-blue-50"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 rounded-full bg-gray-200 p-1">
        {TAB_OPTIONS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "bg-[#004368] text-white shadow"
                : "bg-transparent text-gray-700 hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "prices" && (
        <div className="space-y-5">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-bold text-gray-900">Plan Prices</h2>
              <button
                type="button"
                onClick={openPriceAddModal}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#004368] px-4 text-sm font-semibold text-white hover:bg-[#003653]"
              >
                <Plus size={16} />
                Add Plan Price
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-semibold">Plan name</th>
                    <th className="px-4 py-3 font-semibold">Plan code</th>
                    <th className="px-4 py-3 font-semibold">Country</th>
                    <th className="px-4 py-3 font-semibold">Currency</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Compare amount</th>
                    <th className="px-4 py-3 font-semibold">Available</th>
                    <th className="px-4 py-3 font-semibold">Updated date</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {priceRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        No plan prices found.
                      </td>
                    </tr>
                  ) : (
                    priceRows.map((row, index) => (
                      <tr key={`${row.planId}-${row.id || index}`} className="border-b last:border-b-0">
                        <td className="px-4 py-3">{formatValue(row.planName)}</td>
                        <td className="px-4 py-3">{formatValue(row.planCode)}</td>
                        <td className="px-4 py-3">{formatValue(row.country)}</td>
                        <td className="px-4 py-3">{formatValue(row.currency)}</td>
                        <td className="px-4 py-3">{formatValue(row.amount)}</td>
                        <td className="px-4 py-3">{formatValue(row.compareAmount)}</td>
                        <td className="px-4 py-3">
                          <Badge active={Boolean(row.isAvailable)}>
                            {row.isAvailable ? "Yes" : "No"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{formatDate(row.updatedAt)}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handlePriceEdit(row)}
                            className="inline-flex h-9 items-center gap-1 rounded-md border border-blue-200 px-3 text-sm font-semibold text-[#004368] hover:bg-blue-50"
                          >
                            <Edit3 size={15} />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "features" && (
        <div className="space-y-5">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-bold text-gray-900">Plan Features</h2>
              <button
                type="button"
                onClick={openFeatureAddModal}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#004368] px-4 text-sm font-semibold text-white hover:bg-[#003653]"
              >
                <Plus size={16} />
                Add Plan Feature
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-semibold">Plan name</th>
                    <th className="px-4 py-3 font-semibold">Language</th>
                    <th className="px-4 py-3 font-semibold">Feature text</th>
                    <th className="px-4 py-3 font-semibold">Sort order</th>
                    <th className="px-4 py-3 font-semibold">Included</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {featureRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No plan features found.
                      </td>
                    </tr>
                  ) : (
                    featureRows.map((row, index) => (
                      <tr
                        key={`${row.planId}-${row.id || index}-${row.language}`}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-4 py-3">{formatValue(row.planName)}</td>
                        <td className="px-4 py-3">{formatValue(row.language)}</td>
                        <td className="max-w-[520px] px-4 py-3">{formatValue(row.text)}</td>
                        <td className="px-4 py-3">{formatValue(row.sortOrder)}</td>
                        <td className="px-4 py-3">
                          <Badge active={Boolean(row.isIncluded)}>
                            {row.isIncluded ? "Yes" : "No"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleFeatureEdit(row)}
                              className="inline-flex h-9 items-center gap-1 rounded-md border border-blue-200 px-3 text-sm font-semibold text-[#004368] hover:bg-blue-50"
                            >
                              <Edit3 size={15} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteFeature(row)}
                              disabled={saving}
                              className="inline-flex h-9 items-center gap-1 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "translations" && (
        <div className="space-y-5">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-bold text-gray-900">Existing Translations</h2>
              <button
                type="button"
                onClick={openTranslationAddModal}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#004368] px-4 text-sm font-semibold text-white hover:bg-[#003653]"
              >
                <Plus size={16} />
                Add Plan Translation
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-semibold">Plan name</th>
                    <th className="px-4 py-3 font-semibold">Plan code</th>
                    <th className="px-4 py-3 font-semibold">Language</th>
                    <th className="px-4 py-3 font-semibold">Display name</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.flatMap((plan) => plan.translations).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No plan translations found.
                      </td>
                    </tr>
                  ) : (
                    plans.flatMap((plan) =>
                      plan.translations.map((translation, index) => (
                        <tr
                          key={`${plan.id}-${translation.id || translation.language || index}`}
                          className="border-b last:border-b-0"
                        >
                          <td className="px-4 py-3">{formatValue(plan.name)}</td>
                          <td className="px-4 py-3">{formatValue(plan.code)}</td>
                          <td className="px-4 py-3">{formatValue(translation.language)}</td>
                          <td className="px-4 py-3">{formatValue(translation.displayName)}</td>
                          <td className="max-w-[560px] px-4 py-3">{formatValue(translation.description)}</td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleTranslationEdit(plan, translation)}
                              className="inline-flex h-9 items-center gap-1 rounded-md border border-blue-200 px-3 text-sm font-semibold text-[#004368] hover:bg-blue-50"
                            >
                              <Edit3 size={15} />
                              Edit
                            </button>
                          </td>
                        </tr>
                      )),
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={requestPlanSave}
            className="w-full max-w-3xl rounded-lg bg-white p-5 text-left shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Subscription Plan</h2>
              <button
                type="button"
                onClick={closePlanModal}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>Code</FieldLabel>
                <input
                  className={`${inputClass} bg-gray-50 text-gray-500`}
                  readOnly
                  value={planForm.code}
                />
              </div>
              <div>
                <FieldLabel>Name</FieldLabel>
                <input
                  className={inputClass}
                  value={planForm.name}
                  onChange={(event) =>
                    setPlanForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </div>
              <div>
                <FieldLabel>Duration days</FieldLabel>
                <input
                  className={inputClass}
                  min="0"
                  type="number"
                  value={planForm.durationDays}
                  onChange={(event) =>
                    setPlanForm((current) => ({ ...current, durationDays: event.target.value }))
                  }
                />
              </div>
              <div>
                <FieldLabel>Sort order</FieldLabel>
                <input
                  className={inputClass}
                  min="0"
                  type="number"
                  value={planForm.sortOrder}
                  onChange={(event) =>
                    setPlanForm((current) => ({ ...current, sortOrder: event.target.value }))
                  }
                />
              </div>
              <div>
                <FieldLabel>Badge label</FieldLabel>
                <input
                  className={inputClass}
                  value={planForm.badgeLabel}
                  onChange={(event) =>
                    setPlanForm((current) => ({ ...current, badgeLabel: event.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex h-11 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={planForm.isTrial}
                    onChange={(event) =>
                      setPlanForm((current) => ({ ...current, isTrial: event.target.checked }))
                    }
                  />
                  Trial
                </label>
                <label className="flex h-11 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={planForm.isActive}
                    onChange={(event) =>
                      setPlanForm((current) => ({ ...current, isActive: event.target.checked }))
                    }
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closePlanModal}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-[#004368] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={requestPriceSave}
            className="w-full max-w-4xl rounded-lg bg-white p-5 text-left shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPriceId ? "Edit Plan Price" : "Add Plan Price"}
              </h2>
              <button
                type="button"
                onClick={closePriceModal}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <FieldLabel>Plan</FieldLabel>
                <select
                  className={inputClass}
                  value={selectedPricePlanId}
                  onChange={(event) => setSelectedPricePlanId(event.target.value)}
                >
                  {planOptions.map((plan) => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Country</FieldLabel>
                <select
                  className={inputClass}
                  value={priceForm.country}
                  onChange={(event) =>
                    setPriceForm((current) => ({ ...current, country: event.target.value }))
                  }
                >
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Currency</FieldLabel>
                <select
                  className={inputClass}
                  value={priceForm.currency}
                  onChange={(event) =>
                    setPriceForm((current) => ({ ...current, currency: event.target.value }))
                  }
                >
                  {CURRENCY_OPTIONS.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Amount</FieldLabel>
                <input
                  className={inputClass}
                  min="0"
                  step="0.01"
                  type="number"
                  value={priceForm.amount}
                  onChange={(event) =>
                    setPriceForm((current) => ({ ...current, amount: event.target.value }))
                  }
                />
              </div>
              <div>
                <FieldLabel>Compare amount</FieldLabel>
                <input
                  className={inputClass}
                  min="0"
                  step="0.01"
                  type="number"
                  value={priceForm.compareAmount}
                  onChange={(event) =>
                    setPriceForm((current) => ({ ...current, compareAmount: event.target.value }))
                  }
                />
              </div>
              <div className="flex items-end">
                <label className="flex h-11 w-full items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={priceForm.isAvailable}
                    onChange={(event) =>
                      setPriceForm((current) => ({ ...current, isAvailable: event.target.checked }))
                    }
                  />
                  Available
                </label>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closePriceModal}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saving || !selectedPricePlan}
                className="inline-flex items-center gap-2 rounded-md bg-[#004368] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {isFeatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={requestFeatureSave}
            className="w-full max-w-4xl rounded-lg bg-white p-5 text-left shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingFeature ? "Edit Plan Feature" : "Add Plan Feature"}
              </h2>
              <button
                type="button"
                onClick={closeFeatureModal}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <FieldLabel>Plan</FieldLabel>
                <select
                  className={inputClass}
                  value={selectedFeaturePlanId}
                  onChange={(event) => setSelectedFeaturePlanId(event.target.value)}
                >
                  {planOptions.map((plan) => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Language</FieldLabel>
                <select
                  className={inputClass}
                  value={featureForm.language}
                  onChange={(event) =>
                    setFeatureForm((current) => ({ ...current, language: event.target.value }))
                  }
                >
                  {LANGUAGE_OPTIONS.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Sort order</FieldLabel>
                <input
                  className={inputClass}
                  type="number"
                  value={featureForm.sortOrder}
                  onChange={(event) =>
                    setFeatureForm((current) => ({ ...current, sortOrder: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2 xl:col-span-3">
                <FieldLabel>Feature text</FieldLabel>
                <textarea
                  className="min-h-[110px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]"
                  value={featureForm.text}
                  onChange={(event) =>
                    setFeatureForm((current) => ({ ...current, text: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="flex h-11 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={featureForm.isIncluded}
                    onChange={(event) =>
                      setFeatureForm((current) => ({ ...current, isIncluded: event.target.checked }))
                    }
                  />
                  Included
                </label>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeFeatureModal}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saving || !selectedFeaturePlan}
                className="inline-flex items-center gap-2 rounded-md bg-[#004368] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {isTranslationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={requestTranslationSave}
            className="w-full max-w-4xl rounded-lg bg-white p-5 text-left shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTranslationId ? "Edit Plan Translation" : "Add Plan Translation"}
              </h2>
              <button
                type="button"
                onClick={closeTranslationModal}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>Plan</FieldLabel>
                <select
                  className={inputClass}
                  value={selectedTranslationPlanId}
                  onChange={(event) => setSelectedTranslationPlanId(event.target.value)}
                >
                  {planOptions.map((plan) => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Language</FieldLabel>
                <select
                  className={inputClass}
                  value={translationForm.language}
                  onChange={(event) =>
                    setTranslationForm((current) => ({ ...current, language: event.target.value }))
                  }
                >
                  {LANGUAGE_OPTIONS.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Display name</FieldLabel>
                <input
                  className={inputClass}
                  value={translationForm.displayName}
                  onChange={(event) =>
                    setTranslationForm((current) => ({ ...current, displayName: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <textarea
                  className="min-h-[110px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]"
                  value={translationForm.description}
                  onChange={(event) =>
                    setTranslationForm((current) => ({ ...current, description: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeTranslationModal}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saving || !selectedTranslationPlan}
                className="inline-flex items-center gap-2 rounded-md bg-[#004368] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmSaveType && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 text-left shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">Confirm Save</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to save this{" "}
              {confirmSaveType === "price"
                ? "plan price"
                : confirmSaveType === "feature"
                  ? "plan feature"
                  : confirmSaveType === "plan"
                    ? "subscription plan"
                    : "plan translation"}
              ?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmSaveType(null)}
                disabled={saving}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Close
              </button>
              <button
                type="button"
                onClick={runConfirmedSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-[#004368] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlanManagement;
