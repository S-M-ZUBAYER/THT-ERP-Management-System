// import TaskColumn from "@/components/Dashboard/TaskColumn";
// import Loader from "@/components/Loader";
import TaskColumn from "../components/Dashboard/TaskColumn";
import Loader from "../components/Loader";
import useTaskColumns from "../hook/useTasksData";
// import useTaskColumns from "@/hook/useTasksData";

const Home = () => {
  const { tasksByStatus, loading, error } = useTaskColumns();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6  w-[80vw] ">
      {loading ? (
        <div className="w-[60vw] h-screen flex justify-center items-center ">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-red-500 col-span-3">{error}</p>
      ) : (
        tasksByStatus.map((group, idx) => (
          <TaskColumn key={idx} index={idx} tasks={group} />
        ))
      )}
    </div>
  );
};

export default Home;
