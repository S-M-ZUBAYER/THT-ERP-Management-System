import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import { AddPercent } from "./AddPercent";
import PercentList from "./PercentList";
import axios from "axios";
import AmountConvertedToPercentage from "./AmountConvertedToPercentage";

function PercentPage() {
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
      <div className="w-full lg:grid lg:grid-cols-2 md:grid md:grid-cols-1 sm:grid sm:grid-cols-1">
        <div>
          <AddPercent onSuccess={fetchPercents} />
          <PercentList percents={percents} onDelete={fetchPercents} />
        </div>
        <AmountConvertedToPercentage />
      </div>
    </>
  );
}

export default PercentPage;
