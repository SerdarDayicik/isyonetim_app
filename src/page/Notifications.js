import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import "../globals.css"

export default function Notification() {
  const location = useLocation()

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Sidebar Active = "notifications"/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <h1>Bildirimler</h1>
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


