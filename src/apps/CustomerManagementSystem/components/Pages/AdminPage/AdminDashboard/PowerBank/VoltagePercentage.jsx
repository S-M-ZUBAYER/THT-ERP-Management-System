import React, { useState } from 'react';
import PowerBankModels from './PowerbankModel';
import VoltageDetails from './VoltageDetails';

const VoltagePercentage = () => {
    const [currentServer, setCurrentServer] = useState("Global");
    const [baseUrl, setBaseUrl] = useState("https://grozziieget.zjweiting.com:8033");
    const allUrls = [
        {
            id: 1,
            serverName: "Global",
            url: "https://grozziieget.zjweiting.com:8033"
        },
        {
            id: 2,
            serverName: "China",
            url: "https://jiapuv.com:8033"
        }
    ]

    return (
        <div className="pt-5 bg-gray-100 " >
            {/* Server Selected Tabs */}
            <div className="flex justify-center items-center mb-6 mt-3">
                <div className="p-1 bg-slate-300 rounded-full">
                    {allUrls.map((server, index) => (
                        <button
                            key={index}
                            onClick={() => setBaseUrl(server.url)}
                            className={`px-16 py-1 rounded-full text-xl ${server.url === baseUrl
                                ? "bg-[#004368] text-white font-bold"
                                : "text-gray-500 font-semibold"
                                }`}
                        >
                            {server.serverName}
                        </button>
                    ))}
                </div>
            </div>

            <PowerBankModels
                baseUrl={baseUrl}
                setBaseUrl={setBaseUrl}
                currentServer={currentServer}
                setCurrentServer={setCurrentServer}
            ></PowerBankModels>
            <VoltageDetails
                baseUrl={baseUrl}
                setBaseUrl={setBaseUrl}
                currentServer={currentServer}
                setCurrentServer={setCurrentServer}
            ></VoltageDetails>
        </div>
    );
};

export default VoltagePercentage;