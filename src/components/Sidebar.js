"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Wallet,
  BarChart2,
  RefreshCcw,
  Bell,
  ShoppingBag,
  Newspaper,
  Settings,
  LogOut,
  ArrowRight,
  CopyPlus,
} from "lucide-react"

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("wallet")

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "trade", label: "Trade", icon: BarChart2 },
    { id: "exchange", label: "Exchange", icon: RefreshCcw },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 4 },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "news", label: "News", icon: Newspaper, badge: 3 },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Log Out", icon: LogOut },
  ]

  return (
    <div className="w-[273px] bg-black text-white flex flex-col h-full">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#c1ff00] rounded-md p-1.5">
            <span className="text-black font-bold text-xl">✕</span>
          </div>
          <span className="font-bold text-xl">X Wallet</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm ${
                activeItem === item.id ? "bg-gray-800" : "hover:bg-gray-900"
              } transition-colors`}
              onClick={() => setActiveItem(item.id)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
              {item.badge && (
                <div className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </div>
              )}
              {activeItem === item.id && item.id === "wallet" && (
                <div className="ml-auto">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto mx-2 mb-2">
        <p className="text-xs">©2025 Stajyerler Tüm Hakları Saklıdır.</p>
      </div>
    </div>
  )
}

