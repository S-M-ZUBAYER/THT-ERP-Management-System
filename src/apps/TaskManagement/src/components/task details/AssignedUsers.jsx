const AssignedUsers = ({ assign }) => {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-[#004368]">Task Assigned On</h3>
      <div className="flex -space-x-3">
        {assign.map(({ image }, index) => (
          <img
            key={index}
            src={image}
            alt={`user-${index}`}
            className="w-9 h-9 rounded-full border-2 border-white"
          />
        ))}
      </div>
    </div>
  );
};

export default AssignedUsers;
