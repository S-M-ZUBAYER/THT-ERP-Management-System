import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PowerBankModels({ baseUrl, currentServer }) {
    const [modelNumber, setModelNumber] = useState('');
    const [message, setMessage] = useState('');
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                // const response = await axios.get('http://localhost:2000/tht/powerBankModels');
                const response = await axios.get(`${baseUrl}/tht/powerBankModels`);
                setModels(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching models:', error);
                setMessage('Error fetching models');
                setLoading(false);
            }
        };
        fetchModels();
    }, [baseUrl]);

    // Add a new power bank model
    const handleAddModel = async () => {
        if (!modelNumber.trim()) {
            setMessage('Model number cannot be empty.');
            return;
        }
        try {
            // const response = await axios.post('http://localhost:2000/tht/powerBankModels', { modelNumber });
            const response = await axios.post(`${baseUrl}/tht/powerBankModels`, { modelNumber });
            setMessage(response.data.message);
            // Update the list with the newly added model
            setModels((prevModels) => [...prevModels, { id: response.data.id, model_number: modelNumber }]);
            setModelNumber('');
        } catch (error) {
            console.error('Error adding model:', error);
            setMessage('Error adding model');
        }
    };


    return (
        <div className="bg-gray-100 mt-16 mb-20 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Power Bank Models</h2>

                {/* Add New Model Section */}
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Enter Model Number"
                        value={modelNumber}
                        onChange={(e) => setModelNumber(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    />
                    <button
                        onClick={handleAddModel}
                        className="bg-[#004368] hover:bg-blue-700 text-white rounded-lg px-4 py-2  transition"
                    >
                        Add Model
                    </button>
                </div>

                {/* Display Message */}
                {message && <p className="text-center mb-4 text-green-600">{message}</p>}

                {/* Model List */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                    <h3 className="text-lg font-semibold mb-4">Available Models:</h3>
                    {
                        loading ? <p className="text-green-500 font-semibold">Loading...</p> :
                            models.length > 0 ? (
                                <ul className="space-y-2">
                                    {models.map((model) => (
                                        <li
                                            key={model.id}
                                            className="bg-white border border-gray-300 rounded-lg p-3 flex justify-between items-center"
                                        >
                                            <span className="text-gray-700 font-medium">{model.model_number}</span>
                                            <span className="text-gray-400 text-sm">ID: {model.id}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-center">No models available.</p>
                            )}
                </div>
            </div>
        </div>
    );
}

export default PowerBankModels;
