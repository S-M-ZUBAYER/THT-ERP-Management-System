import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function VoltageDetails({ baseUrl }) {
    const [voltageDetails, setVoltageDetails] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState({});
    const [formData, setFormData] = useState({ batteryPercentage: '', voltage: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch all power bank models
    useEffect(() => {
        fetchModels();
        fetchVoltages();
    }, [baseUrl]);

    const fetchModels = async () => {
        try {
            const response = await axios.get(`${baseUrl}/tht/powerBankModels`);
            // const response = await axios.get('http://localhost:2000/tht/powerBankModels');
            setModels(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching models:', error);
            setLoading(false);
        }
    };
    const fetchVoltages = async () => {
        try {
            const response = await axios.get(`${baseUrl}/tht/voltageDetails`);
            // const response = await axios.get('http://localhost:2000/tht/voltageDetails');
            setVoltageDetails(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching models:', error);
            setLoading(false);
        }
    };

    // Add new voltage details
    const handleVoltageDetailsAdd = async () => {
        if (!selectedModel?.id || !formData.batteryPercentage || !formData.voltage) {
            setMessage('Please fill all fields.');
            return;
        }

        // Check if the batteryPercentage or voltage already exists for the selected model
        const isDuplicate = voltageDetails.some(
            (detail) =>
                detail.model_number === selectedModel.model_number &&
                (detail.battery_percentage === Number(formData.batteryPercentage) ||
                    detail.voltage === Number(formData.voltage))
        );

        if (isDuplicate) {
            toast.error('Battery percentage or voltage already exists for this model.');
            return;
        }

        try {
            const payload = {
                modelId: Number(selectedModel?.id),
                batteryPercentage: Number(formData.batteryPercentage),
                voltage: Number(formData.voltage),
            };
            const response = await axios.post(`${baseUrl}/tht/voltageDetails`, payload);
            setMessage(response.data.message);
            toast.success(response.data.message);

            setVoltageDetails([
                ...voltageDetails,
                {
                    id: response.data.id,
                    battery_percentage: payload.batteryPercentage,
                    voltage: payload.voltage,
                    model_number: selectedModel.model_number,
                },
            ]);
        } catch (error) {
            console.error('Error adding voltage detail:', error);
            setMessage('Error adding voltage detail.');
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm(
            'Are you sure you want to delete this voltage detail? This action cannot be undone.'
        );

        if (!isConfirmed) {
            return; // Exit if the user cancels the confirmation
        }

        try {
            // Call API to delete the item
            const response = await axios.delete(`${baseUrl}/tht/voltageDetails/${id}`);
            // const response = await axios.delete(`http://localhost:2000/tht/voltageDetails/${id}`);

            // Update the state to remove the deleted item
            setVoltageDetails(voltageDetails.filter((detail) => detail.id !== id));

            // Show success toast with response message
            toast.success(response.data.message || 'Voltage detail deleted successfully.');
        } catch (error) {
            console.error('Error deleting voltage detail:', error);
            // Show error toast
            toast.error("Failed to delete the voltage detail. Please try again.")
        }
    };


    return (
        <div className="bg-gray-100 pb-10 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Voltage Details</h2>

                {/* Select Power Bank Model */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Select Power Bank Model:</label>
                    <select
                        value={selectedModel?.id || ''}
                        onChange={(e) => {
                            const selectedModel = models.find(model => model.id === Number(e.target.value));
                            setSelectedModel(selectedModel || null);
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-white"
                    >
                        <option value="">-- Select Model --</option>
                        {models.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.model_number}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Add New Voltage Details */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Add Voltage Details:</label>
                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Battery Percentage"
                            value={formData.batteryPercentage}
                            onChange={(e) =>
                                setFormData({ ...formData, batteryPercentage: e.target.value })
                            }
                            className="w-1/2 border border-gray-300 rounded-lg p-2 bg-white"
                        />
                        <input
                            type="number"
                            placeholder="Voltage"
                            value={formData.voltage}
                            onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                            className="w-1/2 border border-gray-300 rounded-lg p-2 bg-white"
                        />
                    </div>
                </div>

                {/* Fetch Voltage Details */}
                <button
                    onClick={handleVoltageDetailsAdd}
                    type="button"
                    className="bg-[#004368] hover:bg-blue-700 text-white rounded-lg px-4 py-2 mb-4 transition w-full"
                >
                    Add
                </button>

                {/* Display Voltage Details */}
                {message && <p className="text-center mb-4 text-blue-600">{message}</p>}
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                    <h3 className="text-lg font-semibold mb-4">Voltage Details:</h3>
                    {
                        loading ? <p className="text-green-500 font-semibold">Loading...</p> :
                            voltageDetails.length > 0 ? (
                                // Group voltage details by model_number
                                Object.entries(
                                    voltageDetails.reduce((acc, detail) => {
                                        if (!acc[detail.model_number]) acc[detail.model_number] = [];
                                        acc[detail.model_number].push(detail);
                                        return acc;
                                    }, {})
                                ).map(([modelNumber, details]) => (
                                    <div key={modelNumber} className="mb-6">
                                        <h4 className="text-md font-semibold mb-2 text-blue-700">
                                            Model: {modelNumber}
                                        </h4>
                                        <table className="table-auto w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="border border-gray-300 px-4 py-2">Battery Percentage</th>
                                                    <th className="border border-gray-300 px-4 py-2">Voltage</th>
                                                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {details.map((detail) => (
                                                    <tr key={detail.id} className="bg-white">
                                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                                            {detail.battery_percentage}%
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                                            {detail.voltage}V
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                                            <button
                                                                onClick={() => handleDelete(detail.id)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 focus:outline-none"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No voltage details available.</p>
                            )}
                </div>

            </div>
        </div>
    );
}

export default VoltageDetails;
