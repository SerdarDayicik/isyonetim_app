"use client"

import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useEffect } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import "../globals.css"
import {
  BarChart2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react"

export default function AdministratorProject() {
  const location = useLocation()

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location.state])

  // Örnek proje verileri
  const projects = [
    {
      id: 1,
      name: "Kurumsal Web Sitesi Yenileme",
      description: "Şirket web sitesinin modern tasarımla yenilenmesi",
      budget: 45000,
      spent: 28000,
      status: "devam-ediyor", // devam-ediyor, tamamlandi, beklemede
      progress: 65,
      startDate: "10 Ocak 2025",
      deadline: "20 Mayıs 2025",
      client: "ABC Holding",
      teamSize: 5,
      tasksCompleted: 24,
      totalTasks: 40,
      priority: "yüksek", // düşük, orta, yüksek, kritik
      lastActivity: "2 saat önce",
    },
    {
      id: 2,
      name: "Mobil Uygulama Geliştirme",
      description: "iOS ve Android için müşteri yönetim uygulaması",
      budget: 120000,
      spent: 45000,
      status: "beklemede",
      progress: 35,
      startDate: "5 Şubat 2025",
      deadline: "5 Ağustos 2025",
      client: "XYZ Teknoloji",
      teamSize: 8,
      tasksCompleted: 15,
      totalTasks: 65,
      priority: "kritik",
      lastActivity: "30 dakika önce",
    },
    {
      id: 3,
      name: "ERP Sistemi Entegrasyonu",
      description: "Mevcut sistemlere ERP entegrasyonu",
      budget: 85000,
      spent: 82000,
      status: "tamamlandi",
      progress: 100,
      startDate: "15 Kasım 2024",
      deadline: "15 Mart 2025",
      client: "Mega Sanayi A.Ş.",
      teamSize: 6,
      tasksCompleted: 52,
      totalTasks: 52,
      priority: "yüksek",
      lastActivity: "3 gün önce",
    },
    {
      id: 4,
      name: "Dijital Pazarlama Kampanyası",
      description: "6 aylık dijital pazarlama ve SEO stratejisi",
      budget: 60000,
      spent: 15000,
      status: "beklemede",
      progress: 25,
      startDate: "1 Mart 2025",
      deadline: "1 Eylül 2025",
      client: "Delta Perakende",
      teamSize: 4,
      tasksCompleted: 8,
      totalTasks: 32,
      priority: "orta",
      lastActivity: "1 gün önce",
    },
    {
      id: 5,
      name: "Veri Analizi ve Raporlama Sistemi",
      description: "Müşteri davranışları analiz ve raporlama platformu",
      budget: 75000,
      spent: 40000,
      status: "devam-ediyor",
      progress: 55,
      startDate: "20 Şubat 2025",
      deadline: "20 Haziran 2025",
      client: "Finans Bank",
      teamSize: 7,
      tasksCompleted: 18,
      totalTasks: 35,
      priority: "yüksek",
      lastActivity: "5 saat önce",
    },
    {
      id: 6,
      name: "Bulut Altyapı Migrasyonu",
      description: "Mevcut sistemlerin bulut altyapısına taşınması",
      budget: 95000,
      spent: 30000,
      status: "devam-ediyor",
      progress: 30,
      startDate: "15 Mart 2025",
      deadline: "15 Temmuz 2025",
      client: "Lojistik Express",
      teamSize: 5,
      tasksCompleted: 12,
      totalTasks: 45,
      priority: "orta",
      lastActivity: "1 saat önce",
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

  // Özet istatistikleri hesapla
  const activeProjects = projects.filter((p) => p.status !== "tamamlandi").length
  const completedProjects = projects.filter((p) => p.status === "tamamlandi").length
  const totalBudget = projects.reduce((total, project) => total + project.budget, 0)
  const totalSpent = projects.reduce((total, project) => total + project.spent, 0)
  const totalTeamMembers = projects.reduce((total, project) => total + project.teamSize, 0)

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Sidebar Active="projects" ActiveSubItem="manager" ProjectOpen={true} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="bg-black text-white p-5 w-full">
          <h2 className="text-2xl font-bold">Yöneticisi Olduğum Projeler</h2>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Proje Özeti */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <BarChart2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Aktif Projeler</h3>
                  <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tamamlanan</h3>
                  <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Toplam Ekip</h3>
                  <p className="text-2xl font-bold text-gray-900">{totalTeamMembers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bütçe Özeti */}
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Toplam Bütçe Durumu</h3>
                <p className="text-sm text-gray-500">Tüm projelerin bütçe kullanımı</p>
              </div>
              <div className="mt-2 md:mt-0 flex items-center">
                <span className="text-sm text-gray-500 mr-2">Toplam Bütçe:</span>
                <span className="font-medium">{totalBudget.toLocaleString("tr-TR")} ₺</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-500 mr-2">Harcanan:</span>
                <span className="font-medium">{totalSpent.toLocaleString("tr-TR")} ₺</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-500 mr-2">Kalan:</span>
                <span className="font-medium">{(totalBudget - totalSpent).toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>%{Math.round((totalSpent / totalBudget) * 100)} Kullanıldı</span>
              <span>%{Math.round(100 - (totalSpent / totalBudget) * 100)} Kalan</span>
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
                <option value="">Tüm Öncelikler</option>
                <option value="düşük">Düşük</option>
                <option value="orta">Orta</option>
                <option value="yüksek">Yüksek</option>
                <option value="kritik">Kritik</option>
              </select>

              <button className="flex items-center px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800">
                <Plus className="w-5 h-5 mr-2" />
                Yeni Proje
              </button>
            </div>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => {
              const statusDetails = getStatusDetails(project.status)
              const priorityDetails = getPriorityDetails(project.priority)

              return (
                <div
                  key={project.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    {/* Header with Status and Actions */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.color}`}>
                          {statusDetails.text}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityDetails.color}`}>
                          {priorityDetails.text}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <button className="p-1 hover:bg-gray-100 rounded-full">
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
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center mb-1">
                          <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                          <span className="text-sm font-medium text-gray-700">Bütçe</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{project.budget.toLocaleString("tr-TR")} ₺</span>
                          <div className="flex items-center mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                              <div
                                className={`h-1.5 rounded-full ${project.spent > project.budget ? "bg-red-600" : "bg-blue-600"}`}
                                style={{ width: `${Math.min(100, (project.spent / project.budget) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {Math.round((project.spent / project.budget) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
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
                                className="bg-green-600 h-1.5 rounded-full"
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
                      <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                        <FileText className="w-4 h-4 mr-1" />
                        Detaylar
                      </button>

                      <button className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
                        <Users className="w-4 h-4 mr-1" />
                        Ekip
                      </button>

                      <button className="flex items-center px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100">
                        <BarChart2 className="w-4 h-4 mr-1" />
                        Raporlar
                      </button>

                      <button className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Mesajlar
                      </button>

                      <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                        <Settings className="w-4 h-4 mr-1" />
                        Ayarlar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

