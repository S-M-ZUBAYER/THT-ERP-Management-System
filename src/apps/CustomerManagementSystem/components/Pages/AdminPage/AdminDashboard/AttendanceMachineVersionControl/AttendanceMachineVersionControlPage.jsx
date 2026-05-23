import { useState } from "react";
import MachineVersionManager from "./components/MachineVersionManager";
import { MACHINE_VERSION_CONFIGS } from "./utils/attendanceMachineVersionApi";

const tabs = [
  { key: "face", name: "FaceAttendanceMachine" },
  { key: "manual", name: "ManualAttendanceMachine" },
];

const AttendanceMachineVersionControlPage = () => {
  const [activeMachine, setActiveMachine] = useState("face");

  return (
    <div className="bg-gray-100 min-h-screen py-12 flex justify-center px-4">
      <div className="w-full max-w-6xl space-y-8">
        <h2 className="text-3xl font-bold text-center text-[#004368]">
          Attendance Machine Version Control
        </h2>

        <div className="flex justify-center items-center">
          <div className="p-1 bg-slate-300 rounded-full flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveMachine(tab.key)}
                className={`px-10 py-2 rounded-full text-lg transition-all duration-200 ${
                  activeMachine === tab.key
                    ? "bg-[#004368] text-white font-bold shadow"
                    : "text-gray-600 font-semibold"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <MachineVersionManager config={MACHINE_VERSION_CONFIGS[activeMachine]} />
      </div>
    </div>
  );
};

export default AttendanceMachineVersionControlPage;
