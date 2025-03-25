"use client"
import { useState, useContext } from "react"
import { CheckCircle, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { AuthContext } from "./context/AuthContext"

const API_KEY = process.env.REACT_APP_API_URL


export default function LoginPage() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log(API_KEY)
      const response = await fetch(`${API_KEY}/Session/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.status === 200) {
        // Başarılı giriş
        const success = login(data.token)

        if (success) {
          // Önce bildirimi göster, sonra yönlendir
          toast.success("Başarıyla giriş yapıldı!")

          // Bildirim gösterildikten sonra yönlendirme için kısa bir gecikme
          setTimeout(() => {
            navigate("/")
          }, 300)
        }
      } else {
        // Sadece hata durumunda bildirim göster
        toast.error(`Giriş Başarısız: ${data.error}`)
      }
    } catch (error) {
      console.error("Hata:", error)
      toast.error("Bağlantı hatası! Lütfen daha sonra tekrar deneyin.")
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
            <img src="/LOGİN.svg" alt="İllüstrasyon" className="w-full h-full object-cover rounded-2xl" />
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
          <h2 className="text-4xl font-bold text-white mb-8">
            Giriş Yap
            <div className="h-1 w-16 bg-[#c1ff00] mt-2"></div>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-800 bg-[#1c1c1c] text-[#c1ff00] focus:ring-[#c1ff00] focus:ring-offset-[#121212]"
                />
                <span className="ml-2 text-sm text-gray-300">Beni hatırla</span>
              </label>
              <a href="https://www.google.com" className="text-sm text-[#c1ff00] hover:underline">
                Şifremi unuttum
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c1ff00] text-black py-4 px-6 rounded-xl hover:bg-[#a8e600] transition-colors focus:outline-none focus:ring-2 focus:ring-[#c1ff00] focus:ring-offset-2 focus:ring-offset-[#121212] text-lg font-medium"
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-[#121212]">veya</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-800 rounded-xl hover:bg-[#1c1c1c] transition-colors text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                Facebook
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-800 rounded-xl hover:bg-[#1c1c1c] transition-colors text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  />
                </svg>
                Google
              </button>
            </div>

            <p className="text-center text-sm text-gray-400 mt-4">
              Hesabınız yok mu?{" "}
              <a href="/register" className="text-[#c1ff00] hover:underline">
                Hemen kayıt olun
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

