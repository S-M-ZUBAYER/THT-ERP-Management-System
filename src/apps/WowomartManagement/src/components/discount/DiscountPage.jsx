import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import { AddPercent } from "./AddPercent";
import PercentList from "./PercentList";
import axios from "axios";

function DiscountPage() {
  const [percents, setPercents] = useState([]);

  const fetchPercents = async () => {
    try {
      const res = await axios.get(
        "https://grozziie.zjweiting.com:57683/tht/wowomart/api/allDiscountPercent"
      );
      const sorted = res.data.result.sort((a, b) => a.value - b.value);
      setPercents(sorted);
    } catch (err) {
      console.error("Failed to fetch percents:", err);
    }
  };

  useEffect(() => {
    fetchPercents();
  }, []);
  return (
    <>
      <div className="mx-16">
        <div>
          <Dashboard percents={percents} />
        </div>
      </div>
    </>
  );
}

export default DiscountPage;
