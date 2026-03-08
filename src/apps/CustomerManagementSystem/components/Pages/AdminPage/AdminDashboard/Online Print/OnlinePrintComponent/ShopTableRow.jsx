import React from "react";
import { getShopFields } from "../OnlinePrintUtils/shopHelpers";

const ShopTableRow = ({ shop, platform }) => {
    const { email, key, country } = getShopFields(shop, platform);
    const isActive = shop.active === 1;

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium">{shop.id}</td>
            <td className="px-4 py-3 font-semibold text-gray-800">{email}</td>
            <td className="px-4 py-3">{country || "N/A"}</td>
            <td className="px-4 py-3">
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded block max-w-xs truncate">
                    {key || "N/A"}
                </span>
            </td>
            <td className="px-4 py-3">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    {isActive ? "Active" : "Inactive"}
                </span>
            </td>
            <td className="px-4 py-3 text-gray-500">
                {new Date(shop.createdAt).toLocaleDateString()}
            </td>
        </tr>
    );
};

export default ShopTableRow;