import { Sidebar } from "./components/Sidebar"
import { Navbar } from "./components/Navbar"
import { ProjectCreate } from "./components/Project_Create"

export default function Tamplate() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <ProjectCreate />
      </div>
    </div>
  )
}

