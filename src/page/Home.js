"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Briefcase,
  Users,
  FileText,
  Award,
  ArrowRight,
  ChevronRight,
  Shield,
  Bell,
  Clock,
  X,
  BarChart2,
  User,
  Settings,
  MessageSquare,
  Zap,
  HeartPulse,
  BookOpen,
  ClipboardList,
  CheckCircle,
  Loader
} from "lucide-react"
import "../globals.css"

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true) // Başlangıçta true olarak ayarlandı
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false)
  const [employeeOfMonth, setEmployeeOfMonth] = useState(null)
  const [pageReady, setPageReady] = useState(false) // Sayfa hazır olduğunda true olacak

  const API_KEY = process.env.REACT_APP_API_URL


  // Token'ı localStorage'dan al
  const token = localStorage.getItem("token")
  // Token varsa, JWT'den role ve name bilgisini çıkar
  const role = token ? JSON.parse(atob(token.split(".")[1]))?.role : null

  useEffect(() => {
    // Sayfa yüklenirken önce çalışanları getir, sonra sayfayı göster
    const initPage = async () => {
      try {
        setIsLoading(true);
        
        // Location state mesajını işle
        if (location.state?.message) {
          toast.success(location.state.message)
        }

        // Kullanıcı adını ve rolünü al
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]))
          setUserName(decodedToken.name || "Kullanıcı")
          
          // Role göre Türkçe rol adı belirle
          let roleName = "Üye"
          if (decodedToken.role === "admin") roleName = "Yönetici"
          else if (decodedToken.role === "commissioner") roleName = "Komisyoncu"
          else if (decodedToken.role === "worker") roleName = "Çalışan"
          
          setUserRole(roleName)
        }

        // Çalışanları çek
        await fetchEmployees();
        
        // Tüm veriler yüklendikten sonra sayfayı hazır hale getir
        setPageReady(true);
      } catch (error) {
        console.error("Sayfa yüklenirken hata:", error);
        // Hata durumunda da sayfayı göster
        setPageReady(true);
      } finally {
        setIsLoading(false);
      }
    };

    initPage();
  }, [location.state, token])

  // Çalışanları getir
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_KEY}/User/get_users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Çalışanlar getirilemedi.")
      }

      const data = await response.json()
      console.log("Çalışanlar:", data)

      // Her çalışana avatar ekle
      const employeesWithAvatars = data.map(employee => ({
        ...employee,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&color=fff`
      }))

      setEmployees(employeesWithAvatars)

      // Rastgele bir çalışanı ayın elemanı olarak seç
      if (employeesWithAvatars.length > 0) {
        const randomIndex = Math.floor(Math.random() * employeesWithAvatars.length)
        const selectedEmployee = employeesWithAvatars[randomIndex]
        
        setEmployeeOfMonth({
          ...selectedEmployee,
          role: "Kıdemli Yazılım Geliştirici", // Varsayılan rol
          description: "Projelerinde gösterdiği olağanüstü performans ve ekip çalışması için ödüllendirilmiştir.",
          achievements: [
            "Zamanında teslim edilen projeler",
            "Mükemmel ekip çalışması",
            "Müşteri memnuniyeti odaklı çalışma"
          ]
        })
      }
    } catch (error) {
      console.error("Çalışanlar yüklenirken hata:", error)
      // Hata durumunda varsayılan ayın elemanı bilgisi
      setEmployeeOfMonth({
        name: "Ahmet Yılmaz",
        role: "Kıdemli Yazılım Geliştirici",
        image: "https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=random&color=fff",
        description: "Projelerinde gösterdiği olağanüstü performans ve ekip çalışması için ödüllendirilmiştir.",
        achievements: [
          "Zamanında teslim edilen projeler",
          "Mükemmel ekip çalışması", 
          "Müşteri memnuniyeti odaklı çalışma"
        ]
      })
    }
  }

  // Ana kartlar
  const mainCards = [
    {
      id: "company-info",
      title: "Kurumsal Bilgiler",
      description: "Şirket hakkında genel bilgiler ve kurumsal dokümanlar",
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      bgPattern: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]",
      path: "/company-info",
      stats: "%100 İş Güvenliği"
    },
    {
      id: "employees",
      title: "Çalışanlar",
      description: "Ekip üyeleri ve organizasyon yapısı",
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      bgPattern: "bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))]",
      path: "#",
      action: () => setIsEmployeeModalOpen(true),
      stats: `${employees.length} takım üyesi`
    },
    {
      id: "security",
      title: "İş Güvenliği",
      description: "İş sağlığı ve güvenliği prosedürleri",
      icon: Shield,
      color: "from-emerald-500 to-emerald-600",
      bgPattern: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]",
      path: "/security",
      stats: "0 İş Kazası"
    }
  ]

  // Yönetici kartları
  const adminCards = [
    {
      id: "manage-projects",
      title: "Proje Yönetimi",
      description: "Tüm projeleri görüntüleyin ve yönetin",
      icon: FileText,
      color: "from-rose-500 to-rose-600",
      bgPattern: "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]",
      path: "/Project/AdministratorProject"
    },
    {
      id: "analytics",
      title: "Performans Takibi",
      description: "Şirket performans analizlerini görüntüleyin",
      icon: BarChart2,
      color: "from-amber-500 to-amber-600",
      bgPattern: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]",
      path: "/analytics"
    }
  ]

  // Komisyoncu kartları
  const commissionerCards = [
    {
      id: "commissions",
      title: "Komisyon Yönetimi",
      description: "Komisyoncusu olduğunuz projeleri görüntüleyin",
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      bgPattern: "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]",
      path: "/Project/CommissionProject"
    }
  ]

  // Hızlı erişim butonları
  const quickLinks = [
    { name: "Bildirimler", icon: Bell, path: "/notifications" },
    { name: "Ayarlar", icon: Settings, path: "/settings" },
    { name: "İletişim", icon: MessageSquare, path: "/contact" }
  ]

  // Eğer sayfa hazır değilse, yükleme ekranını göster
  if (!pageReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Hero Bölümü */}
      <div className="py-16 px-6 md:px-10 lg:px-16 bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Hoş Geldiniz, {userName}!</h1>
              <p className="text-lg text-indigo-100">
                Kurumsal iş yönetim sistemimize hoş geldiniz.
                {userRole && <span className="block mt-2">Şu anda <span className="font-semibold">{userRole}</span> olarak giriş yaptınız.</span>}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-8">
                {quickLinks.map((link) => (
                  <button 
                    key={link.name}
                    onClick={() => navigate(link.path)}
                    className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full py-2 px-4 text-sm font-medium transition duration-300"
                  >
                    <link.icon className="w-4 h-4 mr-2" />
                    {link.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-400 rounded-full opacity-40 blur-xl"></div>
                <div className="w-80 h-60 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center relative z-10">
                  <div className="text-white text-xl font-bold">İş Yönetim Sistemi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 pb-16">
          {/* Ana Kartlar */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Hızlı Erişim</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => card.action ? card.action() : navigate(card.path)}
                  className={`${card.bgPattern} ${card.color} text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group h-64 relative`}
                >
                  <div className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <card.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                      <p className="text-white text-opacity-90">{card.description}</p>
                      {card.stats && (
                        <div className="mt-2 inline-block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
                          {card.stats}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end items-center mt-4">
                      <span className="text-white text-opacity-80 group-hover:text-opacity-100 font-medium flex items-center transition-all duration-300">
                        Görüntüle <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                  
                  {/* Dekoratif desen */}
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white bg-opacity-10 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Özel Kartlar */}
          {role === "admin" && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Yönetici Araçları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => navigate(card.path)}
                    className={`${card.bgPattern} ${card.color} text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group h-40 relative`}
                  >
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div className="flex items-start">
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                          <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-1">{card.title}</h3>
                          <p className="text-white text-opacity-90">{card.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end items-center">
                        <span className="text-white text-opacity-80 group-hover:text-opacity-100 font-medium flex items-center transition-all duration-300">
                          Görüntüle <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </div>
                    </div>
                    
                    {/* Dekoratif desen */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Komisyoncu kartları */}
          {role === "commissioner" && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Komisyoncu Araçları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {commissionerCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => navigate(card.path)}
                    className={`${card.bgPattern} ${card.color} text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group h-40 relative`}
                  >
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div className="flex items-start">
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                          <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-1">{card.title}</h3>
                          <p className="text-white text-opacity-90">{card.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end items-center">
                        <span className="text-white text-opacity-80 group-hover:text-opacity-100 font-medium flex items-center transition-all duration-300">
                          Görüntüle <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </div>
                    </div>
                    
                    {/* Dekoratif desen */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kurumsal Değerlerimiz */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Kurumsal Değerlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-red-100 rounded-lg mr-3">
                    <HeartPulse className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">İş Sağlığı</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Çalışanlarımızın sağlığı ve güvenliği bizim için her şeyden önemlidir.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Düzenli sağlık kontrolleri</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Ergonomik çalışma alanları</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Stres yönetimi programları</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">İş Güvenliği</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Sıfır kaza hedefi ile çalışıyoruz. İş güvenliği konusunda taviz vermiyoruz.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Düzenli güvenlik eğitimleri</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Risk değerlendirme süreçleri</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Güvenlik ekipmanları</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-lg mr-3">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Mesleki Gelişim</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Çalışanlarımızın sürekli gelişimini destekliyoruz.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Eğitim programları</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Sertifika desteği</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Mentorluk programları</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ayın Elemanı */}
          {employeeOfMonth && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ayın Elemanı</h2>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="md:col-span-1 flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-lg opacity-30"></div>
                      <img 
                        src={employeeOfMonth.avatar || employeeOfMonth.image} 
                        alt={employeeOfMonth.name} 
                        className="w-40 h-40 rounded-full border-4 border-white shadow-md relative z-10"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-gray-900">{employeeOfMonth.name}</h3>
                      <p className="text-gray-600">{employeeOfMonth.role}</p>
                      
                      <div className="mt-4 flex items-center justify-center">
                        <Award className="w-6 h-6 text-yellow-500 mr-2" />
                        <span className="font-medium text-yellow-600">Ayın Elemanı</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100">
                      <p className="text-gray-700 mb-4">{employeeOfMonth.description}</p>
                      
                      <h4 className="font-medium text-gray-900 mb-3">Başarıları:</h4>
                      <ul className="space-y-2">
                        {employeeOfMonth.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Önemli Duyurular */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Önemli Duyurular</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">İSG Eğitimi: İş Güvenliği Farkındalık Haftası</h3>
                  <p className="text-gray-700 mb-4">
                    25-29 Nisan tarihleri arasında düzenlenecek olan İş Güvenliği Farkındalık Haftası kapsamında
                    tüm çalışanlarımıza özel eğitimler verilecektir. Katılımınız zorunludur.
                  </p>
                  <button 
                    onClick={() => navigate("/announcements")}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    Detayları Gör <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-16 text-center text-gray-500 text-sm">
            <p>© 2025 Stajyerler. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>

      {/* Çalışanlar Modalı */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Çalışanlar</h3>
                <button 
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                </div>
              ) : employees.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  Çalışan bulunamadı.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employees.map((employee) => (
                    <div key={employee.id || employee.user_id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <img 
                        src={employee.avatar} 
                        alt={employee.name} 
                        className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{employee.name}</h4>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                      </div>
                      {employee.role && (
                        <span className="ml-auto px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {employee.role === "admin" ? "Yönetici" : 
                           employee.role === "commissioner" ? "Komisyoncu" : "Çalışan"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}