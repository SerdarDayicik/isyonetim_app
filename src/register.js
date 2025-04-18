"use client"

import React from "react"

import { useState } from "react"
import { CheckCircle, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"

const API_KEY = process.env.REACT_APP_API_URL

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_KEY}/Session/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.firstName,
          surname: formData.lastName,
          email: formData.email,
          phone: formData.phoneNumber,
          password: formData.password,
        }),
      })

      if (response.status === 200) {
        navigate("/login", { state: { message: "Kayıt Başarılı." } }) // Mesajı state ile gönder
      } else {
        console.error("Kayıt başarısız:", response.status)
      }
    } catch (error) {
      console.error("Hata:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#121212] overflow-hidden">
      {/* Sol Taraf - Daha kompakt hale getirildi */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between text-white h-full">
        <h1 className="text-4xl font-bold tracking-tight mb-8">HOŞ GELDİNİZ</h1>

        <div className="flex-grow flex items-center justify-center mb-8">
          <div className="bg-[#1c1c1c] rounded-3xl w-full max-w-md aspect-square p-6">
            <img src="/sasoft-yellow.gif" alt="İllüstrasyon" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400 text-base">
            Hesabınıza giriş yaparak özel içeriklere erişebilir, topluluğumuzla etkileşime geçebilir ve tüm özelliklere
            tam erişim sağlayabilirsiniz.
          </p>

          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-1">
              <CheckCircle className="text-[#c1ff00] h-4 w-4 flex-shrink-0" />
              <span className="text-gray-300 text-xs">Özel İçerikler</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="text-[#c1ff00] h-4 w-4 flex-shrink-0" />
              <span className="text-gray-300 text-xs">Kişisel Panel</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="text-[#c1ff00] h-4 w-4 flex-shrink-0" />
              <span className="text-gray-300 text-xs">Etkinlik Katılımı</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="text-[#c1ff00] h-4 w-4 flex-shrink-0" />
              <span className="text-gray-300 text-xs">Topluluk Erişimi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 border-l border-gray-800 bg-[#121212] flex items-center">
        <div className="max-w-xl mx-auto w-full">
          <h2 className="text-4xl font-bold text-white mb-6">
            Hesap Oluştur
            <div className="h-1 w-16 bg-[#c1ff00] mt-2"></div>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Ad"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-[#1c1c1c] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff00] text-lg"
                />
              </div>
              <div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Soyad"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-[#1c1c1c] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff00] text-lg"
                />
              </div>
            </div>

            <div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="E-posta Adresi"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#1c1c1c] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff00] text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Ülke"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-[#1c1c1c] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff00] text-lg"
                />
              </div>
              <div>
                <div className="flex">
                  <select className="px-3 py-3 bg-[#1c1c1c] border border-gray-800 rounded-l-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c1ff00] text-lg">
                    <option>+90</option>
                    <option>+44</option>
                    <option>+1</option>
                  </select>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Telefon"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-[#1c1c1c] border border-gray-800 rounded-r-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff00] text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Şifre"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#1c1c1c] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff00] text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Şifre Tekrar"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#1c1c1c] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff00] text-lg"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-800 bg-[#1c1c1c] text-[#c1ff00] focus:ring-[#c1ff00] focus:ring-offset-[#121212]"
                />
                <span className="ml-2 text-sm text-gray-300">
                  Kullanım şartlarını ve gizlilik politikasını kabul ediyorum
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#c1ff00] text-black py-3 px-4 rounded-xl hover:bg-[#a8e600] transition-colors focus:outline-none focus:ring-2 focus:ring-[#c1ff00] focus:ring-offset-2 focus:ring-offset-[#121212] mt-4"
            >
              Kayıt Ol
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Zaten bir hesabınız var mı?{" "}
              <a href="/login" className="text-[#c1ff00] hover:underline">
                Giriş yapın
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

