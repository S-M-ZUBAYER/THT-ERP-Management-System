// components/ui/Loader.jsx
const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full py-8">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
        <div className="absolute inset-1 rounded-full border-4 border-t-transparent border-cyan-400 animate-spin-slower"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-indigo-400 animate-spin-reverse"></div>
      </div>
    </div>
  );
};

export default Loader;
