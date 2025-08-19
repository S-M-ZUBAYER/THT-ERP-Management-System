import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DisplaySpinner from '../../Shared/Loading/DisplaySpinner';
import toast from 'react-hot-toast';

const UserBaseBitmap = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [bitmapState, setBitmapState] = useState(false);
    const [loading, setLoading] = useState(true);
    const [eventProducts, setEventProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewedUserIds, setViewedUserIds] = useState(() => {
        const stored = localStorage.getItem("viewedBitmapUserIds");
        return stored ? JSON.parse(stored) : [];
    });
    const [page, setPage] = useState(() =>
        parseInt(localStorage.getItem("userTablePage"), 10) || 0
    );
    const [totalPages, setTotalPages] = useState(0);
    const [selectedTabId, setSelectedTabId] = useState(() =>
        parseInt(localStorage.getItem("userTableSelectedTabId"), 10) || 1
    );
    const [bitMapBaseUrl, setBitMapBaseUrl] = useState("");

    const navigate = useNavigate();

    const allBitMapUrls = [
        {
            id: 1,
            serverName: "All Users",
            baseUrl: "https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/page/lastSignIn/desc"
        },
        {
            id: 2,
            serverName: "Bitmap Users",
            baseUrl: "https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/flag/user"
        }
    ];

    // Update base URL when tab or page changes
    useEffect(() => {
        const selectedTab = allBitMapUrls.find(tab => tab.id === selectedTabId);
        if (selectedTab) {
            const newUrl = `${selectedTab.baseUrl}?page=${page}&size=10`;
            setBitMapBaseUrl(newUrl);
        }
    }, [page, selectedTabId]);

    const handleServerTabClick = (id) => {
        setSelectedTabId(id);
        setPage(0);
        localStorage.setItem("userTableSelectedTabId", id);
        localStorage.setItem("userTablePage", "0");
    };

    useEffect(() => {
        const fetchEventProducts = async () => {
            try {
                const response = await fetch(`https://grozziieget.zjweiting.com:8033/tht/eventProducts`);
                const data = await response.json();
                const uniqueModels = new Set();
                const filtered = data.filter(item =>
                    item.slideImageMark && item.slideImageMark !== "A9999" &&
                    !uniqueModels.has(item.modelNumber) &&
                    uniqueModels.add(item.modelNumber)
                );
                filtered.sort((a, b) => a.modelNumber.localeCompare(b.modelNumber));
                setEventProducts(filtered);
            } catch (err) {
                console.error("Fetch event products failed:", err.message);
            }
        };
        fetchEventProducts();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const baseUrl = allBitMapUrls.find(tab => tab.id === selectedTabId)?.baseUrl;
                const url = searchTerm
                    ? `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/search/${searchTerm}`
                    : `${baseUrl}?page=${page}&size=10`;

                const res = await fetch(url);
                const contentType = res.headers.get("Content-Type");

                if (!res.ok || !contentType?.includes("application/json")) {
                    const text = await res.text();
                    throw new Error(`Unexpected response: ${text}`);
                }

                const data = await res.json();

                setUsers(searchTerm ? data : data?.content || []);
                setTotalPages(searchTerm ? 1 : data?.totalPages || 0);

            } catch (err) {
                console.error("Fetch users failed:", err.message);
                setUsers([]); // fallback to empty array
            } finally {
                setLoading(false);
            }
        };

        localStorage.setItem("userTablePage", page.toString());
        fetchUsers();
    }, [page, searchTerm, selectedTabId]);


    const openModal = (user) => {
        setSelectedUser(user);
        setBitmapState(user?.addressType || false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleUpdate = async () => {
        if (!selectedUser) return;
        try {
            const res = await fetch(
                `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/device/bitmap/flag/${selectedUser.userId}/${bitmapState}`,
                { method: 'PUT', headers: { 'Content-Type': 'application/json' } }
            );
            if (!res.ok) throw new Error('Failed to update user');
            toast.success('User updated successfully');
            setUsers(prev =>
                prev.map(user =>
                    user.userId === selectedUser.userId ? { ...user, addressType: bitmapState } : user
                )
            );
        } catch (err) {
            toast.error(err.message);
        } finally {
            closeModal();
        }
    };

    const handleShowBitmap = (userId) => {
        const viewed = [...viewedUserIds];
        if (!viewed.includes(userId)) {
            viewed.push(userId);
            localStorage.setItem("viewedBitmapUserIds", JSON.stringify(viewed));
            setViewedUserIds(viewed);
        }
        navigate(`/admin/userBaseBitmap/showBitmap/${userId}`);
    };
    console.log(loading);

    return (
        <div className="p-6 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-center flex-1 text-3xl font-bold text-[#004368] my-5">User Base Bitmap</h2>
            </div>

            {/* Server Selected Tabs */}
            <div className="flex justify-center items-center mb-6 mt-3">
                <div className="p-1 bg-slate-300 rounded-full">
                    {allBitMapUrls.map((server) => (
                        <button
                            key={server.id}
                            onClick={() => handleServerTabClick(server.id)}
                            className={`px-16 py-1 rounded-full text-xl ${server.id === selectedTabId
                                ? "bg-[#004368] text-white font-bold"
                                : "text-gray-500 font-semibold"
                                }`}
                        >
                            {server.serverName}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full px-2 text-right mb-3">
                <input
                    type="text"
                    placeholder="Search by name or country"
                    // onChange={handleSearch}
                    onChange={(e) => setSearchTerm(e.target.value.trim())}
                    className="ml-auto border px-3 py-1 rounded text-black bg-white"
                />
            </div>

            <div className="overflow-auto">
                <table className="w-full text-left border-collapse rounded-lg shadow-md overflow-hidden">
                    <thead>
                        <tr className="bg-slate-300 text-slate-500 text-sm uppercase">
                            <th className="p-3 border">Serial</th>
                            <th className="p-3 border">User Id</th>
                            <th className="p-3 border w-24">User Name</th>
                            <th className="p-3 border">Country</th>
                            <th className="p-3 border">Device Type</th>
                            <th className="p-3 border">Printer Name</th>
                            <th className="p-3 border">Printer Model</th>
                            <th className="p-3 border">Log In Date</th>
                            <th className="p-3 border text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="text-center p-3">
                                    <DisplaySpinner />
                                </td>
                            </tr>
                        ) : users?.length > 0 ? (
                            users?.map((user, index) => {
                                const product = user.printerModel !== "9999" ? eventProducts.find(p => p.slideImageMark === user.printerModel) : null;
                                return (
                                    <tr key={user.userId} className="hover:bg-blue-200 text-black">
                                        <td className="p-3 border">{page * 10 + index + 1}</td>
                                        <td className="p-3 border">{user.userId}</td>
                                        <td className="p-3 border">{user.userName}</td>
                                        <td className="p-3 border">{user.country}</td>
                                        <td className="p-3 border">{user.deviceType}</td>
                                        <td className="p-3 border">{product?.productName || ""}</td>
                                        <td className="p-3 border">{product?.modelNumber || ""}</td>
                                        <td className="p-3 border">{user.lastSignIn?.split("T")[0]}</td>
                                        <td className="p-3 border space-x-2 text-center">
                                            <button onClick={() => openModal(user)} className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded">Update</button>
                                            <button
                                                onClick={() => handleShowBitmap(user.userId)}
                                                className={`py-1 px-3 rounded text-white ${viewedUserIds.includes(user.userId)
                                                    ? "bg-gray-400 hover:bg-gray-500" // Already viewed
                                                    : "bg-[#004368] hover:bg-blue-600" // Not yet viewed
                                                    }`}
                                            >
                                                Show Bitmap
                                            </button>

                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center p-3">No Data</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {!searchTerm && !loading && (
                <div className="flex justify-center mt-4 space-x-2">
                    <button
                        onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
                    >
                        Previous
                    </button>
                    <span className="p-2">Page {page + 1} of {totalPages}</span>
                    {/* <button
                            onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={page === totalPages - 1}
                            className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
                        >
                            Next
                        </button> */}
                    <button
                        onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={page >= totalPages - 1}
                        className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
                    >
                        Next
                    </button>

                </div>
            )}

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-black w-96">
                        <h3 className="text-xl font-semibold mb-2">Update {selectedUser.userName} Bitmap Status To Save</h3>
                        <h3 className="text-lg font-semibold mb-4">User Id: {selectedUser.userId}</h3>
                        <label className="block mb-2">
                            Bitmap State:
                            <select
                                value={bitmapState?.toString()} // convert boolean to string for select value
                                onChange={(e) => setBitmapState(e.target.value === 'true')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded bg-white"
                            >
                                <option value="false">False</option>
                                <option value="true">True</option>
                            </select>
                        </label>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Update</button>
                            <button onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserBaseBitmap;
