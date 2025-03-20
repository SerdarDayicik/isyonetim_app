"use client"

import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import "../globals.css"
import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Filter,
  MessageSquare,
  Search,
  Trash2,
  User,
  Users,
} from "lucide-react"

export default function Notification() {
  const location = useLocation()
  const [activeFilter, setActiveFilter] = useState("tumu")
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }

    // Bildirim verilerini yükle
    setIsLoading(true)
    setTimeout(() => {
      setNotifications(sampleNotifications)
      setIsLoading(false)
    }, 500)
  }, [location.state])

  // Bildirimleri filtrele
  const filteredNotifications = notifications.filter((notification) => {
    // Arama sorgusuna göre filtrele
    if (
      searchQuery &&
      !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notification.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Kategoriye göre filtrele
    if (activeFilter !== "tumu" && notification.type !== activeFilter) {
      return false
    }

    return true
  })

  // Okunmamış bildirim sayısı
  const unreadCount = notifications.filter((n) => !n.read).length

  // Bildirim türüne göre simge ve renk belirle
  const getNotificationIcon = (type) => {
    switch (type) {
      case "proje":
        return <FileText className="w-5 h-5 text-blue-500" />
      case "mesaj":
        return <MessageSquare className="w-5 h-5 text-green-500" />
      case "gorev":
        return <CheckCircle className="w-5 h-5 text-purple-500" />
      case "sistem":
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case "takvim":
        return <Calendar className="w-5 h-5 text-red-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  // Bildirimi okundu olarak işaretle
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Bildirimi sil
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    toast.success("Bildirim silindi")
  }

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    toast.success("Tüm bildirimler okundu olarak işaretlendi")
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
      <Sidebar Active="notifications" role={role}/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="bg-black text-white p-5 w-full">
          <h2 className="text-2xl font-bold">Bildirimler</h2>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Üst Bilgi ve Filtreler */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium">
                Bildirimleriniz
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-sm bg-red-100 text-red-800 rounded-full">
                    {unreadCount} yeni
                  </span>
                )}
              </h3>

              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800">
                  Tümünü okundu işaretle
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrele
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>

                {/* Filtre dropdown menüsü burada olacak */}
              </div>
            </div>
          </div>

          {/* Arama ve Kategori Filtreleri */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Bildirimlerde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setActiveFilter("tumu")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${
                  activeFilter === "tumu" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setActiveFilter("proje")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${
                  activeFilter === "proje" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                }`}
              >
                Projeler
              </button>
              <button
                onClick={() => setActiveFilter("mesaj")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${
                  activeFilter === "mesaj" ? "bg-green-600 text-white" : "bg-green-50 text-green-800 hover:bg-green-100"
                }`}
              >
                Mesajlar
              </button>
              <button
                onClick={() => setActiveFilter("gorev")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${
                  activeFilter === "gorev"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-50 text-purple-800 hover:bg-purple-100"
                }`}
              >
                Görevler
              </button>
              <button
                onClick={() => setActiveFilter("sistem")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${
                  activeFilter === "sistem"
                    ? "bg-orange-600 text-white"
                    : "bg-orange-50 text-orange-800 hover:bg-orange-100"
                }`}
              >
                Sistem
              </button>
              <button
                onClick={() => setActiveFilter("takvim")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${
                  activeFilter === "takvim" ? "bg-red-600 text-white" : "bg-red-50 text-red-800 hover:bg-red-100"
                }`}
              >
                Takvim
              </button>
            </div>
          </div>

          {/* Bildirim Listesi */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Bildirim Bulunamadı</h3>
              <p className="text-gray-500 max-w-md">
                {searchQuery
                  ? "Arama kriterlerinize uygun bildirim bulunamadı. Lütfen farklı bir arama terimi deneyin."
                  : "Bu kategoride henüz bildiriminiz bulunmuyor."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 transition-all ${notification.read ? "bg-white" : "bg-blue-50"}`}
                >
                  <div className="flex items-start gap-4">
                    {/* İkon */}
                    <div className="p-2 bg-gray-100 rounded-full">{getNotificationIcon(notification.type)}</div>

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`font-medium ${notification.read ? "text-gray-900" : "text-black"}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notification.time}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-2">{notification.content}</p>

                      {/* İlgili Proje veya Kişi */}
                      {notification.relatedTo && (
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          {notification.relatedToType === "project" ? (
                            <FileText className="w-3 h-3 mr-1" />
                          ) : notification.relatedToType === "user" ? (
                            <User className="w-3 h-3 mr-1" />
                          ) : notification.relatedToType === "team" ? (
                            <Users className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          <span>{notification.relatedTo}</span>
                        </div>
                      )}

                      {/* Eylemler */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-2">
                          {notification.actions &&
                            notification.actions.map((action, index) => (
                              <button
                                key={index}
                                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                              >
                                {action}
                              </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                              title="Okundu olarak işaretle"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                            title="Bildirimi sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Daha Fazla Yükle Butonu */}
              {filteredNotifications.length >= 10 && (
                <div className="flex justify-center mt-6">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Daha Fazla Yükle
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Örnek bildirim verileri
const sampleNotifications = [
  {
    id: 1,
    type: "proje",
    title: "Proje Güncellemesi",
    content: "E-Ticaret Web Sitesi projesinde ilerleme %75'e ulaştı.",
    time: "10 dakika önce",
    read: false,
    relatedTo: "E-Ticaret Web Sitesi",
    relatedToType: "project",
    actions: ["Projeyi Görüntüle"],
  },
  {
    id: 2,
    type: "mesaj",
    title: "Yeni Mesaj",
    content: "Ahmet Yılmaz size bir mesaj gönderdi: 'Toplantı notlarını paylaşabilir misiniz?'",
    time: "30 dakika önce",
    read: false,
    relatedTo: "Ahmet Yılmaz",
    relatedToType: "user",
    actions: ["Yanıtla", "Profili Görüntüle"],
  },
  {
    id: 3,
    type: "gorev",
    title: "Görev Atandı",
    content: "Size 'Frontend geliştirme' görevi atandı. Teslim tarihi: 25 Mayıs 2025",
    time: "2 saat önce",
    read: false,
    relatedTo: "Mobil Uygulama Geliştirme",
    relatedToType: "project",
    actions: ["Görevi Görüntüle", "Kabul Et"],
  },
  {
    id: 4,
    type: "sistem",
    title: "Sistem Bakımı",
    content: "Sistem bakımı nedeniyle 15 Nisan 2025 tarihinde 02:00-04:00 saatleri arasında hizmet verilmeyecektir.",
    time: "5 saat önce",
    read: true,
    actions: ["Detayları Görüntüle"],
  },
  {
    id: 5,
    type: "takvim",
    title: "Toplantı Hatırlatması",
    content: "Yarın saat 14:00'te 'Proje İlerleme Toplantısı' var.",
    time: "12 saat önce",
    read: true,
    relatedTo: "Proje İlerleme Toplantısı",
    relatedToType: "event",
    actions: ["Takvime Ekle", "Detayları Görüntüle"],
  },
  {
    id: 6,
    type: "proje",
    title: "Proje Tamamlandı",
    content: "CRM Sistemi Entegrasyonu projesi başarıyla tamamlandı.",
    time: "1 gün önce",
    read: true,
    relatedTo: "CRM Sistemi Entegrasyonu",
    relatedToType: "project",
    actions: ["Projeyi Görüntüle", "Raporu İndir"],
  },
  {
    id: 7,
    type: "mesaj",
    title: "Yeni Mesaj",
    content: "Mehmet Kaya size bir mesaj gönderdi: 'Bütçe raporunu onayladım, teşekkürler.'",
    time: "1 gün önce",
    read: true,
    relatedTo: "Mehmet Kaya",
    relatedToType: "user",
    actions: ["Yanıtla"],
  },
  {
    id: 8,
    type: "gorev",
    title: "Görev Tamamlandı",
    content: "'SEO analizi' görevi Zeynep Demir tarafından tamamlandı.",
    time: "2 gün önce",
    read: true,
    relatedTo: "SEO Optimizasyonu",
    relatedToType: "project",
    actions: ["İncele", "Onay Ver"],
  },
  {
    id: 9,
    type: "sistem",
    title: "Güvenlik Güncellemesi",
    content: "Hesap güvenliğinizi artırmak için iki faktörlü kimlik doğrulamayı etkinleştirin.",
    time: "3 gün önce",
    read: true,
    actions: ["Şimdi Etkinleştir", "Daha Sonra"],
  },
  {
    id: 10,
    type: "takvim",
    title: "Yeni Etkinlik",
    content: "Ekibiniz 'Tasarım Çalıştayı' etkinliğine davet edildi. Tarih: 20 Mayıs 2025",
    time: "4 gün önce",
    read: true,
    relatedTo: "Tasarım Ekibi",
    relatedToType: "team",
    actions: ["Katıl", "Reddet"],
  },
  {
    id: 11,
    type: "proje",
    title: "Yeni Proje",
    content: "Yeni bir proje oluşturuldu: 'Mobil Uygulama Yenileme'",
    time: "5 gün önce",
    read: true,
    relatedTo: "Mobil Uygulama Yenileme",
    relatedToType: "project",
    actions: ["Projeyi Görüntüle"],
  },
  {
    id: 12,
    type: "mesaj",
    title: "Yeni Mesaj",
    content: "Ayşe Kara size ve 3 kişiye daha mesaj gönderdi: 'Haftalık rapor hazır, inceleyebilir misiniz?'",
    time: "6 gün önce",
    read: true,
    relatedTo: "Ayşe Kara",
    relatedToType: "user",
    actions: ["Yanıtla", "Raporu Görüntüle"],
  },
]

