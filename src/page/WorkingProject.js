import { ToastContainer } from "react-toastify"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import "../globals.css"
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Search,
  Users,
} from "lucide-react"

export default function CalisaniOldugum() {

  // Örnek proje verileri - Yeni alanlar eklendi
  const projects = [
    {
      id: 1,
      name: "E-Ticaret Web Sitesi",
      description: "Online satış platformu geliştirme projesi",
      price: 12500,
      budget: 12500,
      spent: 8500,
      progress: 75,
      startDate: "10 Ocak 2025",
      deadline: "15 Mayıs 2025",
      client: "ABC Şirketi",
      teamSize: 4,
      tasksCompleted: 18,
      totalTasks: 24,
      lastActivity: "3 saat önce",
      role: "Frontend Geliştirici",
    },
    {
      id: 2,
      name: "Mobil Uygulama Geliştirme",
      description: "iOS ve Android için müşteri yönetim uygulaması",
      price: 18000,
      budget: 18000,
      spent: 8100,
      progress: 45,
      startDate: "5 Şubat 2025",
      deadline: "30 Haziran 2025",
      client: "XYZ Teknoloji",
      teamSize: 6,
      tasksCompleted: 12,
      totalTasks: 32,
      lastActivity: "1 gün önce",
      role: "Backend Geliştirici",
    },
    {
      id: 3,
      name: "CRM Sistemi Entegrasyonu",
      description: "Mevcut sistemlere CRM entegrasyonu",
      price: 8500,
      budget: 8500,
      spent: 7650,
      progress: 90,
      startDate: "15 Aralık 2024",
      deadline: "10 Nisan 2025",
      client: "Mega Holding",
      teamSize: 3,
      tasksCompleted: 27,
      totalTasks: 30,
      lastActivity: "5 saat önce",
      role: "Sistem Entegrasyon Uzmanı",
    },
    {
      id: 4,
      name: "SEO Optimizasyonu",
      description: "Web sitesi SEO iyileştirme çalışması",
      price: 5000,
      budget: 5000,
      spent: 3000,
      progress: 60,
      startDate: "1 Şubat 2025",
      deadline: "22 Mayıs 2025",
      client: "Delta Dijital",
      teamSize: 2,
      tasksCompleted: 12,
      totalTasks: 20,
      lastActivity: "2 gün önce",
      role: "SEO Uzmanı",
    },
    {
      id: 5,
      name: "Logo ve Kurumsal Kimlik",
      description: "Marka kimliği ve görsel tasarım projesi",
      price: 7500,
      budget: 7500,
      spent: 2250,
      progress: 30,
      startDate: "5 Mart 2025",
      deadline: "5 Temmuz 2025",
      client: "Yeni Nesil Gıda",
      teamSize: 3,
      tasksCompleted: 6,
      totalTasks: 20,
      lastActivity: "12 saat önce",
      role: "UI/UX Tasarımcı",
    },
    {
      id: 6,
      name: "Sosyal Medya Kampanyası",
      description: "3 aylık sosyal medya içerik ve reklam yönetimi",
      price: 9000,
      budget: 9000,
      spent: 1350,
      progress: 15,
      startDate: "15 Nisan 2025",
      deadline: "15 Ağustos 2025",
      client: "Lüks Mobilya",
      teamSize: 4,
      tasksCompleted: 3,
      totalTasks: 24,
      lastActivity: "30 dakika önce",
      role: "İçerik Üreticisi",
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Sidebar Active="projects" ActiveSubItem="employee" ProjectOpen={true} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="bg-black text-white p-5 w-full">
          <h2 className="text-2xl font-bold">Çalışanı Olduğum Projeler</h2>
        </div>

        <div className="p-6 overflow-y-auto">
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

            <div className="flex items-center gap-2 text-sm text-gray-500 w-full sm:w-auto justify-end">
              <span>Toplam {projects.length} proje</span>
            </div>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  {/* Header with Role and Actions */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {project.role}
                    </span>
                    <div className="flex items-center">
                      <button className="p-1 hover:bg-gray-100 rounded-full">
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
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
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
                              className="bg-blue-600 h-1.5 rounded-full"
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

                  {/* Client and Price */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">{project.client}</span>
                    <span className="font-medium">{project.price.toLocaleString("tr-TR")} ₺</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                      <FileText className="w-4 h-4 mr-1" />
                      Detaylar
                    </button>

                    <button className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
                      <Users className="w-4 h-4 mr-1" />
                      Ekip
                    </button>

                    <button className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Mesajlar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

