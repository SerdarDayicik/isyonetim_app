import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect } from "react"

import { WalletDashboard } from "./components/WalletDashboard"
import "./globals.css"

export default function AnaSayfa() {
  const location = useLocation()

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <WalletDashboard />
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


