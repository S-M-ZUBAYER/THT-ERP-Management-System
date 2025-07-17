import { useEffect, useState } from "react";
import axios from "axios";

export const useTaskReports = (email) => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://grozziie.zjweiting.com:57683/tht/taskManagement/api/dailyTaskReport/email/${email}`
        );
        const resData = res.data?.result || [];
        setAllData(resData.sort((a, b) => b.id - a.id));
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  return { allData, loading, error };
};
