// import BugHeader from "@/components/bug/BugHeader";
// import BugTable from "@/components/bug/BugTable";

import BugHeader from "../components/bug/BugHeader";
import BugTable from "../components/bug/BugTable";

export default function BugDetailsPage() {
  return (
    <div className="p-6 md:p-10  w-[80vw]">
      <BugHeader />
      <BugTable />
    </div>
  );
}
