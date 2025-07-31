import { useEffect, useState } from "react";
import ShiftScheduleTable from "./ShiftScheduleTable";
import CommonShiftTimes from "./CommonShiftTimes";
import { useTranslation } from "react-i18next";
import DropDown from "./DropDown";
import ShiftInfo from "./ShiftInfo";
import { useScheduleContext } from "../context/useSchedule";
import useUpdateNotes from "../hooks/useUpdateNote";
import LeftSection from "./LeftSection";
import toast from "react-hot-toast";

export default function ShiftSchedule() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ teamName: "", entry: "", exit: "" });
  const [tableDetails, setTableDetails] = useState([]);

  const { exitTime, calculateExitTime } = useScheduleContext();

  const [note, setNote] = useState(t("note"));

  const newNote = useUpdateNotes(exitTime, calculateExitTime);

  useEffect(() => {
    setNote(newNote);
  }, [exitTime, calculateExitTime]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const submit = () => {
    const validateTimeFormat = (time, fieldName) => {
      const incorrectPattern = /^([0-9]{1,2})[.-]([0-9]{2})$/;
      if (incorrectPattern.test(time)) {
        const correctedTime = time.replace(/[.-]/, ":");
        toast.error(
          `Please enter ${fieldName} time in HH:MM format (e.g., ${correctedTime})`
        );
        return false;
      }
      return true;
    };

    if (
      !validateTimeFormat(form.entry, "entry") ||
      !validateTimeFormat(form.exit, "exit")
    ) {
      return; // Stop execution if either is invalid
    }

    if (form.entry && form.exit) {
      const newEntry = {
        id: Math.max(...tableDetails.map((item) => item.id), 0) + 1,
        name: `${form.teamName ? form.teamName : "team"}`,
        EntryTime: form.entry,
        ExitTime: form.exit,
      };

      setTableDetails((prevDetails) => {
        const updatedDetails = [...prevDetails, newEntry];
        return updatedDetails.sort((a, b) => a.id - b.id);
      });

      setForm({ teamName: "", entry: "", exit: "" });
    } else {
      alert("Please fill in both Entry and Exit fields.");
    }
  };

  const clearArray = () => {
    setTableDetails([]);
  };

  const deleteEntry = (id) => {
    setTableDetails((prevDetails) =>
      prevDetails.filter((team) => team.id !== id)
    );
  };

  return (
    <div className="w-full h-screen bg-[#FFFFFF] overflow-y-auto relative pt-[62px] px-[10vw] ">
      <DropDown changeLanguage={changeLanguage} />

      <div className="w-[100%] flex flex-row  gap-4 mt-10 ">
        <div className="w-[30%] ">
          <LeftSection t={t} submit={submit} form={form} setForm={setForm} />
        </div>
        <div className="w-[70%] ">
          <ShiftScheduleTable
            data={tableDetails}
            clearData={clearArray}
            deleteEntry={deleteEntry}
            t={t}
          />
          <CommonShiftTimes data={tableDetails} t={t} />
        </div>
      </div>
    </div>
  );
}
