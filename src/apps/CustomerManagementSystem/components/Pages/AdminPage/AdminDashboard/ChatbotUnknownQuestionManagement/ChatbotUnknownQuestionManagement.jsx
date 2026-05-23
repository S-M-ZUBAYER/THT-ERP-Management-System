import { useState } from "react";
import AddQADraftPanel from "./AddQADraftPanel";
import AvailableQAPanel from "./AvailableQAPanel";
import QuestionsListPanel from "./QuestionsListPanel";

const hasChatBotManagementAccess = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return (
      user?.chatBotManagement === true ||
      user?.chatBotManagement === 1 ||
      user?.chatBotManagement === "1" ||
      user?.chatBotManagement === "true"
    );
  } catch {
    return false;
  }
};

const ChatbotUnknownQuestionManagement = ({ allowDelete = true }) => {
  const [activeTab, setActiveTab] = useState("questions");
  const [canUseQATools] = useState(hasChatBotManagementAccess);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#004368] mb-6">
        Unknown Questions Management
      </h1>

      <TabSwitcher
        activeTab={activeTab}
        canUseQATools={canUseQATools}
        onTabChange={setActiveTab}
      />

      {activeTab === "questions" ? (
        <QuestionsListPanel allowDelete={allowDelete} />
      ) : activeTab === "available" ? (
        <AvailableQAPanel />
      ) : (
        <AddQADraftPanel />
      )}
    </div>
  );
};

const TabSwitcher = ({ activeTab, canUseQATools, onTabChange }) => (
  <div className="mb-6 inline-flex rounded-full bg-slate-200 p-1">
    <button
      className={`min-w-44 rounded-full px-8 py-3 text-base font-semibold transition-colors ${
        activeTab === "questions"
          ? "bg-[#004368] text-white shadow"
          : "text-slate-600 hover:text-[#004368]"
      }`}
      onClick={() => onTabChange("questions")}
    >
      Questions List
    </button>
    <button
      className={`min-w-44 rounded-full px-8 py-3 text-base font-semibold transition-colors ${
        activeTab === "add"
          ? "bg-[#004368] text-white shadow"
          : canUseQATools
          ? "text-slate-600 hover:text-[#004368]"
          : "cursor-not-allowed text-slate-400 opacity-70"
      }`}
      disabled={!canUseQATools}
      title={!canUseQATools ? "Need ChatBot Management permission" : undefined}
      onClick={() => canUseQATools && onTabChange("add")}
    >
      Add Q&A
    </button>
    <button
      className={`min-w-44 rounded-full px-8 py-3 text-base font-semibold transition-colors ${
        activeTab === "available"
          ? "bg-[#004368] text-white shadow"
          : canUseQATools
          ? "text-slate-600 hover:text-[#004368]"
          : "cursor-not-allowed text-slate-400 opacity-70"
      }`}
      disabled={!canUseQATools}
      title={!canUseQATools ? "Need ChatBot Management permission" : undefined}
      onClick={() => canUseQATools && onTabChange("available")}
    >
      Available Q&A
    </button>
  </div>
);

export default ChatbotUnknownQuestionManagement;
