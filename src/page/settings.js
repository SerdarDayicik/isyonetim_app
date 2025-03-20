"use client"

import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import "../globals.css"
import { Bell, Shield, User, Palette, HelpCircle } from "lucide-react"

export default function Settings() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("profile")
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("tr")
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  })


  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />
      case "security":
        return <SecuritySettings />
      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Bildirim Ayarları</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">E-posta Bildirimleri</h4>
                  <p className="text-sm text-gray-500">Önemli güncellemeler ve etkinlikler hakkında e-posta alın</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange("email")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Bildirimleri</h4>
                  <p className="text-sm text-gray-500">Anlık bildirimler alın</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange("push")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Bildirimleri</h4>
                  <p className="text-sm text-gray-500">Kritik güncellemeler için SMS alın</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.sms}
                    onChange={() => handleNotificationChange("sms")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )
      case "appearance":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Görünüm Ayarları</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Karanlık Mod</h4>
                  <p className="text-sm text-gray-500">Karanlık temayı etkinleştir</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Dil</h4>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>
        )
      case "help":
        return <HelpSupport />
      default:
        return <ProfileSettings />
    }
  }
      // Token'ı localStorage'dan al
      const token = localStorage.getItem("token")
  
      // Token varsa, JWT'den role bilgisini çıkar
      const role = token ? JSON.parse(atob(token.split('.')[1]))?.role : null
      
      useEffect(() => {
        console.log("Role bilgisi: ", role)
      }, [role])

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Sidebar Active="settings" role={role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Settings sidebar */}
          <div className="w-64 border-r bg-gray-50 overflow-y-auto">
            <nav className="p-4 space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-md ${activeTab === "profile" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <User size={18} />
                <span>Profil</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-md ${activeTab === "security" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <Shield size={18} />
                <span>Güvenlik</span>
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-md ${activeTab === "notifications" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <Bell size={18} />
                <span>Bildirimler</span>
              </button>

              <button
                onClick={() => setActiveTab("appearance")}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-md ${activeTab === "appearance" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <Palette size={18} />
                <span>Görünüm</span>
              </button>

              <button
                onClick={() => setActiveTab("help")}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-md ${activeTab === "help" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <HelpCircle size={18} />
                <span>Yardım ve Destek</span>
              </button>
            </nav>
          </div>

          {/* Settings content */}
          <div className="flex-1 p-6 overflow-y-auto">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  )
}

function ProfileSettings() {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    surname: "",
    phone: "",
    profile_photo_url: null,
    role: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Random avatar URLs for default profile photo
  const randomAvatars = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
    "https://randomuser.me/api/portraits/men/3.jpg",
    "https://randomuser.me/api/portraits/women/4.jpg",
    "https://randomuser.me/api/portraits/men/5.jpg",
  ]

  // Get a random avatar from the list
  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * randomAvatars.length)
    return randomAvatars[randomIndex]
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        // Get token from localStorage
        let token = localStorage.getItem("token")

        if (!token) {
          throw new Error("Token bulunamadı")
        }

        // Remove quotes if present
        token = token.replace(/^"(.*)"$/, "$1")

        const response = await fetch("http://10.33.41.153:8000/Session/user_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
        })

        if (!response.ok) {
          throw new Error("Kullanıcı bilgileri alınamadı")
        }

        const data = await response.json()
        setUserData(data)
      } catch (err) {
        console.error("Kullanıcı bilgileri yüklenirken hata:", err)
        setError(err.message)
        toast.error("Kullanıcı bilgileri yüklenemedi: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Hata: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Yeniden Dene
        </button>
      </div>
    )
  }

  // Use profile photo if available, otherwise use random avatar
  const profilePhoto = userData.profile_photo_url || getRandomAvatar()

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Profil Ayarları</h3>

      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <img src={profilePhoto || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Fotoğraf Değiştir</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
            value={userData.name}
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
            value={userData.surname}
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
            value={userData.email}
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
          <input
            type="tel"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
            value={userData.phone}
            disabled
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Rolü</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
          value={userData.role === "user" ? "Kullanıcı" : userData.role === "admin" ? "Yönetici" : userData.role}
          disabled
        />
      </div>

      <div className="pt-4">
        <button className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed opacity-70">
          Değişiklikleri Kaydet
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Profil bilgilerinizi değiştirmek için lütfen yönetici ile iletişime geçin.
        </p>
      </div>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Güvenlik Ayarları</h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Şifre Değiştir</h4>
          <div className="mt-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Şifreyi Güncelle</button>
          </div>
        </div>

        <div className="pt-6">
          <h4 className="font-medium">İki Faktörlü Kimlik Doğrulama</h4>
          <p className="text-sm text-gray-500 mt-1">
            Hesabınızı korumak için iki faktörlü kimlik doğrulamayı etkinleştirin
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <h5 className="font-medium">SMS ile doğrulama</h5>
              <p className="text-sm text-gray-500">Giriş yaparken SMS kodu alın</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <h5 className="font-medium">Kimlik doğrulama uygulaması</h5>
              <p className="text-sm text-gray-500">Google Authenticator veya benzeri bir uygulama kullanın</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="pt-6">
          <h4 className="font-medium">Oturum Yönetimi</h4>
          <p className="text-sm text-gray-500 mt-1">Aktif oturumlarınızı görüntüleyin ve yönetin</p>

          <div className="mt-4 space-y-3">
            <div className="p-3 border rounded-md flex justify-between items-center">
              <div>
                <div className="font-medium">Chrome / Windows</div>
                <div className="text-sm text-gray-500">İstanbul, Türkiye • Aktif</div>
              </div>
              <button className="text-red-600 hover:text-red-800">Oturumu Kapat</button>
            </div>

            <div className="p-3 border rounded-md flex justify-between items-center">
              <div>
                <div className="font-medium">Safari / macOS</div>
                <div className="text-sm text-gray-500">İstanbul, Türkiye • 2 gün önce</div>
              </div>
              <button className="text-red-600 hover:text-red-800">Oturumu Kapat</button>
            </div>

            <div className="p-3 border rounded-md flex justify-between items-center">
              <div>
                <div className="font-medium">Mobile App / iOS</div>
                <div className="text-sm text-gray-500">İstanbul, Türkiye • 5 saat önce</div>
              </div>
              <button className="text-red-600 hover:text-red-800">Oturumu Kapat</button>
            </div>
          </div>

          <button className="mt-4 px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50">
            Tüm Oturumları Kapat
          </button>
        </div>
      </div>
    </div>
  )
}

