import { useAwareness } from "../../hooks/useAwareness";

export default function PresencePanel() {
  const {states} = useAwareness();

  const users = Array.from(states.values())
    .filter((state) => state.user)
    .map((state) => state.user!);

  return (
    <div className=" flex items-center">
      <div className="flex items-center -space-x-2">
        {users.map((user,index) => (
          <div
            key={user.id+index}
            className="relative"
            title={user.username}
          >
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#6B7A58] text-white flex items-center justify-center text-xs font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
          </div>
        ))}
      </div>

      <span className="ml-3 text-xs text-gray-500">
        {users.length} online
      </span>
    </div>
  );
}