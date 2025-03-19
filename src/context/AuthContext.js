"use client"

import { createContext, useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Token'i çözümleme fonksiyonu
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      return JSON.parse(atob(base64))
    } catch (e) {
      console.error("Token çözümleme hatası:", e)
      return null
    }
  }

  // Token geçerlilik süresini kontrol eden fonksiyon
  const isTokenValid = (token) => {
    const decoded = parseJwt(token)
    if (!decoded) return false
    return decoded.exp * 1000 > Date.now()
  }

  // Sayfa yenilendiğinde token kontrolü yap
  useEffect(() => {
    let token = localStorage.getItem("token")
    if (token) {
      token = token.replace(/^"(.*)"$/, "$1") // Fazladan tırnak varsa temizle
      if (isTokenValid(token)) {
        const decoded = parseJwt(token)
        setUser({ user_id: decoded.user_id, role: decoded.role })
      } else {
        // Geçersiz token - sessizce temizle
        localStorage.removeItem("token")
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  // Kullanıcı giriş yapınca
  const login = (jwtToken) => {
    if (isTokenValid(jwtToken)) {
      const decoded = parseJwt(jwtToken)
      setUser({ user_id: decoded.user_id, role: decoded.role })
      localStorage.setItem("token", jwtToken)
      return true
    } else {
      // Geçersiz token durumunda hata bildir
      toast.error("Geçersiz giriş bilgileri!")
      logout()
      return false
    }
  }

  // Kullanıcı çıkış yapınca - bildirim gösterme işlevi kaldırıldı
  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

