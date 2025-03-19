"use client"

import { useContext, useEffect, useRef } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Login from "./login"
import Register from "./register"
import Settings from "./page/settings"
import CreateProject from "./page/CreateProject"
import WorkingProject from "./page/WorkingProject"
import CustomerPage from "./page/CustomerPage"
import AdministratorProject from "./page/AdministratorProject"
import CommissionProject from "./page/CommissionProject"
import Notification from "./page/Notifications"
import { AuthProvider, AuthContext } from "./context/AuthContext"

// 🔒 **Özel (Private) Sayfalar İçin Koruma**
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      // Sadece yetkisiz erişim durumunda bildirim göster
      navigate("/login", {
        state: {
          message: "Bu sayfaya erişmek için giriş yapmalısınız!",
          type: "warning",
          from: location.pathname,
        },
      })
    }
  }, [user, loading, navigate, location])

  if (loading) {
    return <div>Loading...</div>
  }

  return user ? children : null
}

// 🔓 **Genel (Public) Sayfalar İçin Koruma**
function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  // Kullanıcı giriş yapmışsa ana sayfaya yönlendir, bildirim gösterme
  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

// 🚪 **Logout Bileşeni**
function LogoutRoute() {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const hasShownNotification = useRef(false)

  useEffect(() => {
    // Çıkış yap
    logout()

    // Bildirim sadece bir kez gösterilsin
    if (!hasShownNotification.current) {
      toast.info("Oturum kapatıldı.")
      hasShownNotification.current = true
    }

    // Kısa bir gecikme ile yönlendir
    const timer = setTimeout(() => {
      navigate("/login", { replace: true })
    }, 300)

    return () => clearTimeout(timer)
  }, [logout, navigate])

  return <div>Çıkış yapılıyor...</div>
}

// 📢 **Toast Mesajlarını Sayfalarda Yakala**
function ToastListener() {
  const location = useLocation()

  useEffect(() => {
    // Sadece yetkisiz erişim durumunda bildirim göster
    if (location.state?.message && location.state?.type && location.state?.from) {
      const { message, type } = location.state
      if (type === "success") toast.success(message)
      else if (type === "error") toast.error(message)
      else if (type === "info") toast.info(message)
      else if (type === "warning") toast.warning(message)

      // State'i temizle
      window.history.replaceState({}, document.title)
    }
  }, [location])

  return null
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <ToastListener />
        <Routes>
          {/* Ana sayfa ve korumalı rotalar */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <CreateProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/Project/WorkingProject"
            element={
              <PrivateRoute>
                <WorkingProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/Project/CustomerPage"
            element={
              <PrivateRoute>
                <CustomerPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/Project/AdministratorProject"
            element={
              <PrivateRoute>
                <AdministratorProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/Project/CommissionProject"
            element={
              <PrivateRoute>
                <CommissionProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/Project/Notification"
            element={
              <PrivateRoute>
                <Notification />
              </PrivateRoute>
            }
          />

          {/* Genel rotalar */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Çıkış rotası */}
          <Route path="/logout" element={<LogoutRoute />} />

          {/* Bilinmeyen rotalar için ana sayfaya yönlendir */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

