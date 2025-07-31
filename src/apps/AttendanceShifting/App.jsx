import ShiftSchedule from "./components/ShiftSchedule";
import { ScheduleProvider } from "./context/useSchedule";

function App() {
  return (
    <div>
      <ScheduleProvider>
        <ShiftSchedule />
      </ScheduleProvider>
    </div>
  );
}

export default App;
