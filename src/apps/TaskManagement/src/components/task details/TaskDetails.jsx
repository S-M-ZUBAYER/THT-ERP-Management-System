const TaskDetails = ({ TaskDetail }) => {
  return (
    <div className="mb-6">
      <h3 className="font-bold mb-1 text-[#004368] ">Details</h3>
      <p className="text-sm text-[#2B2B2B] ">{TaskDetail}</p>
    </div>
  );
};

export default TaskDetails;
