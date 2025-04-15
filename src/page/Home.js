"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Briefcase,
  Bell,
  Calendar,
  Users,
  FileText,
  PlusCircle,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Star,
  MessageSquare,
  BarChart2,
  ArrowUpRight,
  Zap,
} from "lucide-react"
import "../globals.css"

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Token'ı localStorage'dan al
  const token = localStorage.getItem("token")
  // Token varsa, JWT'den role ve name bilgisini çıkar
  const role = token ? JSON.parse(atob(token.split(".")[1]))?.role : null

  useEffect(() => {
    // location.state?.message mevcutsa başarılı bir toast göster
    if (location.state?.message) {
      toast.success(location.state.message)
    }

    // Kullanıcı adını ve rolünü al
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]))
      setUserName(decodedToken.name || "Kullanıcı")
      setUserRole(decodedToken.role === "admin" ? "Yönetici" : "Takım Üyesi")
    }

    // Ekip üyelerini çek
    fetchTeamMembers()
  }, [location.state, token])

  // Ekip üyelerini API'den çek
  const fetchTeamMembers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = "http://10.33.41.222:8000/User/get_users"

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!response.ok) {
        throw new Error(`API yanıt hatası: ${response.status}`)
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        throw new Error("API yanıtı beklenen formatta değil")
      }

      // Her kullanıcıya avatar ekle
      const membersWithAvatars = data.map((user, index) => ({
        ...user,
        id: user.id || index + 1,
        avatar:
          user.profile_photo_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
        role: user.role || "Kullanıcı",
      }))

      setTeamMembers(membersWithAvatars)
    } catch (err) {
      console.error("Ekip üyeleri yüklenirken hata:", err)
      setError(err.message)

      // Hata durumunda örnek verilerle devam et
      const fallbackMembers = [
        {
          id: 1,
          name: "Ahmet",
          surname: "Yılmaz",
          role: "admin",
          avatar: "https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=random",
        },
        {
          id: 2,
          name: "Ayşe",
          surname: "Kaya",
          role: "user",
          avatar: "https://ui-avatars.com/api/?name=Ayse+Kaya&background=random",
        },
        {
          id: 3,
          name: "Mehmet",
          surname: "Demir",
          role: "user",
          avatar: "https://ui-avatars.com/api/?name=Mehmet+Demir&background=random",
        },
      ]

      setTeamMembers(fallbackMembers)
    } finally {
      setIsLoading(false)
    }
  }

  // Ana menü öğeleri
  const mainMenuItems = [
    {
      id: "my-projects",
      title: "Projelerim",
      description: "Çalışanı olduğunuz projeleri görüntüleyin ve yönetin",
      icon: Briefcase,
      color: "bg-blue-100 text-blue-600",
      path: "/Project/WorkingProject",
    },
    {
      id: "notifications",
      title: "Bildirimler",
      description: "Proje güncellemeleri ve bildirimlerinizi kontrol edin",
      icon: Bell,
      color: "bg-purple-100 text-purple-600",
      path: "/Project/Notification",
      badge: 4,
    },
    {
      id: "calendar",
      title: "Takvim",
      description: "Toplantılar ve proje takvimlerinizi görüntüleyin",
      icon: Calendar,
      color: "bg-green-100 text-green-600",
      path: "/calendar",
    },
    {
      id: "team",
      title: "Ekip",
      description: "Ekip üyelerini ve iş arkadaşlarınızı görüntüleyin",
      icon: Users,
      color: "bg-orange-100 text-orange-600",
      path: "/settings",
    },
  ]

  // Yönetici menü öğeleri
  const adminMenuItems = [
    {
      id: "create-project",
      title: "Yeni Proje Oluştur",
      description: "Yeni bir proje oluşturun ve ekip atayın",
      icon: PlusCircle,
      color: "bg-indigo-100 text-indigo-600",
      path: "/",
    },
    {
      id: "manage-projects",
      title: "Projeleri Yönet",
      description: "Yöneticisi olduğunuz projeleri yönetin",
      icon: FileText,
      color: "bg-red-100 text-red-600",
      path: "/Project/AdministratorProject",
    },
    {
      id: "settings",
      title: "Ayarlar",
      description: "Sistem ayarlarını ve kullanıcı izinlerini yönetin",
      icon: Settings,
      color: "bg-gray-100 text-gray-600",
      path: "/settings",
    },
  ]

  // Örnek yaklaşan görevler
  const upcomingTasks = [
    {
      id: 1,
      name: "Frontend Geliştirme",
      project: "Kurumsal Web Sitesi Yenileme",
      dueDate: "15 Nisan 2025",
      priority: "yüksek",
    },
    {
      id: 2,
      name: "API Entegrasyonu",
      project: "Mobil Uygulama Geliştirme",
      dueDate: "20 Nisan 2025",
      priority: "orta",
    },
    {
      id: 3,
      name: "Veri Analizi Raporu",
      project: "Veri Analizi ve Raporlama Sistemi",
      dueDate: "25 Nisan 2025",
      priority: "düşük",
    },
  ]

  // Örnek son aktiviteler
  const recentActivities = [
    {
      id: 1,
      user: "Ahmet Yılmaz",
      action: "bir görev tamamladı",
      target: "Frontend Tasarımı",
      project: "Kurumsal Web Sitesi Yenileme",
      time: "10 dakika önce",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      user: "Ayşe Kaya",
      action: "bir yorum ekledi",
      target: "API Dokümantasyonu",
      project: "Mobil Uygulama Geliştirme",
      time: "1 saat önce",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      user: "Mehmet Demir",
      action: "bir dosya yükledi",
      target: "Veritabanı Şeması",
      project: "ERP Sistemi Entegrasyonu",
      time: "3 saat önce",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  // Örnek duyurular
  const announcements = [
    {
      id: 1,
      title: "Yeni Özellik: Gelişmiş Raporlama",
      content:
        "Sistemimize gelişmiş raporlama özellikleri eklenmiştir. Artık projelerinizin performansını daha detaylı analiz edebilirsiniz.",
      date: "2 Nisan 2025",
      type: "feature",
    },
    {
      id: 2,
      title: "Bakım Duyurusu",
      content: "15 Nisan 2025 tarihinde 02:00-04:00 saatleri arasında planlı bakım çalışması yapılacaktır.",
      date: "5 Nisan 2025",
      type: "maintenance",
    },
  ]

  // Örnek proje istatistikleri
  const projectStats = {
    active: 5,
    completed: 3,
    upcoming: 2,
    totalTasks: 45,
    completedTasks: 28,
  }

  // Öncelik renklerini ve metinlerini belirle
  const getPriorityDetails = (priority) => {
    switch (priority) {
      case "düşük":
        return { color: "bg-gray-100 text-gray-800", text: "Düşük" }
      case "orta":
        return { color: "bg-blue-100 text-blue-800", text: "Orta" }
      case "yüksek":
        return { color: "bg-orange-100 text-orange-800", text: "Yüksek" }
      case "kritik":
        return { color: "bg-red-100 text-red-800", text: "Kritik" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Belirsiz" }
    }
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <div className="p-6 overflow-y-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Hoş Geldiniz Bölümü */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Hoş Geldiniz, {userName}!</h1>
          <p className="text-gray-600 mb-4">
            Bugün{" "}
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .{userRole && ` ${userRole} olarak giriş yaptınız.`} Proje yönetim sisteminde size yardımcı olabilecek
            araçlara aşağıdan erişebilirsiniz.
          </p>

          {/* Hızlı İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Aktif Projeler</p>
                  <p className="text-xl font-bold">{projectStats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tamamlanan</p>
                  <p className="text-xl font-bold">{projectStats.completed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Görevler</p>
                  <p className="text-xl font-bold">
                    {projectStats.completedTasks}/{projectStats.totalTasks}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <Bell className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bildirimler</p>
                  <p className="text-xl font-bold">4</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Sütun - Ana Menü */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ana Menü */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ana Menü</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mainMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <div className="flex items-start">
                      <div className={`p-3 rounded-lg ${item.color} mr-4`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    {item.badge && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Yönetici Menüsü (sadece admin rolü için) */}
            {role === "admin" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Yönetici Menüsü</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleNavigate(item.path)}
                    >
                      <div className="flex items-start">
                        <div className={`p-3 rounded-lg ${item.color} mr-4`}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yaklaşan Görevler */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Yaklaşan Görevler</h2>
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  onClick={() => handleNavigate("/tasks")}
                >
                  Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {upcomingTasks.map((task, index) => {
                  const priorityDetails = getPriorityDetails(task.priority)
                  return (
                    <div
                      key={task.id}
                      className={`p-4 flex items-center justify-between ${
                        index !== upcomingTasks.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{task.name}</h3>
                        <p className="text-sm text-gray-500">{task.project}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityDetails.color} mr-3`}>
                          {priorityDetails.text}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {task.dueDate}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sağ Sütun - Aktiviteler ve Duyurular */}
          <div className="space-y-8">
            {/* Duyurular */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Duyurular</h2>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {announcements.map((announcement, index) => (
                  <div
                    key={announcement.id}
                    className={`p-4 ${index !== announcements.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          announcement.type === "feature" ? "bg-green-100" : "bg-yellow-100"
                        }`}
                      >
                        {announcement.type === "feature" ? (
                          <Zap
                            className={`w-5 h-5 ${
                              announcement.type === "feature" ? "text-green-600" : "text-yellow-600"
                            }`}
                          />
                        ) : (
                          <AlertCircle
                            className={`w-5 h-5 ${
                              announcement.type === "feature" ? "text-green-600" : "text-yellow-600"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                        <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Son Aktiviteler */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Son Aktiviteler</h2>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`p-4 ${index !== recentActivities.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <div className="flex items-start">
                      <img
                        src={activity.avatar || "/placeholder.svg"}
                        alt={activity.user}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.project} • {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-3 text-center border-t border-gray-100">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => handleNavigate("/activities")}
                  >
                    Tüm Aktiviteleri Gör
                  </button>
                </div>
              </div>
            </div>

            {/* Ekip Üyeleri */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ekip Üyeleri</h2>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-4 text-red-500">{error}</div>
                ) : (
                  <div className="space-y-4">
                    {teamMembers.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-medium">
                              {member.name} {member.surname || ""}
                            </p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            member.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {member.role === "admin" ? "Yönetici" : "Üye"}
                        </span>
                      </div>
                    ))}

                    <div className="text-center pt-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => handleNavigate("/team")}
                      >
                        Tüm Ekibi Gör
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Öne Çıkan Projeler */}
      <div className="max-w-6xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Öne Çıkan Projeler</h2>
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            onClick={() => handleNavigate("/Project/WorkingProject")}
          >
            Tüm Projeleri Gör <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">E-Ticaret Web Sitesi</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Online satış platformu geliştirme projesi</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">İlerleme: 75%</span>
              <span className="text-gray-500">15 Mayıs 2025</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 mb-3">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              </div>
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                onClick={() => handleNavigate("/project/1")}
              >
                Görüntüle <ArrowUpRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Mobil Uygulama Geliştirme</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">iOS ve Android için müşteri yönetim uygulaması</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">İlerleme: 45%</span>
              <span className="text-gray-500">30 Haziran 2025</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 mb-3">
              <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: "45%" }}></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              </div>
              <button
                className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                onClick={() => handleNavigate("/project/2")}
              >
                Görüntüle <ArrowUpRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BarChart2 className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Veri Analizi ve Raporlama</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Müşteri davranışları analiz ve raporlama platformu</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">İlerleme: 55%</span>
              <span className="text-gray-500">20 Haziran 2025</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 mb-3">
              <div className="bg-green-600 h-1.5 rounded-full" style={{ width: "55%" }}></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              </div>
              <button
                className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                onClick={() => handleNavigate("/project/3")}
              >
                Görüntüle <ArrowUpRight className="w-3 h-3 ml-1" />
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
  )
}

