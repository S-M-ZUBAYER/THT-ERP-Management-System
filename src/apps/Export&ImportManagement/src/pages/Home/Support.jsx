import React from "react";
import production from "../../assets//productionManger.jpg";
import finance from "../../assets/finance.jpg";
import commercial from "../../assets/Commercial.jpg";
import Warehouse from "../../assets/warehouse.jpg";
import Admin from "../../assets/admin.jpg";
import ParagraphModal from "./ParagraphModal";

const Support = () => {
  return (
    <div className="w-full mt-14 mb-11">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-purple-600">
          Know About Works
        </h1>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-xl lg:max-w-full mx-auto gap-8 mt-12 group">
          <div className="bg-white/5 shadow-xl group-hover:blur-sm hover:!blur-none hover:translate-[1.2] p-8 rounded-xl hover:bg-lime-200 hover:scale-110 ease-in-out duration-300">
            <img
              src={production}
              alt="Test"
              className="h-56 mx-auto rounded-lg object-cover"
            />
            <h1 className="uppercase text-xl font-bold mt-2">Production</h1>
            <ParagraphModal
              text={`The Production Manager at THT-Space Electrical Company Ltd. plays a vital role in overseeing the efficient management and organization of the company's production processes, particularly in creating and categorizing different product models for export. This position involves meticulous documentation of each model's details, including quantity, specifications, and packaging requirements. The Production Manager ensures that all product data is accurately inputted into the system, aligning with export standards and regulatory requirements. By coordinating the palatization process and verifying that all necessary information is captured correctly, this role is essential to maintaining smooth operations and meeting delivery deadlines. The Production Manager's attention to detail and organizational skills are crucial in ensuring the timely and successful export of products while adhering to quality and compliance standards.`}
            />
          </div>

          <div className="bg-white/5 shadow-xl group-hover:blur-sm hover:!blur-none hover:translate-[1.2] p-8 rounded-xl hover:bg-lime-200 hover:scale-110 ease-in-out duration-300">
            <img
              src={Warehouse}
              alt="Test"
              className="h-56 mx-auto rounded-lg object-cover"
            />
            <h1 className="uppercase text-xl font-bold mt-2">Warehouse</h1>
            <ParagraphModal
              text={`Warehouse work involves managing inventory, storing goods, and
      coordinating shipments. Workers handle receiving, picking,
      packing, and shipping products. Efficient warehouse operations
      ensure timely deliveries, minimize stockouts, and optimize space
      utilization. It's crucial for smooth supply chain management and
      customer satisfaction in various industries.`}
            />
          </div>

          <div className="bg-white/5 shadow-xl group-hover:blur-sm hover:!blur-none hover:translate-[1.2] p-8 rounded-xl hover:bg-lime-200 hover:scale-110 ease-in-out duration-300">
            <img
              src={commercial}
              alt="Test"
              className="h-56 mx-auto rounded-lg object-cover"
            />
            <h1 className="uppercase text-xl font-bold mt-2">Commercial</h1>
            <ParagraphModal
              text={`The Commercial Manager at THT-Space Electrical Company Ltd. is responsible for overseeing the smooth and efficient export of products across international borders, ensuring seamless transportation from one port to another and from one country to another. This role involves managing a diverse fleet of vehicles, coordinating the exchange of goods between different transport modes to ensure timely and secure delivery. The Commercial Manager also plays a key role in cost management, meticulously calculating and tracking expenses related to transportation, logistics, and other commercial operations. This position requires a keen eye for detail, as the Commercial Manager is responsible for preparing accurate documentation and ensuring all information is entered into the system according to the established procedures. By managing logistics, monitoring expenses, and ensuring compliance with all regulations, the Commercial Manager contributes significantly to the company’s successful and cost-effective international operations.`}
            />
          </div>

          <div className="bg-white/5 shadow-xl group-hover:blur-sm hover:!blur-none hover:translate-[1.2] p-8 rounded-xl hover:bg-lime-200 hover:scale-110 ease-in-out duration-300">
            <img
              src={finance}
              alt="Test"
              className="h-56 mx-auto rounded-lg object-cover"
            />
            <h1 className="uppercase text-xl font-bold mt-2">Finance</h1>
            <ParagraphModal
              text={`The Finance Department at THT-Space Electrical Company Ltd. plays a critical role in overseeing and managing all financial operations. This department is responsible for ensuring the accuracy and integrity of financial transactions, from verifying payment amounts to ensuring that all calculations are correct. The finance team closely monitors various financial sections, checks the validity of the information, and confirms that all payments are processed appropriately. Their duties include managing budgets, reconciling financial data, ensuring compliance with regulations, and maintaining accurate records for future analysis. By meticulously reviewing financial details, the finance department guarantees that all transactions align with company standards, supporting sound financial decisions and driving the organization’s financial health and stability.`}
            />
          </div>

          <div className="bg-white/5 shadow-xl group-hover:blur-sm hover:!blur-none hover:translate-[1.2] p-8 rounded-xl hover:bg-lime-200 hover:scale-110 ease-in-out duration-300">
            <img
              src={Admin}
              alt="Test"
              className="h-56 mx-auto rounded-lg object-cover"
            />
            <h1 className="uppercase text-xl font-bold mt-2">Admin</h1>
            <ParagraphModal
              text={`An admin dashboard is a web interface that allows administrators to monitor and manage various aspects of a system or application. It provides insights into user activity, data analytics, system health, and configuration settings. One key feature of the admin dashboard is the ability to change user roles, allowing administrators to assign different access levels and permissions to users. This ensures that the right people have access to the appropriate resources and tools. Additionally, the dashboard enables the management of routing access permissions, controlling which users or roles can access specific areas of the system. Admin dashboards enhance decision-making, streamline operations, and improve security by providing precise control over user roles and access, ultimately leading to better efficiency and more informed strategic choices.`}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Support;
