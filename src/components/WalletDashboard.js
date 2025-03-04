import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"
import { WalletContent } from "./WalletContent"

export function WalletDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <WalletContent />
      </div>
    </div>
  )
}

