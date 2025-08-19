import React, { useContext } from "react";
import CustomerServicePart from "./CustomerServicePart";
import { AllProductContext } from "@/apps/CustomerManagementSystem/context/ProductContext";
// import { AllProductContext } from '../../../context/ProductContext';

const CustomerService_2 = () => {
  const { user, language } = useContext(AllProductContext);

  return (
    <div className="text-left md:mx-20 px-3 md:px-12 my-10 py-10 shadow-lg  rounded-lg bg-white">
      <h1 className="text-2xl font-semibold text-gray-400 mt-5">
        {/* Customer Name
         */}
        {user?.displayName}
      </h1>
      <hr className="text-black font-bold border-2 my-2"></hr>

      <CustomerServicePart></CustomerServicePart>
    </div>
  );
};

export default CustomerService_2;
