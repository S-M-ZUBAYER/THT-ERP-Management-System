import ShiftSchedule from "./components/ShiftSchedule";
import { ScheduleProvider } from "./context/useSchedule";

function App() {
  return (
    <div className="w-[80vw] mx-auto">
      <ScheduleProvider>
        <ShiftSchedule />
      </ScheduleProvider>
    </div>
  );
}

export default App;
