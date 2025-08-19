import React, { useEffect, useState } from 'react';
import axios from 'axios';

const countryOptions = [
    { code: "zh-CN", label: "中文" },
    { code: "en-US", label: "English" },
    { code: "th-TH", label: "ไทย" },
    { code: "fil-PH", label: "Philippines" },
    { code: "vi-VN", label: "Tiếng Việt" },
    { code: "ms-MY", label: "Malaysia" },
    { code: "id-ID", label: "Indonesia" },
    { code: "ja-JP", label: "日本語" },
];

const SupportLinkManagement = () => {
    const [formData, setFormData] = useState({
        countryCode: '',
        getStartedLink: '',
        businessCooperationLink: '',
        helpCenterLink: '',
        feedbackLink: ''
    });
    const [links, setLinks] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);

    const apiBase = 'https://grozziieget.zjweiting.com:8033/tht';

    const fetchLinks = async () => {
        try {
            const res = await axios.get(`${apiBase}/supportLink`);
            setLinks(res.data.result);
        } catch (err) {
            console.error("Error fetching support links", err);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData.countryCode) return alert("Please select a country");

            const endpoint = isUpdate
                ? `${apiBase}/supportLink/update/${formData.countryCode}`
                : `${apiBase}/supportLink/create`;

            const method = isUpdate ? axios.put : axios.post;
            await method(endpoint, formData);

            fetchLinks();
            setFormData({
                countryCode: '',
                getStartedLink: '',
                businessCooperationLink: '',
                helpCenterLink: '',
                feedbackLink: ''
            });
            setIsUpdate(false);
        } catch (err) {
            console.error("Error submitting form", err);
        }
    };

    const handleEdit = (item) => {
        setFormData(item);
        setIsUpdate(true);
    };

    const handleDelete = async (code) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await axios.delete(`${apiBase}/supportLink/delete/${code}`);
            fetchLinks();
        } catch (err) {
            console.error("Error deleting support link", err);
        }
    };

    return (
        <div className="p-6 max-w-8xl mx-auto border shadow-md">
            <h2 className="mb-10 text-3xl font-bold text-[#004368] my-5">Support Link Manager</h2>
            <div className="border p-4 shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block mb-1 font-semibold">Select Country</label>
                        <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="w-full border p-2 rounded bg-white"
                        >
                            <option value="">Select Country</option>
                            {countryOptions.map(opt => (
                                <option key={opt.code} value={opt.code}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Get Started Link</label>
                        <input
                            type="text"
                            name="getStartedLink"
                            value={formData.getStartedLink}
                            onChange={handleChange}
                            className="w-full border p-2 rounded bg-white"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Business Cooperation Link</label>
                        <input
                            type="text"
                            name="businessCooperationLink"
                            value={formData.businessCooperationLink}
                            onChange={handleChange}
                            className="w-full border p-2 rounded bg-white"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Help Center Link</label>
                        <input
                            type="text"
                            name="helpCenterLink"
                            value={formData.helpCenterLink}
                            onChange={handleChange}
                            className="w-full border p-2 rounded bg-white"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Feedback Link</label>
                        <input
                            type="text"
                            name="feedbackLink"
                            value={formData.feedbackLink}
                            onChange={handleChange}
                            className="w-full border p-2 rounded bg-white"
                        />
                    </div>
                </div>

                <button
                    className="bg-[#004368]  hover:bg-blue-700 text-white font-bold py-2 px-20 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleSubmit}
                >
                    {isUpdate ? 'Update' : 'Add New Support Links'}
                </button>
            </div>


            <h3 className="mb-10 mt-16 text-3xl font-bold text-[#004368] my-5">Support Links List</h3>
            <div className="overflow-auto">
                <table className="min-w-full text-sm border">
                    <thead className="bg-gray-200 text-left">
                        <tr>
                            <th className="p-2 border">Country</th>
                            <th className="p-2 border">Get Started</th>
                            <th className="p-2 border">Business Cooperation</th>
                            <th className="p-2 border">Help Center</th>
                            <th className="p-2 border">Feedback</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {links.map(link => (
                            <tr key={link.countryCode} className="border-t">
                                <td className="p-2 border">{link.countryCode}</td>
                                <td className="p-2 border truncate max-w-xs">{link.getStartedLink}</td>
                                <td className="p-2 border truncate max-w-xs">{link.businessCooperationLink}</td>
                                <td className="p-2 border truncate max-w-xs">{link.helpCenterLink}</td>
                                <td className="p-2 border truncate max-w-xs">{link.feedbackLink}</td>
                                <td className="p-2 border space-x-2">
                                    <button
                                        onClick={() => handleEdit(link)}
                                        className="bg-green-500 hover:bg-blue-700 text-white font-semibold md:font-bold py-1 mb-1 md:mb:0 px-2 md:px-4 mr-2 rounded-tl-lg rounded-br-lg"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(link.countryCode)}
                                        className="bg-yellow-500 hover:bg-red-700 text-white font-semibold md:font-bold py-1 px-2 md:px-4 rounded-tl-lg rounded-br-lg"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {links.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center p-4">No records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupportLinkManagement;
