import axios from "axios";
import { TRANSACTION_API_URL } from "./transactionConstants";

export const fetchAllTransactions = async () => {
    try {
        const response = await axios.get(TRANSACTION_API_URL);
        if (response.data.code === 200) {
            return response.data.result;
        }
        return { lazada: [], shopee: [], tiktok: [] };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
};
