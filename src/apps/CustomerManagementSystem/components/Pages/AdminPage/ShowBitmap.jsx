import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BitmapGallery from './BitmapGallery';
import DisplaySpinner from '../../Shared/Loading/DisplaySpinner';

const ShowBitmap = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [userBitmaps, setUserBitmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [userResponse, bitmapResponse] = await Promise.all([
                fetch(`https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/${userId}`),
                fetch(`https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/device/bitmap/${userId}`)
            ]);

            if (!userResponse?.ok) throw new Error('Failed to fetch user details');
            if (!bitmapResponse?.ok) throw new Error('Failed to fetch bitmap images');

            const userData = await userResponse?.json();
            const bitmapData = await bitmapResponse?.json();

            setUserDetails(userData);
            setUserBitmaps(bitmapData);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    if (loading) {
        return (
            // <div className="flex items-center justify-center h-screen text-slate-500 text-xl font-semibold">
            //     Loading user data...
            // </div>
            <DisplaySpinner></DisplaySpinner>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-600 text-lg font-medium">
                <p>Error: {error}</p>
                <button
                    onClick={fetchUserData}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!userDetails) {
        return (
            <div className="flex items-center justify-center h-screen text-slate-500 text-lg">
                No user details found.
            </div>
        );
    }


    return (
        <div className="p-6 min-h-screen bg-gray-50 text-slate-600 relative">

            <h2 className="text-3xl font-bold mb-6 text-center text-[#004368]">User Details</h2>

            <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-2xl mx-auto space-y-3">
                <h3 className="text-2xl font-semibold text-slate-700">{userDetails.userName}</h3>
                <p><span className="font-medium">User ID:</span> {userDetails.userId}</p>
                <p><span className="font-medium">Country:</span> {userDetails.country}</p>
                <p><span className="font-medium">State Area:</span> {userDetails.stateArea}</p>
                <p><span className="font-medium">Device Model:</span> {userDetails.deviceModel}</p>
            </div>

            {/* Bitmap Gallery Section */}
            <div className="mt-10">
                <h3 className="text-2xl font-semibold text-center text-[#004368] mb-4">Bitmap Gallery</h3>
                <BitmapGallery imagesArray={userBitmaps} />
            </div>

            {/* Back Button */}
            <div className=" absolute top-6 left-6 z-10">
                <button
                    onClick={() => window.history.back()}
                    className="bg-[#004368] hover:bg-blue-700 text-white py-2 px-8 rounded"
                >
                    ← Back
                </button>
            </div>

        </div>
    );
};

export default ShowBitmap;
