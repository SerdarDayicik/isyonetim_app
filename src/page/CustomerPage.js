"use client"

import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { ProjectDetailsModal } from "../components/project-details-modal"
import { InvoiceModal } from "../components/invoice-modal"
import { useScrollAnimation } from "../hooks/use-scroll-animation"
import { AnimatedCard } from "../components/animated-card"
import "../globals.css"
import { Calendar, Clock, DollarSign, FileText, Search, User } from "lucide-react"

export default function CustomerPage() {
  const location = useLocation()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [animationTriggered, setAnimationTriggered] = useState(false)
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation()

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
    // Sayfa yüklendiğinde animasyonu tetikle
    setAnimationTriggered(true)
  }, [location.state])

  // Örnek proje verileri
  const projects = [
    {
      id: 1,
      name: "Kurumsal Web Sitesi Yenileme",
      description: "Şirket web sitesinin modern tasarımla yenilenmesi",
      price: 15000,
      status: "devam-ediyor", // devam-ediyor, tamamlandi, beklemede
      progress: 65,
      startDate: "10 Ocak 2025",
      deadline: "20 Mayıs 2025",
      contractor: "Web Tasarım Ltd.",
      hasDocuments: true,
      hasInvoice: true,
    },
    {
      id: 2,
      name: "Sosyal Medya Yönetimi",
      description: "6 aylık sosyal medya içerik ve reklam yönetimi",
      price: 24000,
      status: "tamamlandi",
      progress: 100,
      startDate: "5 Eylül 2024",
      deadline: "5 Mart 2025",
      contractor: "Dijital Pazarlama A.Ş.",
      hasDocuments: true,
      hasInvoice: true,
    },
    {
      id: 3,
      name: "Mobil Uygulama Geliştirme",
      description: "Müşteri sadakat programı mobil uygulaması",
      price: 45000,
      status: "beklemede",
      progress: 30,
      startDate: "15 Şubat 2025",
      deadline: "15 Ağustos 2025",
      contractor: "Mobil Yazılım Çözümleri",
      hasDocuments: true,
      hasInvoice: false,
    },
    {
      id: 4,
      name: "SEO Optimizasyonu",
      description: "Arama motoru optimizasyonu ve içerik stratejisi",
      price: 8500,
      status: "devam-ediyor",
      progress: 40,
      startDate: "1 Mart 2025",
      deadline: "1 Haziran 2025",
      contractor: "SEO Uzmanları",
      hasDocuments: false,
      hasInvoice: true,
    },
    {
      id: 5,
      name: "Logo ve Kurumsal Kimlik Tasarımı",
      description: "Şirket logosu ve kurumsal kimlik tasarımı",
      price: 12000,
      status: "tamamlandi",
      progress: 100,
      startDate: "20 Kasım 2024",
      deadline: "20 Aralık 2024",
      contractor: "Kreatif Tasarım Stüdyosu",
      hasDocuments: true,
      hasInvoice: true,
    },
    {
      id: 6,
      name: "E-Ticaret Entegrasyonu",
      description: "Mevcut web sitesine e-ticaret özelliklerinin eklenmesi",
      price: 18500,
      status: "beklemede",
      progress: 15,
      startDate: "5 Nisan 2025",
      deadline: "5 Temmuz 2025",
      contractor: "E-Ticaret Çözümleri",
      hasDocuments: true,
      hasInvoice: false,
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

  const openProjectDetails = (project) => {
    setSelectedProject(project)
    setIsDetailsModalOpen(true)
  }

  const openInvoiceModal = (project) => {
    setSelectedProject(project)
    setIsInvoiceModalOpen(true)
  }
  // Token'ı localStorage'dan al
  const token = localStorage.getItem("token")

  // Token varsa, JWT'den role bilgisini çıkar
  const role = token ? JSON.parse(atob(token.split(".")[1]))?.role : null

  useEffect(() => {
    console.log("Role bilgisi: ", role)
  }, [role])

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Sidebar Active="projects" ActiveSubItem="customer" ProjectOpen={true} role={role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div
          ref={headerRef}
          className={`bg-black text-white p-5 w-full transition-all duration-700 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold">Müşterisi Olduğum Projeler</h2>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Search and Filter */}
          <AnimatedCard delay={100}>
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-all duration-300 focus:shadow-md"
                  placeholder="Proje ara..."
                />
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 transition-all duration-300 focus:shadow-md">
                  <option value="">Tüm Durumlar</option>
                  <option value="devam-ediyor">Devam Eden</option>
                  <option value="tamamlandi">Tamamlanan</option>
                  <option value="beklemede">Bekleyen</option>
                </select>

                <span className="text-sm text-gray-500">Toplam {projects.length} proje</span>
              </div>
            </div>
          </AnimatedCard>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const statusDetails = getStatusDetails(project.status)

              return (
                <AnimatedCard key={project.id} delay={200 + index * 100}>
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]">
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
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Project Name and Description */}
                      <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>

                      {/* Price and Dates */}
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                          <span className="font-medium">{project.price.toLocaleString("tr-TR")} ₺</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                          <span>Başlangıç: {project.startDate}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="w-5 h-5 mr-2 text-gray-500" />
                          <span>Teslim: {project.deadline}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <User className="w-5 h-5 mr-2 text-gray-500" />
                          <span>{project.contractor}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                        <button
                          className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                          onClick={() => openProjectDetails(project)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Detaylar
                        </button>

                        {project.hasInvoice && (
                          <button
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-all duration-300 hover:scale-105"
                            onClick={() => openInvoiceModal(project)}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Fatura
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              )
            })}
          </div>
        </div>
      </div>

      {/* Proje Detayları Modal */}
      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        project={selectedProject}
      />

      {/* Fatura Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        project={selectedProject}
      />
    </div>
  )
}

