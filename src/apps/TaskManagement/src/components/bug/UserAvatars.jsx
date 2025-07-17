export default function UserAvatars({ users }) {
  return (
    <div className="flex -space-x-2">
      {users.map(({ image }, i) => (
        <div
          key={i}
          className="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center border-2 border-white"
        >
          <img src={image} alt="user" className="w-6" />
        </div>
      ))}
    </div>
  );
}
