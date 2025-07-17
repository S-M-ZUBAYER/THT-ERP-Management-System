export const ShowDetailsModal = ({ finance, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-3/4 p-6">
                {/* Close Button */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Main Information */}
                <h2 className="text-2xl font-bold mb-4 text-center">Finance Details</h2>
                <div className="flex justify-around">
                    <div>
                        <p><strong>productName:</strong> {finance.productName.split('"')[1]}</p>
                        <p><strong>productModel:</strong> {finance.productModel.split('"')[1]}</p>
                        <p><strong>Invoice No:</strong> {finance.invoiceNo}</p>
                        <p><strong>BE No:</strong> {finance.beNumber}</p>
                        <p><strong>BE Date:</strong> {finance.selectedBEDate.split("T")[0]}</p>
                        <p><strong>EP No:</strong> {finance.epNo}</p>
                        <p><strong>totalBox:</strong> {finance.totalBox}</p>
                        <p><strong>totalQuantity:</strong> {finance.totalQuantity}</p>
                        <p><strong>total:</strong> {finance.total}</p>
                        <p><strong>Total Cost:</strong> {finance.totalCost}</p>
                    </div>

                    <div>
                        <p><strong>Transport Country:</strong> {finance.transportCountryName}</p>
                        <p><strong>Truck No:</strong> {finance.truckNo}</p>
                        <p><strong>totalNetWeight:</strong> {finance.totalNetWeight}</p>
                        <p><strong>totalPalletQuantity:</strong> {finance.totalPalletQuantity}</p>
                        <p><strong>transportCountryName:</strong> {finance.transportCountryName}</p>
                        <p><strong>transportPort:</strong> {finance.transportPort}</p>
                        <p><strong>transportWay:</strong> {finance.transportWay}</p>
                        <p><strong>Date:</strong> {finance.date}</p>
                    </div>

                </div>



                {/* Table 1: financeProductInBoxes */}
                <h3 className="text-xl font-semibold mt-6 mb-2">Product In Boxes</h3>
                <table className="min-w-full bg-gray-100 border border-gray-300 mb-4">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-start">Product Name</th>
                            <th className="py-2 px-4 border-b text-start">Product Model</th>
                            <th className="py-2 px-4 border-b text-start">Quantity</th>
                            <th className="py-2 px-4 border-b text-start">Truck Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finance.financeProductInBoxes.map((product) => (
                            <tr key={product.id}>
                                <td className="py-2 px-4 border-b">{product.productName}</td>
                                <td className="py-2 px-4 border-b">{product.productModel}</td>
                                <td className="py-2 px-4 border-b">{product.quantity}</td>
                                <td className="py-2 px-4 border-b">{product.truckNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Table 2: particularExpenseNames */}
                <h3 className="text-xl font-semibold mt-6 mb-2">Particular Expenses</h3>
                <table className="min-w-full bg-gray-100 border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-start">Expense Name</th>
                            <th className="py-2 px-4 border-b text-start">Cost</th>
                            <th className="py-2 px-4 border-b text-start">Remark</th>
                            <th className="py-2 px-4 border-b text-start">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finance.particularExpenseNames.map((expense) => (
                            <tr key={expense.id}>
                                <td className="py-2 px-4 border-b">{expense.particularExpenseName}</td>
                                <td className="py-2 px-4 border-b">{expense.particularExpenseCost}</td>
                                <td className="py-2 px-4 border-b">{expense.remark}</td>
                                <td className="py-2 px-4 border-b">{new Date(expense.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
