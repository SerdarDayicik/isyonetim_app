"use client"

import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { ProjectDetailsModal } from "../components/project-details-modal"
import { TeamModal } from "../components/team-modal"
import { useScrollAnimation } from "../hooks/use-scroll-animation"
import { AnimatedCard } from "../components/animated-card"
import "../globals.css"
import {
  BarChart2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react"
import { InvoiceModal } from "../components/invoice-modal"

export default function AdministratorProject() {
  const API_KEY = process.env.REACT_APP_API_URL

  const location = useLocation()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [animationTriggered, setAnimationTriggered] = useState(false)
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation()
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])

  // Token'ı localStorage'dan al
  const token = localStorage.getItem("token")

  // Token varsa, JWT'den role bilgisini çıkar
  const role = token ? JSON.parse(atob(token.split(".")[1]))?.role : null

  // API'den verileri çekmek için useEffect kullanın
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(`${API_KEY}/Project/AdminViewProjects`, {
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

        if (data.projects && Array.isArray(data.projects)) {
          // API'den gelen verileri UI formatına dönüştür
          const formattedProjects = data.projects.map((item) => {
            console.log("İşlenen proje:", item)

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

            // İlerleme değerini hesapla
            const progress = status === "tamamlandi" ? 100 : Math.floor(Math.random() * 80) + 10

            // Öncelik değerini belirle
            const priorities = ["düşük", "orta", "yüksek", "kritik"]
            const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]

            // Bütçe kullanımını hesapla
            const price = Number(item.price) || 0
            console.log("Proje fiyatı:", price, typeof price)

            const spent = Math.floor(price * (Math.random() * 0.8))
            console.log("Harcanan:", spent)

            // Görev tamamlama durumunu hesapla
            const totalTasks = Math.floor(Math.random() * 50) + 10
            const tasksCompleted = Math.floor(totalTasks * (progress / 100))

            // Ekip büyüklüğünü belirle
            const workers = item.workers || []
            const teamSize = workers.length
            console.log("Ekip büyüklüğü:", teamSize)

            return {
              id: item.project_id,
              name: item.project_name,
              description: item.project_description,
              budget: price,
              spent: spent,
              status: status,
              progress: progress,
              startDate: formattedStartDate,
              deadline: item.end_time
                ? new Date(item.end_time).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Belirtilmemiş",
              client: "Müşteri bilgisi API'de yok",
              teamSize: teamSize,
              tasksCompleted: tasksCompleted,
              totalTasks: totalTasks,
              priority: randomPriority,
              lastActivity: `${Math.floor(Math.random() * 24) + 1} saat önce`,
              commissioners: item.commissioners || [],
              workers: workers,
            }
          })

          setProjects(formattedProjects)
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

  const openProjectDetails = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const openTeamModal = (project) => {
    setSelectedProject(project)
    setIsTeamModalOpen(true)
  }

  const openInvoiceModal = (project) => {
    setSelectedProject(project)
    setIsInvoiceModalOpen(true)
  }

  useEffect(() => {
    console.log("Role bilgisi: ", role)
  }, [role])

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Sidebar Active="projects" ActiveSubItem="manager" ProjectOpen={true} role={role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div
          ref={headerRef}
          className={`bg-black text-white p-5 w-full transition-all duration-700 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold">Yöneticisi Olduğum Projeler</h2>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <>
              {/* Proje Özeti */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AnimatedCard delay={100}>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <BarChart2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Aktif Projeler</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {projects.filter((p) => p.status !== "tamamlandi").length}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard delay={200}>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Tamamlanan</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {projects.filter((p) => p.status === "tamamlandi").length}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard delay={300}>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Toplam Ekip</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {projects.reduce((total, p) => total + p.teamSize, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>

              {/* Bütçe Özeti */}
              <AnimatedCard delay={400}>
                <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Toplam Bütçe Durumu</h3>
                      <p className="text-sm text-gray-500">Tüm projelerin bütçe kullanımı</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Toplam Bütçe:</span>
                      <span className="font-medium">
                        {projects.reduce((total, p) => total + p.budget, 0).toLocaleString("tr-TR")} ₺
                      </span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-500 mr-2">Harcanan:</span>
                      <span className="font-medium">
                        {projects.reduce((total, p) => total + p.spent, 0).toLocaleString("tr-TR")} ₺
                      </span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-500 mr-2">Kalan:</span>
                      <span className="font-medium">
                        {(
                          projects.reduce((total, p) => total + p.budget, 0) -
                          projects.reduce((total, p) => total + p.spent, 0)
                        ).toLocaleString("tr-TR")}{" "}
                        ₺
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min(
                          100,
                          (projects.reduce((total, p) => total + p.spent, 0) /
                            Math.max(
                              1,
                              projects.reduce((total, p) => total + p.budget, 0),
                            )) *
                            100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>
                      %
                      {Math.round(
                        (projects.reduce((total, p) => total + p.spent, 0) /
                          Math.max(
                            1,
                            projects.reduce((total, p) => total + p.budget, 0),
                          )) *
                          100,
                      )}{" "}
                      Kullanıldı
                    </span>
                    <span>
                      %
                      {Math.round(
                        100 -
                          (projects.reduce((total, p) => total + p.spent, 0) /
                            Math.max(
                              1,
                              projects.reduce((total, p) => total + p.budget, 0),
                            )) *
                            100,
                      )}{" "}
                      Kalan
                    </span>
                  </div>
                </div>
              </AnimatedCard>

              {/* Search and Filter */}
              <AnimatedCard delay={500}>
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
                      <option value="">Tüm Öncelikler</option>
                      <option value="düşük">Düşük</option>
                      <option value="orta">Orta</option>
                      <option value="yüksek">Yüksek</option>
                      <option value="kritik">Kritik</option>
                    </select>

                    <button className="flex items-center px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-md">
                      <Plus className="w-5 h-5 mr-2" />
                      Yeni Proje
                    </button>
                  </div>
                </div>
              </AnimatedCard>

              {/* Project Cards */}
              {projects.length === 0 ? (
                <AnimatedCard>
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Henüz yöneticisi olduğunuz proje bulunmamaktadır.</p>
                  </div>
                </AnimatedCard>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.map((project, index) => {
                    const statusDetails = getStatusDetails(project.status)
                    const priorityDetails = getPriorityDetails(project.priority)

                    return (
                      <AnimatedCard key={project.id} delay={600 + index * 100}>
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]">
                          <div className="p-5">
                            {/* Header with Status and Actions */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.color}`}
                                >
                                  {statusDetails.text}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityDetails.color}`}
                                >
                                  {priorityDetails.text}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                </button>
                              </div>
                            </div>

                            {/* Project Name and Description */}
                            <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2">{project.name}</h3>
                            <p className="text-gray-600 mb-4">{project.description}</p>

                            {/* Progress and Metrics */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700">İlerleme</span>
                                <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    project.status === "tamamlandi" ? "bg-green-600" : "bg-blue-600"
                                  } transition-all duration-1000 ease-out`}
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center mb-1">
                                  <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                                  <span className="text-sm font-medium text-gray-700">Bütçe</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">{project.budget.toLocaleString("tr-TR")} ₺</span>
                                  <div className="flex items-center mt-1">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                                      <div
                                        className={`h-1.5 rounded-full ${project.spent > project.budget ? "bg-red-600" : "bg-blue-600"} transition-all duration-1000 ease-out`}
                                        style={{ width: `${Math.min(100, (project.spent / project.budget) * 100)}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {Math.round((project.spent / project.budget) * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center mb-1">
                                  <CheckCircle className="w-4 h-4 text-gray-500 mr-1" />
                                  <span className="text-sm font-medium text-gray-700">Görevler</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {project.tasksCompleted}/{project.totalTasks}
                                  </span>
                                  <div className="flex items-center mt-1">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                                      <div
                                        className="bg-green-600 h-1.5 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${(project.tasksCompleted / project.totalTasks) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {Math.round((project.tasksCompleted / project.totalTasks) * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Team and Timeline */}
                            <div className="flex flex-col gap-2 mb-4">
                              <div className="flex items-center text-gray-700">
                                <Users className="w-5 h-5 mr-2 text-gray-500" />
                                <span className="text-sm">
                                  Ekip: <span className="font-medium">{project.teamSize} kişi</span>
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
                              <div className="flex items-center text-gray-700">
                                <span className="text-xs text-gray-500">Son aktivite: {project.lastActivity}</span>
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
                                onClick={() => openInvoiceModal(project)}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Fatura
                              </button>

                              <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                                <Settings className="w-4 h-4 mr-1" />
                                Ayarlar
                              </button>
                            </div>
                          </div>
                        </div>
                      </AnimatedCard>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Proje Detayları Modal */}
      <ProjectDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} project={selectedProject} />

      {/* Ekip Bilgileri Modal */}
      <TeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} project={selectedProject} />

      {/* Fatura Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        project={selectedProject}
      />
    </div>
  )
}

