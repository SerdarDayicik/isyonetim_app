"use client"

import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useState, useEffect } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { ProjectDetailsModal } from "../components/project-details-modal"
import { TeamModal } from "../components/team-modal"
import { useScrollAnimation } from "../hooks/use-scroll-animation"
import { AnimatedCard } from "../components/animated-card"
import "../globals.css"
import { Calendar, CheckCircle, Clock, DollarSign, FileText, MoreHorizontal, Search, Users } from 'lucide-react'
import { TasksModal } from "../components/task-modal"

export default function CalisaniOldugum() {
  const API_KEY = process.env.REACT_APP_API_URL

  const location = useLocation()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [animationTriggered, setAnimationTriggered] = useState(false)
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token")
        
        if (!token) {
          toast.error("Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.")
          return
        }

        const response = await fetch(`${API_KEY}/Admin/view_assignment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          throw new Error("API yanıtı başarısız")
        }

        const data = await response.json()
        console.log("API yanıtı:", data) 
        
        // Transform API data to match our project structure
        const formattedProjects = data.assigned_projects.map(project => ({
          id: project.project_id,
          name: project.project_name,
          description: project.project_description,
          price: project.price,
          budget: project.price,
          spent: project.price * 0.3, // Varsayılan harcama olarak bütçenin %30'unu kullanıyoruz
          progress: Math.round(project.total_task_count > 0 ? (project.completed_task_count / project.total_task_count) * 100 : project.state_id * 25),
          startDate: formatDate(project.start_time),
          deadline: project.end_time ? formatDate(project.end_time) : "Belirlenmedi",
          client: "Müşteri", // API'de müşteri bilgisi yok
          teamSize: project.worker_count,
          tasksCompleted: project.completed_task_count,
          totalTasks: project.total_task_count || 1, // Eğer total_task_count 0 ise, en az 1 olarak ayarlayalım
          lastActivity: "Bugün", // API'de son aktivite bilgisi yok
          role: "Proje Çalışanı", // Varsayılan rol
          state_id: project.state_id,
          is_completed: project.is_completed,
          
          // Eğer API'den gelen projede workers ve commissioners varsa onları da ekleyelim
          workers: project.workers || [], // Eğer API workers sunuyorsa
          commissioners: project.commissioners || [] // Eğer API commissioners sunuyorsa
        }))

        setProjects(formattedProjects)
        setAnimationTriggered(true)
      } catch (error) {
        console.error("Projeler yüklenirken hata oluştu:", error)
        toast.error("Projeler yüklenirken bir hata oluştu.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Belirlenmedi"
    
    const date = new Date(dateString)
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('tr-TR', options)
  }

  const openProjectDetails = (project) => {
    setSelectedProject(project)
    setIsDetailsModalOpen(true)
  }

  const openTeamModal = (project) => {
    console.log("Ekip modalı açılıyor, proje:", project)
    setSelectedProject(project)
    setIsTeamModalOpen(true)
  }

  const openTasksModal = (project) => {
    setSelectedProject(project)
    setIsTasksModalOpen(true)
  }

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
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
      <Sidebar Active="projects" ActiveSubItem="employee" ProjectOpen={true} role={role}/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div 
          ref={headerRef}
          className={`bg-black text-white p-5 w-full transition-all duration-700 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold">Çalışanı Olduğum Projeler</h2>
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

              <div className="flex items-center gap-2 text-sm text-gray-500 w-full sm:w-auto justify-end">
                <span>Toplam {filteredProjects.length} proje</span>
              </div>
            </div>
          </AnimatedCard>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <AnimatedCard>
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Görüntülenecek proje bulunamadı.</div>
              </div>
            </AnimatedCard>
          ) : (
            /* Project Cards */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project, index) => (
                <AnimatedCard key={project.id} delay={200 + index * 100}>
                  <div
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]"
                  >
                    <div className="p-5">
                      {/* Header with Role and Actions */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {project.role}
                        </span>
                        <div className="flex items-center">
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Project Name and Description */}
                      <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">İlerleme</span>
                          <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
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
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-out"
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

                      {/* Client and Price */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-500">{project.client}</span>
                        <span className="font-medium">{project.price.toLocaleString("tr-TR")} ₺</span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-4">
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
                          onClick={() => openTasksModal(project)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Görevler
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
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

      {/* Ekip Bilgileri Modal */}
      <TeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} project={selectedProject} />

      {/* Görevler Modal */}
      <TasksModal 
        isOpen={isTasksModalOpen} 
        onClose={() => setIsTasksModalOpen(false)} 
        project={selectedProject} 
      />
    </div>
  )
}
