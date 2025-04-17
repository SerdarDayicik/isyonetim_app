// src/page/CustomerPage.js
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
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [filteredProjects, setFilteredProjects] = useState([])

  const API_KEY = process.env.REACT_APP_API_URL



  // Token'ı localStorage'dan al
  const token = localStorage.getItem("token")
  
  // Token varsa, JWT'den role bilgisini çıkar
  const role = token ? JSON.parse(atob(token.split(".")[1]))?.role : null

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
    // Sayfa yüklendiğinde animasyonu tetikle
    setAnimationTriggered(true)
    
    // API'den proje verilerini çek
    fetchCustomerProjects()
  }, [location.state])
  
  // Proje verilerini API'den çek
  const fetchCustomerProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_KEY}/Admin/view_customer_projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token
        })
      })
      
      if (!response.ok) {
        throw new Error("Projeler alınırken bir hata oluştu")
      }
      
      const data = await response.json()
      
      // API'den gelen verileri dönüştür
      const formattedProjects = data.assigned_customers.map(project => {
        // Tarih biçimini değiştir
        const startDate = new Date(project.start_time)
        const endDate = new Date(project.end_time)
        
        // İlerleme durumunu hesapla
        const progress = project.total_task_count > 0 
          ? Math.round((project.completed_task_count / project.total_task_count) * 100)
          : 0
        
        // Durum bilgisini belirle
        let status = "beklemede"
        if (progress === 100) {
          status = "tamamlandi"
        } else if (progress > 0) {
          status = "devam-ediyor"
        }
        
        // Müteahhit/yüklenici bilgisini belirle (ilk çalışan)
        const contractor = project.workers.length > 0 ? project.workers[0].name : "Belirtilmedi"
        
        return {
          id: project.project_id,
          name: project.project_name,
          description: project.project_description,
          price: project.price,
          status: status,
          progress: progress,
          startDate: startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
          deadline: endDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
          contractor: contractor,
          hasDocuments: true, // Varsayılan olarak belgeleri var kabul ediyoruz
          hasInvoice: true, // Varsayılan olarak faturası var kabul ediyoruz
          workers: project.workers,
          commissioners: project.commissioners,
          totalTaskCount: project.total_task_count,
          completedTaskCount: project.completed_task_count,
          startTimeRaw: project.start_time,
          endTimeRaw: project.end_time
        }
      })
      
      setProjects(formattedProjects)
      setFilteredProjects(formattedProjects)
    } catch (error) {
      console.error("Proje verileri alınırken hata:", error)
      toast.error("Projeler yüklenirken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }
  
  // Projeleri filtrele
  useEffect(() => {
    let result = [...projects]
    
    // Arama terimine göre filtrele
    if (searchTerm) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Durum filtresine göre filtrele
    if (statusFilter) {
      result = result.filter(project => project.status === statusFilter)
    }
    
    setFilteredProjects(result)
  }, [searchTerm, statusFilter, projects])

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <select 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 transition-all duration-300 focus:shadow-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tüm Durumlar</option>
                  <option value="devam-ediyor">Devam Eden</option>
                  <option value="tamamlandi">Tamamlanan</option>
                  <option value="beklemede">Bekleyen</option>
                </select>

                <span className="text-sm text-gray-500">Toplam {filteredProjects.length} proje</span>
              </div>
            </div>
          </AnimatedCard>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">Proje bulunamadı</h3>
              <p className="text-gray-500">Arama kriterlerinize uygun proje bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => {
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
          )}
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