import React from "react";
import ShopTableRow from "./ShopTableRow";

const ShopTable = ({ shops, platform }) => {
    return (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b">
                    <tr className="text-left text-gray-600">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Country</th>
                        <th className="px-4 py-3">API Key/Shop Id</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Created</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {shops.map((shop) => (
                        <ShopTableRow key={shop.id} shop={shop} platform={platform} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShopTable;