import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import { ToastContainer, toast } from "react-toastify" // Çift importu kaldırdım
import "react-toastify/dist/ReactToastify.css"

import "../globals.css"

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    // location.state?.message mevcutsa başarılı bir toast göster
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state]) // state değiştiğinde çalışacak şekilde ayarladım

  return (
    <div className="flex-1 overflow-auto bg-white w-full h-full">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="w-full h-full">
        <div className="bg-black text-white p-5 w-full">
          <h2 className="text-2xl font-bold">Home</h2>
        </div>
        <div className="p-8">
          {/* İçeriğinizi buraya ekleyebilirsiniz */}
        </div>
      </div>
    </div>
  )
}
