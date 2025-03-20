"use client"

import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { ProjectDetailsModal } from "../components/project-details-modal"
import "../globals.css"
import { Calendar, Clock, FileText, Percent, Search, User, Users } from "lucide-react"

export default function CommissionProject() {
  const location = useLocation()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])

  // Örnek proje verileri
  const projects = [
    {
      id: 1,
      name: "E-Ticaret Web Sitesi",
      description: "Tam kapsamlı e-ticaret platformu geliştirme",
      totalPrice: 45000,
      commissionRate: 12,
      commissionAmount: 5400,
      status: "devam-ediyor", // devam-ediyor, tamamlandi, beklemede
      progress: 65,
      startDate: "15 Şubat 2025",
      deadline: "15 Haziran 2025",
      client: "ABC Mobilya",
      contractor: "Web Çözümleri Ltd.",
      paymentStatus: "kısmi-ödeme", // ödenmedi, kısmi-ödeme, ödendi
    },
    {
      id: 2,
      name: "Mobil Uygulama Geliştirme",
      description: "iOS ve Android için müşteri sadakat uygulaması",
      totalPrice: 60000,
      commissionRate: 15,
      commissionAmount: 9000,
      status: "tamamlandi",
      progress: 100,
      startDate: "10 Kasım 2024",
      deadline: "10 Mart 2025",
      client: "XYZ Restoran Zinciri",
      contractor: "Mobil Teknoloji A.Ş.",
      paymentStatus: "ödendi",
    },
    {
      id: 3,
      name: "Kurumsal Kimlik Tasarımı",
      description: "Logo, kartvizit ve kurumsal kimlik tasarımı",
      totalPrice: 18000,
      commissionRate: 10,
      commissionAmount: 1800,
      status: "beklemede",
      progress: 25,
      startDate: "5 Mart 2025",
      deadline: "5 Nisan 2025",
      client: "Yeni Nesil Danışmanlık",
      contractor: "Kreatif Tasarım Stüdyosu",
      paymentStatus: "ödenmedi",
    },
    {
      id: 4,
      name: "SEO ve İçerik Stratejisi",
      description: "6 aylık SEO ve içerik pazarlama stratejisi",
      totalPrice: 36000,
      commissionRate: 8,
      commissionAmount: 2880,
      status: "devam-ediyor",
      progress: 40,
      startDate: "1 Ocak 2025",
      deadline: "30 Haziran 2025",
      client: "Delta Elektronik",
      contractor: "Dijital Pazarlama Uzmanları",
      paymentStatus: "kısmi-ödeme",
    },
    {
      id: 5,
      name: "Sosyal Medya Yönetimi",
      description: "12 aylık sosyal medya içerik ve reklam yönetimi",
      totalPrice: 72000,
      commissionRate: 10,
      commissionAmount: 7200,
      status: "devam-ediyor",
      progress: 30,
      startDate: "1 Şubat 2025",
      deadline: "1 Şubat 2026",
      client: "Lüks Moda Butik",
      contractor: "Sosyal Medya Ajansı",
      paymentStatus: "kısmi-ödeme",
    },
    {
      id: 6,
      name: "Yazılım Entegrasyonu",
      description: "CRM ve ERP sistemlerinin entegrasyonu",
      totalPrice: 55000,
      commissionRate: 15,
      commissionAmount: 8250,
      status: "tamamlandi",
      progress: 100,
      startDate: "15 Ekim 2024",
      deadline: "15 Ocak 2025",
      client: "Mega Holding",
      contractor: "Yazılım Çözümleri A.Ş.",
      paymentStatus: "ödendi",
    },
  ]

  // Durum renklerini ve metinlerini belirle
  const getStatusDetails = (status) => {
    switch (status) {
      case "devam-ediyor":
        return { color: "bg-blue-100 text-blue-800", text: "Devam Ediyor" }
      case "tamamlandi":
        return { color: "bg-green-100 text-green-800", text: "Tamamlandı" }
      case "beklemede":
        return { color: "bg-yellow-100 text-yellow-800", text: "Beklemede" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Belirsiz" }
    }
  }

  // Ödeme durumu renklerini ve metinlerini belirle
  const getPaymentStatusDetails = (status) => {
    switch (status) {
      case "ödendi":
        return { color: "text-green-600", text: "Ödendi" }
      case "kısmi-ödeme":
        return { color: "text-orange-600", text: "Kısmi Ödeme" }
      case "ödenmedi":
        return { color: "text-red-600", text: "Ödenmedi" }
      default:
        return { color: "text-gray-600", text: "Belirsiz" }
    }
  }

  // Toplam komisyon tutarını hesapla
  const totalCommission = projects.reduce((total, project) => total + project.commissionAmount, 0)
  const paidCommission = projects
    .filter((project) => project.paymentStatus === "ödendi")
    .reduce((total, project) => total + project.commissionAmount, 0)
  const pendingCommission = totalCommission - paidCommission

  const openProjectDetails = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
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
      <Sidebar Active="projects" ActiveSubItem="broker" ProjectOpen={true} role={role}/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="bg-black text-white p-5 w-full">
          <h2 className="text-2xl font-bold">Komisyoncusu Olduğum Projeler</h2>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Komisyon Özeti */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Toplam Komisyon</h3>
              <p className="text-2xl font-bold text-gray-900">{totalCommission.toLocaleString("tr-TR")} ₺</p>
              <p className="text-sm text-gray-500 mt-1">{projects.length} projeden</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Ödenen Komisyon</h3>
              <p className="text-2xl font-bold text-green-600">{paidCommission.toLocaleString("tr-TR")} ₺</p>
              <p className="text-sm text-gray-500 mt-1">
                {projects.filter((p) => p.paymentStatus === "ödendi").length} projeden
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Bekleyen Komisyon</h3>
              <p className="text-2xl font-bold text-orange-600">{pendingCommission.toLocaleString("tr-TR")} ₺</p>
              <p className="text-sm text-gray-500 mt-1">
                {projects.filter((p) => p.paymentStatus !== "ödendi").length} projeden
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Proje ara..."
              />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5">
                <option value="">Tüm Durumlar</option>
                <option value="devam-ediyor">Devam Eden</option>
                <option value="tamamlandi">Tamamlanan</option>
                <option value="beklemede">Bekleyen</option>
              </select>

              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5">
                <option value="">Tüm Ödemeler</option>
                <option value="ödendi">Ödenen</option>
                <option value="kısmi-ödeme">Kısmi Ödenen</option>
                <option value="ödenmedi">Ödenmeyen</option>
              </select>
            </div>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const statusDetails = getStatusDetails(project.status)
              const paymentStatusDetails = getPaymentStatusDetails(project.paymentStatus)

              return (
                <div
                  key={project.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.color}`}>
                        {statusDetails.text}
                      </span>

                      {project.status !== "tamamlandi" && (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 mr-2">{project.progress}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Project Name and Description */}
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>

                    {/* Commission Details */}
                    <div className="p-3 bg-gray-50 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Proje Tutarı:</span>
                        <span className="font-medium">{project.totalPrice.toLocaleString("tr-TR")} ₺</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Komisyon Oranı:</span>
                        <span className="font-medium">%{project.commissionRate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Komisyon Tutarı:</span>
                        <span className="font-medium text-blue-600">
                          {project.commissionAmount.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                        <span className="text-sm text-gray-500">Ödeme Durumu:</span>
                        <span className={`font-medium ${paymentStatusDetails.color}`}>{paymentStatusDetails.text}</span>
                      </div>
                    </div>

                    {/* Client and Contractor */}
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center text-gray-700">
                        <User className="w-5 h-5 mr-2 text-gray-500" />
                        <span className="text-sm">
                          Müşteri: <span className="font-medium">{project.client}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="w-5 h-5 mr-2 text-gray-500" />
                        <span className="text-sm">
                          Yüklenici: <span className="font-medium">{project.contractor}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                        <span className="text-sm">Başlangıç: {project.startDate}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 mr-2 text-gray-500" />
                        <span className="text-sm">Teslim: {project.deadline}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        onClick={() => openProjectDetails(project)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Detaylar
                      </button>

                      <button className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100">
                        <Percent className="w-4 h-4 mr-1" />
                        Komisyon
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Proje Detayları Modal */}
      <ProjectDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} project={selectedProject} />
    </div>
  )
}

