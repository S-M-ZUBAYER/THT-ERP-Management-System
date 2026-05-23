import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { label: "Translator", path: "/translator" },
  { label: "Chatbot Management", path: "/translator/chatbot-management" },
];

export default function TranslatorModeTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8">
      {tabs.map((tab) => {
        const isActive =
          tab.path === "/translator"
            ? location.pathname === "/translator" ||
              location.pathname === "/translator/"
            : location.pathname.startsWith(tab.path);

        return (
          <button
            key={tab.path}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`px-5 py-2 rounded-md border text-sm font-semibold transition ${
              isActive
                ? "bg-[#004368] border-[#004368] text-white shadow-sm"
                : "bg-white border-gray-300 text-[#272727] hover:border-[#004368] hover:text-[#004368]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
