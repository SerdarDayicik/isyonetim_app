import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { ProjectCreate } from "../components/Project_Create"
import  Home  from "../page/Home" // Ana sayfa bileşeni
import "../globals.css"

export default function CreateProject() {
  const location = useLocation()

  // Token'ı localStorage'dan al
  const token = localStorage.getItem("token")

  // Token varsa, JWT'den role bilgisini çıkar
  const role = token ? JSON.parse(atob(token.split('.')[1]))?.role : null
  
  useEffect(() => {
    console.log("Role bilgisi: ", role)
  }, [role])
  
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])


  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      {/* Sidebar'a role bilgisini props olarak gönder */}
      <Sidebar Active={role === "admin" ? "CreateProject" : "home"} role={role} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        
        {/* Eğer role 'admin' ise ProjectCreate, değilse Home bileşeni render edilsin */}
        {role === "admin" ? <ProjectCreate /> : <Home />}
      </div>
    </div>
  )
}
