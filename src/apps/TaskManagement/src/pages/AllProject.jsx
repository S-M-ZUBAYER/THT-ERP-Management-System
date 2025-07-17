// import { ProjectTables } from "@/components/project/ProjectTables";
// import { CalendarPanel } from "@/components/task/CalendarPanel";
// import { useGetAllProjectData } from "@/hook/useGetAllprojectData";
// import { ResourcesPanel } from "@/components/ResourcesPanel";

import { ProjectTables } from "../components/project/ProjectTables";
import { ResourcesPanel } from "../components/ResourcesPanel";
import { CalendarPanel } from "../components/task/CalendarPanel";
import { useGetAllProjectData } from "../hook/useGetAllprojectData";

function AllProject() {
  const { project, isLoading } = useGetAllProjectData();
  return (
    <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 px-[5vw] w-[80vw] ">
      <div className="col-span-2">
        <ProjectTables Data={project} loading={isLoading} />
      </div>
      <div className="space-y-6">
        <CalendarPanel />
        <ResourcesPanel task={project} />
      </div>
    </div>
  );
}

export default AllProject;
