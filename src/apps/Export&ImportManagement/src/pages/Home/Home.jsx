import React from "react";
import Slider from "./Slider";
import Services from "./Services";
import Support from "./Support";
import Workflow from "../Dashboard/Workflow";

const Home = () => {
  return (
    <div className="w-full">
      <Slider />
      <Services />
      <Support />
      <Workflow />
    </div>
  );
};

export default Home;
