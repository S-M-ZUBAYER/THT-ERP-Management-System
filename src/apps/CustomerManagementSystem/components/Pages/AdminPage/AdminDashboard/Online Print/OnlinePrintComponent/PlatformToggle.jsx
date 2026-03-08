import React from "react";

const PlatformToggle = ({ platform, isActive, onClick, loading, label }) => {
    return (
        <button
            onClick={() => !loading && onClick(platform)}
            disabled={loading}
            className={`px-10 py-2 rounded-full text-lg transition-all duration-200 flex items-center gap-2
        ${isActive
                    ? "bg-[#004368] text-white font-bold shadow"
                    : "text-gray-600 font-semibold hover:bg-slate-300"
                }
        ${loading ? "opacity-60 cursor-not-allowed" : ""}
      `}
        >
            {label}
            {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
        </button>
    );
};

export default PlatformToggle;