import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import "../globals.css"

export default function AdministratorProject() {
  const location = useLocation()

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Sidebar Active = "projects" ActiveSubItem = "manager" ProjectOpen = {true}/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="bg-black text-white p-5 w-full">
          <h2 className="text-2xl font-bold">Yöneticisi Olduğum Projeler</h2>
        </div>
      </div>
    </div>
  )
}






// export default function AnaSayfa() {
//   const location = useLocation()

//   useEffect(() => {
//     if (location.state?.message) {
//       toast.success(location.state.message)
//     }
//   }, [location.state])

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//       <h1>Hoş Geldiniz!</h1>
//     </>
//   )
// }


