import axios from "axios";
import { ATTENDANCE_API_URL } from "./attendanceConstants";

export const fetchAllAttendancePayments = async () => {
    try {
        const response = await axios.get(ATTENDANCE_API_URL);
        if (response.data.success) {
            return response.data.data || [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching attendance payments:", error);
        throw error;
    }
};