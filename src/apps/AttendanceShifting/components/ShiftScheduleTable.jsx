import { Trash } from "lucide-react";
export default function ShiftScheduleTable({
  data,
  clearData,
  deleteEntry,
  t,
}) {
  return (
    <div className="p-5 bg-white shadow-lg">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">
          {t("Shift Schedule Table")}{" "}
        </h1>
        <button
          type="button"
          onClick={clearData}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
        >
          <Trash className="w-4 h-4" />
          <span>{t("Clear All")}</span>
        </button>
      </div>

      <table className="w-full border-transparent">
        <thead>
          <tr>
            <th>{t("Team")} </th>
            <th>{t("Entry Time")} </th>
            <th>{t("Exit Time")} </th>
            {/* <th>{t("Action")} </th> */}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((team, index) => (
              <tr key={team.id}>
                <td className=" text-center">{team.name}</td>
                <td className=" text-center">{team.EntryTime}</td>
                <td className=" text-center">{team.ExitTime}</td>
                <td className=" text-center">
                  <button
                    type="button"
                    onClick={() => deleteEntry(team.id)}
                    className="text-red-500 hover:bg-red-700 px-3 py-1 rounded "
                  >
                    <span>
                      <Trash className="w-4 h-4" />
                    </span>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="border p-2 text-center text-gray-500">
                {t("No Shift Data Available")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
