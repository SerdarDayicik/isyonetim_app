"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {
  // LayoutDashboard,
  Wallet,
  Bell,
  Settings,
  LogOut,
  ArrowRight,
  ChevronDown,
  Users,
  User,
  UserCheck,
  ShieldCheck,
  House,
} from "lucide-react"

export function Sidebar({ Active,  ActiveSubItem = "" , ProjectOpen = false }) {
  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState(Active)
  const [activeSubItem, setActiveSubItem] = useState(ActiveSubItem)
  const [isProjectsOpen, setIsProjectsOpen] = useState(ProjectOpen)

  const menuItems = [

    { id: "CreateProject", label: "Create Project", icon: House },
    // { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "projects",
      label: "Projects",
      icon: Wallet,
      hasDropdown: true,
      subItems: [
        { id: "employee", label: "Çalışanı olduğum", icon: User },
        { id: "customer", label: "Müşterisi olduğum", icon: Users },
        { id: "broker", label: "Komisyoncusu olduğum", icon: UserCheck },
        { id: "manager", label: "Yöneticisi olduğum", icon: ShieldCheck },
      ],
    },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 4 },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Log Out", icon: LogOut },
  ]

  const toggleProjects = () => {
    setIsProjectsOpen(!isProjectsOpen)
  }

  const handleItemClick = (itemId) => {
    if (itemId === "projects") {
      toggleProjects()
    } else {
      setActiveItem(itemId)
      setActiveSubItem("")
    }
  }
  
  const RouteProgress = (itemId) => {
    if(itemId === "CreateProject"){
      navigate("/")
    }
    if(itemId === "settings") {
      navigate("/settings")
    }
    if(itemId === "employee"){
      navigate("/Project/WorkingProject")
    }
    if(itemId === "customer"){
      navigate("/Project/CustomerPage")
    }
    if(itemId === "broker"){
      navigate("/Project/CommissionProject")
    }
    if(itemId === "manager"){
      navigate("/Project/AdministratorProject")
    }
    if(itemId === "notifications"){
      navigate("/Project/Notification")
    }
  }

  const handleSubItemClick = (itemId,event) => {
    event.stopPropagation()
    setActiveSubItem(itemId)
    setActiveItem("projects")
  }

  return (
    <div className="w-[273px] bg-black text-white flex flex-col h-full border-r border-gray-700">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#c1ff00] rounded-md p-1.5">
            <span className="text-black font-bold text-xl">✕</span>
          </div>
          <span className="font-bold text-xl">X Wallet</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* Burası Navbarların buttonları */}
              <button
                className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm ${
                  activeItem === item.id ? "bg-gray-800" : "hover:bg-gray-900"
                } transition-colors`}
                onClick={() => {
                  handleItemClick(item.id)
                  RouteProgress(item.id)
                  console.log(item.id)
                }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
                {item.badge && (
                  <div className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
                {item.hasDropdown && (
                  <ChevronDown
                    className={`ml-auto w-4 h-4 transition-transform ${isProjectsOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {item.id === "projects" && isProjectsOpen && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      className={`flex items-center w-full px-3 py-2 rounded-md text-sm ${
                        activeSubItem === subItem.id ? "bg-gray-800" : "hover:bg-gray-900"
                      } transition-colors`}
                      onClick={(e) => {
                        handleSubItemClick(subItem.id, e)
                        RouteProgress(subItem.id)
                        console.log(subItem.id)
                      }}
                    >
                      <subItem.icon className="w-4 h-4 mr-3" />
                      <span>{subItem.label}</span>
                      {activeSubItem === subItem.id && (
                        <div className="ml-auto">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto mx-2 mb-2">
        <p className="text-xs">©2025 Stajyerler Tüm Hakları Saklıdır.</p>
      </div>
    </div>
  )
}
