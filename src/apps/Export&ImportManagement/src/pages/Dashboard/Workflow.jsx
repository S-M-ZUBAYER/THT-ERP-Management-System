import React from "react";

const Workflow = () => {
    const departments = [
        { name: "Production", percentage: 40, color: "from-green-400 to-green-600" },
        { name: "Warehouse", percentage: 15, color: "from-orange-400 to-orange-600" },
        { name: "Commercial", percentage: 30, color: "from-blue-400 to-blue-600" },
        { name: "Finance", percentage: 10, color: "from-purple-400 to-purple-600" },
        { name: "Admin", percentage: 5, color: "from-yellow-400 to-yellow-600" },
    ];

    return (
        <div className="workflow-dashboard max-w-full mx-auto p-8 bg-gray-50 shadow-lg rounded-2xl my-20">
            <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-700">
                Department Workflow Breakdown
            </h2>
            <div className="space-y-6 ">
                {departments.map((dept) => (
                    <div
                        key={dept.name}
                        className="relative bg-gradient-to-r rounded-lg shadow-md overflow-hidden"
                        style={{ width: "100%" }}
                    >
                        <div
                            className={`absolute inset-0 bg-gradient-to-r ${dept.color} transition-all duration-300`}
                            style={{ width: `${dept.percentage}%` }}
                        ></div>
                        <div className="relative z-10 flex justify-between items-center p-4 text-black font-semibold">
                            <span>{dept.name}</span>
                            <span>{dept.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Workflow;

