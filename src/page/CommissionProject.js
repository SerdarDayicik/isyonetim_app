"use client"

import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { ProjectDetailsModal } from "../components/project-details-modal"
import { TeamModal } from "../components/team-modal"
import { useCounter } from "../hooks/use-counter"
import { AnimatedCard } from "../components/animated-card"
import { useScrollAnimation } from "../hooks/use-scroll-animation"
import "../globals.css"
import { Calendar, Clock, FileText, Percent, Search, User, Users } from "lucide-react"
// CommissionModal'ı import edelim
import { CommissionModal } from "../components/commission-modal"

export default function CommissionProject() {
  const API_KEY = process.env.REACT_APP_API_URL

  const location = useLocation()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  // State'e isCommissionModalOpen ekleyelim
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation()

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])

  // Sabit kodlanmış projects dizisini tamamen kaldırıp, useState ile boş bir dizi olarak başlatın
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [animationTriggered, setAnimationTriggered] = useState(false)

  // Token'ı localStorage'dan al
  const token = localStorage.getItem("token")

  // Token varsa, JWT'den role bilgisini çıkar
  const role = token ? JSON.parse(atob(token.split(".")[1]))?.role : null

  // API'den verileri çekmek için useEffect kullanın
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(`${API_KEY}/Commission/view_commission`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token, // Token'ı body içinde gönderiyoruz
          }),
        })

        if (!response.ok) {
          throw new Error("API isteği başarısız oldu")
        }

        const data = await response.json()
        console.log("API yanıtı:", data)

        if (data.assigned_commissions && Array.isArray(data.assigned_commissions)) {
          // API'den gelen verileri UI formatına dönüştür
          const formattedProjects = data.assigned_commissions.map((item) => {
            // Tarih formatını düzenle
            const startDate = new Date(item.start_time)
            const formattedStartDate = startDate.toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })

            // Durum ID'sine göre durum belirle
            let status = "beklemede"
            if (item.state_id === 1) status = "devam-ediyor"
            else if (item.state_id === 2) status = "tamamlandi"

            // Komisyon oranını hesapla
            const commissionRate = ((item.commission_price / item.price) * 100).toFixed(1)

            return {
              id: item.project_id,
              name: item.project_name,
              description: item.project_description,
              totalPrice: item.price,
              commissionRate: commissionRate,
              commissionAmount: item.commission_price,
              status: status,
              progress: status === "tamamlandi" ? 100 : 50, // Varsayılan ilerleme
              startDate: formattedStartDate,
              deadline: item.end_time
                ? new Date(item.end_time).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Belirtilmemiş",
              client: "Müşteri bilgisi API'de yok",
              contractor: "Yüklenici bilgisi API'de yok",
              paymentStatus: "kısmi-ödeme", // Varsayılan ödeme durumu
              workerCount: item.worker_count,
              workers: item.workers || [],
              commissioners: item.commissioners || [],
            }
          })

          setProjects(formattedProjects)
          // Veriler yüklendikten sonra animasyonu tetikle
          setAnimationTriggered(true)
        } else {
          console.error("API yanıtı beklenen formatta değil:", data)
          toast.error("API yanıtı beklenen formatta değil")
          setProjects([])
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error)
        toast.error("Projeler yüklenirken bir hata oluştu")
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchProjects()
    } else {
      toast.error("Oturum bilgisi bulunamadı")
      setIsLoading(false)
    }
  }, [token])

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

  // Animasyonlu sayaçlar
  const totalCommissionCounter = useCounter(0, 1500)
  const paidCommissionCounter = useCounter(0, 1500)
  const pendingCommissionCounter = useCounter(0, 1500)

  useEffect(() => {
    if (animationTriggered) {
      totalCommissionCounter.setValue(totalCommission)
      paidCommissionCounter.setValue(paidCommission)
      pendingCommissionCounter.setValue(pendingCommission)
    }
  }, [animationTriggered, totalCommission, paidCommission, pendingCommission])

  const openProjectDetails = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const openTeamModal = (project) => {
    setSelectedProject(project)
    setIsTeamModalOpen(true)
  }

  // openCommissionModal fonksiyonunu ekleyelim
  const openCommissionModal = (project) => {
    setSelectedProject(project)
    setIsCommissionModalOpen(true)
  }

  useEffect(() => {
    console.log("Role bilgisi: ", role)
  }, [role])

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Sidebar Active="projects" ActiveSubItem="broker" ProjectOpen={true} role={role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div
          ref={headerRef}
          className={`bg-black text-white p-5 w-full transition-all duration-700 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold">Komisyoncusu Olduğum Projeler</h2>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Komisyon Özeti */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnimatedCard delay={100}>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Toplam Komisyon</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(totalCommissionCounter.value).toLocaleString("tr-TR")} ₺
                </p>
                <p className="text-sm text-gray-500 mt-1">{projects.length} projeden</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={200}>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Ödenen Komisyon</h3>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(paidCommissionCounter.value).toLocaleString("tr-TR")} ₺
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {projects.filter((p) => p.paymentStatus === "ödendi").length} projeden
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={300}>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Bekleyen Komisyon</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(pendingCommissionCounter.value).toLocaleString("tr-TR")} ₺
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {projects.filter((p) => p.paymentStatus !== "ödendi").length} projeden
                </p>
              </div>
            </AnimatedCard>
          </div>

          {/* Search and Filter */}
          <AnimatedCard delay={400}>
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

                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 transition-all duration-300 focus:shadow-md">
                  <option value="">Tüm Ödemeler</option>
                  <option value="ödendi">Ödenen</option>
                  <option value="kısmi-ödeme">Kısmi Ödenen</option>
                  <option value="ödenmedi">Ödenmeyen</option>
                </select>
              </div>
            </div>
          </AnimatedCard>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              </div>
            ) : projects.length === 0 ? (
              <AnimatedCard>
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">Henüz komisyoncusu olduğunuz proje bulunmamaktadır.</p>
                </div>
              </AnimatedCard>
            ) : (
              projects.map((project, index) => {
                const statusDetails = getStatusDetails(project.status)
                const paymentStatusDetails = getPaymentStatusDetails(project.paymentStatus)

                return (
                  <AnimatedCard key={project.id} delay={500 + index * 100}>
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

                        {/* Commission Details */}
                        <div className="p-3 bg-gray-50 rounded-lg mb-4 hover:bg-gray-100 transition-colors">
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
                            <span className={`font-medium ${paymentStatusDetails.color}`}>
                              {paymentStatusDetails.text}
                            </span>
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
                            <Users className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-sm">
                              Çalışan Sayısı: <span className="font-medium">{project.workerCount}</span>
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
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                            onClick={() => openProjectDetails(project)}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Detaylar
                          </button>

                          <button
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-all duration-300 hover:scale-105"
                            onClick={() => openTeamModal(project)}
                          >
                            <Users className="w-4 h-4 mr-1" />
                            Ekip
                          </button>

                          <button
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-all duration-300 hover:scale-105"
                            onClick={() => openCommissionModal(project)}
                          >
                            <Percent className="w-4 h-4 mr-1" />
                            Komisyon
                          </button>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Proje Detayları Modal */}
      <ProjectDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} project={selectedProject} />

      {/* Ekip Bilgileri Modal */}
      <TeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} project={selectedProject} />

      {/* Komisyon Bilgileri Modal */}
      <CommissionModal
        isOpen={isCommissionModalOpen}
        onClose={() => setIsCommissionModalOpen(false)}
        project={selectedProject}
      />
    </div>
  )
}

