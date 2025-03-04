import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect } from "react"

export default function AnaSayfa() {
  const location = useLocation()

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1>Hoş Geldiniz!</h1>
    </>
  )
}
