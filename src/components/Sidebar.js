import { useState, } from "react"
import { useNavigate } from "react-router-dom"
import {
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
  HomeIcon as House, // Ana sayfa için ikon
} from "lucide-react"

export function Sidebar({ Active, ActiveSubItem = "", ProjectOpen = false, role }) {
  const navigate = useNavigate()

  const [activeItem, setActiveItem] = useState(Active)
  const [activeSubItem, setActiveSubItem] = useState(ActiveSubItem)
  const [isProjectsOpen, setIsProjectsOpen] = useState(ProjectOpen)

  const menuItems = [
    // Eğer adminse, "Home" öğesini göstermiyoruz.
    ...(role !== "admin"
      ? [{ id: "home", label: "Ana Sayfa", icon: House }]  // sadece normal kullanıcılar için
      : []),
        // Admin yalnızca "CreateProject" öğesini görebilir
    ...(role === "admin"
          ? [{ id: "CreateProject", label: "Create Project", icon: House, adminOnly: true }]
          : []),
    {
      id: "projects",
      label: "Projects",
      icon: Wallet,
      hasDropdown: true,
      subItems: [
        { id: "employee", label: "Çalışanı olduğum", icon: User },
        { id: "customer", label: "Müşterisi olduğum", icon: Users },
        { id: "broker", label: "Komisyoncusu olduğum", icon: UserCheck },
        { id: "manager", label: "Yöneticisi olduğum", icon: ShieldCheck, adminOnly: true },
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
    if (itemId === "home") {
      navigate("/") // Ana sayfa rotası
    }
    if (itemId === "CreateProject") {
      navigate("/CreateProject")
    }
    if (itemId === "settings") {
      navigate("/settings")
    }
    if (itemId === "employee") {
      navigate("/Project/WorkingProject")
    }
    if (itemId === "customer") {
      navigate("/Project/CustomerPage")
    }
    if (itemId === "broker") {
      navigate("/Project/CommissionProject")
    }
    if (itemId === "manager") {
      navigate("/Project/AdministratorProject")
    }
    if (itemId === "notifications") {
      navigate("/Project/Notification")
    }
    if (itemId === "logout") {
      navigate("/logout")
    }
  }

  const handleSubItemClick = (itemId, event) => {
    event.stopPropagation()
    setActiveSubItem(itemId)
    setActiveItem("projects")
  }

  return (
    <div className="w-[273px] bg-black text-white flex flex-col h-full border-r border-gray-700">
      <div className="p-5">
        <div className="flex justify-center mb-2">
          <img src="logo.png" alt="SASOFT Logo" className="h-18"/>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            // Admin kullanıcı için "Home" öğesini render etmiyoruz
            return (
              <div key={item.id}>
                <button
                  className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm ${
                    activeItem === item.id ? "bg-gray-800" : "hover:bg-gray-900"
                  } transition-colors`}
                  onClick={() => {
                    handleItemClick(item.id)
                    RouteProgress(item.id)
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
                    {item.subItems.map((subItem) => {
                      if (subItem.adminOnly && role !== "admin") {
                        return null
                      }

                      return (
                        <button
                          key={subItem.id}
                          className={`flex items-center w-full px-3 py-2 rounded-md text-sm ${
                            activeSubItem === subItem.id ? "bg-gray-800" : "hover:bg-gray-900"
                          } transition-colors`}
                          onClick={(e) => {
                            handleSubItemClick(subItem.id, e)
                            RouteProgress(subItem.id)
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
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto mx-2 mb-2">
        <p className="text-xs">©2025 Stajyerler Tüm Hakları Saklıdır.</p>
      </div>
    </div>
  )
}
