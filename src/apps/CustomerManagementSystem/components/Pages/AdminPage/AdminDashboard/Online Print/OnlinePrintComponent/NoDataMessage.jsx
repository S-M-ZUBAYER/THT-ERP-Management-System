import React from "react";

const NoDataMessage = ({ platform }) => (
    <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No {platform.toUpperCase()} Shops Found</h3>
        <p className="text-gray-500">No shops are registered on {platform.toUpperCase()} platform yet.</p>
    </div>
);

export default NoDataMessage;