function HelpSupport() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Yardım ve Destek</h3>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium">Sık Sorulan Sorular</h4>
          <div className="mt-4 space-y-4">
            <div className="border rounded-md overflow-hidden">
              <button className="flex justify-between items-center w-full p-4 text-left font-medium">
                <span>Şifremi nasıl sıfırlayabilirim?</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="px-4 pb-4">
                <p>
                  Giriş sayfasında "Şifremi Unuttum" seçeneğine tıklayın ve kayıtlı e-posta adresinizi girin. Size şifre
                  sıfırlama bağlantısı içeren bir e-posta göndereceğiz.
                </p>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <button className="flex justify-between items-center w-full p-4 text-left font-medium">
                <span>Yeni bir proje nasıl oluşturabilirim?</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="px-4 pb-4 hidden">
                <p>Ana menüden "Proje Oluştur" seçeneğine tıklayın ve gerekli bilgileri doldurun.</p>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <button className="flex justify-between items-center w-full p-4 text-left font-medium">
                <span>Ekip üyelerini nasıl davet edebilirim?</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="px-4 pb-4 hidden">
                <p>Proje detay sayfasında "Ekip" sekmesine gidin ve "Üye Davet Et" butonuna tıklayın.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium">Bize Ulaşın</h4>
          <p className="text-sm text-gray-500 mt-1">Sorularınız için destek ekibimizle iletişime geçin</p>

          <form className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option>Teknik Destek</option>
                <option>Fatura ve Ödeme</option>
                <option>Hesap Sorunları</option>
                <option>Özellik İsteği</option>
                <option>Diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Sorununuzu detaylı bir şekilde açıklayın..."
              ></textarea>
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Gönder</button>
          </form>
        </div>

        <div>
          <h4 className="font-medium">Dokümantasyon</h4>
          <p className="text-sm text-gray-500 mt-1">Uygulama hakkında detaylı bilgi için dokümantasyonumuza göz atın</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="#" className="p-4 border rounded-md hover:bg-gray-50 flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-md">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="font-medium">Kullanım Kılavuzu</div>
                <div className="text-sm text-gray-500">Temel özellikler ve kullanım</div>
              </div>
            </a>

            <a href="#" className="p-4 border rounded-md hover:bg-gray-50 flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-md">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="font-medium">Öğreticiler</div>
                <div className="text-sm text-gray-500">Adım adım rehberler</div>
              </div>
            </a>

            <a href="#" className="p-4 border rounded-md hover:bg-gray-50 flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-md">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="font-medium">API Dokümantasyonu</div>
                <div className="text-sm text-gray-500">Geliştiriciler için API bilgileri</div>
              </div>
            </a>

            <a href="#" className="p-4 border rounded-md hover:bg-gray-50 flex items-center space-x-3">
              <div className="bg-yellow-100 p-2 rounded-md">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="font-medium">Hızlı Başlangıç</div>
                <div className="text-sm text-gray-500">Yeni başlayanlar için</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

