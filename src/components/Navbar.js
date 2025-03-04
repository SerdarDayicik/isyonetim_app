import { Search, Settings, Bell } from "lucide-react"

export function Navbar() {
  return (
    <div className="h-16 bg-black text-white flex items-center justify-between px-6 border-b border-gray-800">
      <div className="flex items-center gap-2">
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden ml-2 bg-gray-300">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

