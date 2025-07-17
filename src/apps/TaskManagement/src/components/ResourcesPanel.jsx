export const ResourcesPanel = ({ task = [] }) => {
  const allFiles = task
    .flatMap((t) => t?.resourceFiles || [])
    .filter((f) => f?.fileName);
  return (
    <div className="border rounded-xl p-4 bg-white">
      <h3 className="text-sm font-semibold mb-2 text-[#1A1A1A]">Resources</h3>
      {allFiles.length > 0 ? (
        <ul className="text-sm text-muted-foreground space-y-2">
          {allFiles.map((file, index) => (
            <li key={index} className="flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M3 9.0003V10.9085C3 13.3422 3 14.5591 3.66455 15.3833C3.79881 15.5498 3.95048 15.7016 4.117 15.8358C4.94123 16.5003 6.15811 16.5003 8.59185 16.5003C9.12105 16.5003 9.38558 16.5003 9.6279 16.4148C9.6783 16.397 9.72765 16.3766 9.77588 16.3535C10.0077 16.2427 10.1947 16.0556 10.5689 15.6814L14.1213 12.129C14.5549 11.6954 14.7716 11.4787 14.8858 11.2031C15 10.9274 15 10.6208 15 10.0077V7.5003C15 4.6719 15 3.25769 14.1213 2.379C13.327 1.58463 12.0949 1.50842 9.77588 1.5011M9.75 16.1253V15.7503C9.75 13.629 9.75 12.5684 10.409 11.9093C11.0681 11.2503 12.1287 11.2503 14.25 11.2503H14.625"
                    stroke="#004368"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 6.17271V4.09579C3 2.66197 4.17525 1.49963 5.625 1.49963C7.07475 1.49963 8.25 2.66197 8.25 4.09579V6.95156C8.25 7.66845 7.66237 8.24963 6.9375 8.24963C6.21263 8.24963 5.625 7.66845 5.625 6.95156V4.09579"
                    stroke="#B0C5D0"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>{file.fileName}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No resources available.</p>
      )}
    </div>
  );
};
