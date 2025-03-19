"use client"

import { X, Calendar, DollarSign, Users, BarChart2, FileText, Briefcase, CheckCircle } from "lucide-react"

export function ProjectDetailsModal({ isOpen, onClose, project }) {
  if (!isOpen || !project) return null

  // Durum renklerini ve metinlerini belirle
  const getStatusDetails = (status) => {
    switch (status) {
      case "devam-ediyor":
        return { color: "bg-blue-100 text-blue-800", text: "Devam Ediyor" }
      case "tamamlandi":
        return { color: "bg-green-100 text-green-800", text: "Tamamlandı" }
      case "beklemede":
        return { color: "bg-yellow-100 text-yellow-800", text: "Beklemede" }
      case "risk-altinda":
        return { color: "bg-red-100 text-red-800", text: "Risk Altında" }
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

  const statusDetails = project.status ? getStatusDetails(project.status) : null
  const priorityDetails = project.priority ? getPriorityDetails(project.priority) : null
  const paymentStatusDetails = project.paymentStatus ? getPaymentStatusDetails(project.paymentStatus) : null

  // Örnek takım üyeleri (gerçek veriler olmadığı için)
  const teamMembers = [
    { id: 1, name: "Ahmet Yılmaz", role: "Proje Yöneticisi", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Ayşe Kaya", role: "Frontend Geliştirici", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Mehmet Demir", role: "Backend Geliştirici", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "Zeynep Şahin", role: "UI/UX Tasarımcı", avatar: "/placeholder.svg?height=40&width=40" },
  ].slice(0, project.teamSize || 0)

  // Örnek kilometre taşları (gerçek veriler olmadığı için)
  const milestones = [
    { id: 1, name: "Proje Başlangıcı", date: project.startDate, completed: true },
    { id: 2, name: "Tasarım Onayı", date: "15 Şubat 2025", completed: project.progress >= 30 },
    { id: 3, name: "Geliştirme Tamamlandı", date: "30 Nisan 2025", completed: project.progress >= 70 },
    { id: 4, name: "Test ve Kalite Kontrol", date: "10 Mayıs 2025", completed: project.progress >= 90 },
    { id: 5, name: "Proje Teslimi", date: project.deadline, completed: project.progress === 100 },
  ]

  // Örnek görev verileri oluşturmak için fonksiyon ekleyelim (proje.id'ye göre tutarlı görevler)
  const generateSampleTasks = (project) => {
    if (!project || !project.tasksCompleted) return []

    const totalTasks = project.totalTasks || 10
    const completedTasks = project.tasksCompleted || 0

    const taskTypes = ["Tasarım", "Geliştirme", "Test", "Dokümantasyon", "Toplantı"]
    const assignees = ["Ahmet Yılmaz", "Ayşe Kaya", "Mehmet Demir", "Zeynep Şahin", "Ali Can"]
    const statuses = ["Tamamlandı", "Devam Ediyor", "Beklemede", "İncelemede"]

    return Array.from({ length: totalTasks }).map((_, index) => {
      const isCompleted = index < completedTasks
      return {
        id: `task-${project.id}-${index + 1}`,
        name: `${taskTypes[index % taskTypes.length]} ${index + 1}`,
        description: `${project.name} için ${taskTypes[index % taskTypes.length].toLowerCase()} görevi`,
        assignee: assignees[index % assignees.length],
        dueDate: new Date(new Date(project.startDate).getTime() + index * 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
          "tr-TR",
        ),
        status: isCompleted ? statuses[0] : statuses[(index % 3) + 1],
        priority: index % 4 === 0 ? "Yüksek" : index % 3 === 0 ? "Orta" : "Düşük",
        completed: isCompleted,
      }
    })
  }

  // Görevler bölümünü ekleyelim, ProjectDetailsModal bileşeninde return ifadesinden önce:
  const tasks = generateSampleTasks(project)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            {statusDetails && (
              <span className={`ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.color}`}>
                {statusDetails.text}
              </span>
            )}
            {priorityDetails && (
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityDetails.color}`}>
                {priorityDetails.text}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Proje Özeti */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Briefcase className="w-5 h-5 text-gray-700 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Proje Özeti</h3>
            </div>
            <p className="text-gray-700 mb-6 text-base leading-relaxed">{project.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Müşteri / Yüklenici</h4>
                <p className="font-medium">{project.client || project.contractor}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Fiyat / Bütçe</h4>
                <p className="font-medium">
                  {(project.price || project.budget || project.totalPrice)?.toLocaleString("tr-TR")} ₺
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Başlangıç Tarihi</h4>
                <p className="font-medium">{project.startDate}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Teslim Tarihi</h4>
                <p className="font-medium">{project.deadline}</p>
              </div>
            </div>
          </div>

          {/* İlerleme */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <BarChart2 className="w-5 h-5 text-gray-700 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Proje İlerlemesi</h3>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Genel İlerleme</span>
                <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${project.status === "tamamlandi" ? "bg-green-600" : "bg-blue-600"}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {project.tasksCompleted !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Tamamlanan Görevler</span>
                  <span className="text-sm font-medium text-gray-700">
                    {project.tasksCompleted}/{project.totalTasks}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${(project.tasksCompleted / project.totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Kilometre Taşları */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Kilometre Taşları</h4>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start">
                    <div
                      className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full ${milestone.completed ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{milestone.name}</p>
                      <p className="text-xs text-gray-500">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bütçe Bilgileri (Eğer varsa) */}
          {project.budget && project.spent && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <DollarSign className="w-5 h-5 text-gray-700 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Bütçe Bilgileri</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Toplam Bütçe</h4>
                  <p className="font-medium">{project.budget.toLocaleString("tr-TR")} ₺</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Harcanan</h4>
                  <p className="font-medium">{project.spent.toLocaleString("tr-TR")} ₺</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Kalan</h4>
                  <p className="font-medium">{(project.budget - project.spent).toLocaleString("tr-TR")} ₺</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Bütçe Kullanımı</span>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.round((project.spent / project.budget) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${project.spent > project.budget ? "bg-red-600" : "bg-blue-600"}`}
                    style={{ width: `${Math.min(100, (project.spent / project.budget) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Bütçe Dağılımı */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Bütçe Dağılımı</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Personel</span>
                    <span className="text-sm font-medium">
                      {Math.round(project.spent * 0.6).toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Yazılım & Donanım</span>
                    <span className="text-sm font-medium">
                      {Math.round(project.spent * 0.2).toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pazarlama</span>
                    <span className="text-sm font-medium">
                      {Math.round(project.spent * 0.1).toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Diğer</span>
                    <span className="text-sm font-medium">
                      {Math.round(project.spent * 0.1).toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Komisyon Bilgileri (Eğer varsa) */}
          {project.commissionRate && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <DollarSign className="w-5 h-5 text-gray-700 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Komisyon Bilgileri</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Toplam Tutar</h4>
                  <p className="font-medium">{project.totalPrice?.toLocaleString("tr-TR")} ₺</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Komisyon Oranı</h4>
                  <p className="font-medium">%{project.commissionRate}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Komisyon Tutarı</h4>
                  <p className="font-medium">{project.commissionAmount?.toLocaleString("tr-TR")} ₺</p>
                </div>
              </div>

              {paymentStatusDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-500">Ödeme Durumu</h4>
                    <span className={`font-medium ${paymentStatusDetails.color}`}>{paymentStatusDetails.text}</span>
                  </div>

                  {project.paymentStatus === "kısmi-ödeme" && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Ödenen</span>
                        <span className="text-xs font-medium">
                          {Math.round(project.commissionAmount * 0.4).toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Kalan</span>
                        <span className="text-xs font-medium">
                          {Math.round(project.commissionAmount * 0.6).toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Ekip Bilgileri */}
          {project.teamSize && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-gray-700 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Ekip Bilgileri</h3>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Ekip Büyüklüğü</h4>
                <p className="font-medium">{project.teamSize} kişi</p>
              </div>

              {project.role && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Rolünüz</h4>
                  <p className="font-medium">{project.role}</p>
                </div>
              )}

              {/* Takım Üyeleri */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Takım Üyeleri</h4>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center p-3 bg-white border rounded-lg">
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Görevler bölümünü ekleyelim, "Ekip Bilgileri" bölümünden sonra ve "Zaman Çizelgesi" bölümünden önce: */}
          {tasks.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-5 h-5 text-gray-700 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Görevler</h3>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Görev Durumu</h4>
                  <span className="text-sm font-medium">
                    {project.tasksCompleted}/{project.totalTasks}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${(project.tasksCompleted / project.totalTasks) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tamamlanan: {project.tasksCompleted}</span>
                  <span>Kalan: {project.totalTasks - project.tasksCompleted}</span>
                </div>
              </div>

              <details className="group border rounded-lg overflow-hidden">
                <summary className="flex justify-between items-center p-4 cursor-pointer bg-white hover:bg-gray-50">
                  <span className="font-medium">Görev Listesi</span>
                  <span className="transition group-open:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>

                <div className="p-4 border-t">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Görev
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Atanan
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Durum
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Öncelik
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Bitiş Tarihi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                          <tr key={task.id} className={task.completed ? "bg-green-50" : ""}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div
                                  className={`flex-shrink-0 h-4 w-4 rounded-full ${task.completed ? "bg-green-500" : "bg-gray-300"}`}
                                ></div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{task.name}</div>
                                  <div className="text-xs text-gray-500">{task.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{task.assignee}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        task.status === "Tamamlandı"
                          ? "bg-green-100 text-green-800"
                          : task.status === "Devam Ediyor"
                            ? "bg-blue-100 text-blue-800"
                            : task.status === "Beklemede"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-purple-100 text-purple-800"
                      }`}
                              >
                                {task.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        task.priority === "Yüksek"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "Orta"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                              >
                                {task.priority}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>

              <details className="group border rounded-lg overflow-hidden mt-4">
                <summary className="flex justify-between items-center p-4 cursor-pointer bg-white hover:bg-gray-50">
                  <span className="font-medium">Görev İstatistikleri</span>
                  <span className="transition group-open:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>

                <div className="p-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <h5 className="text-sm font-medium text-gray-500 mb-2">Durum Dağılımı</h5>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Tamamlandı</span>
                            <span>{project.tasksCompleted}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-green-600 h-1.5 rounded-full"
                              style={{ width: `${(project.tasksCompleted / project.totalTasks) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Devam Ediyor</span>
                            <span>{Math.floor((project.totalTasks - project.tasksCompleted) * 0.6)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{
                                width: `${(((project.totalTasks - project.tasksCompleted) * 0.6) / project.totalTasks) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Beklemede</span>
                            <span>{Math.floor((project.totalTasks - project.tasksCompleted) * 0.3)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-yellow-600 h-1.5 rounded-full"
                              style={{
                                width: `${(((project.totalTasks - project.tasksCompleted) * 0.3) / project.totalTasks) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>İncelemede</span>
                            <span>{Math.floor((project.totalTasks - project.tasksCompleted) * 0.1)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-purple-600 h-1.5 rounded-full"
                              style={{
                                width: `${(((project.totalTasks - project.tasksCompleted) * 0.1) / project.totalTasks) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border">
                      <h5 className="text-sm font-medium text-gray-500 mb-2">Öncelik Dağılımı</h5>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Yüksek</span>
                            <span>{Math.floor(project.totalTasks * 0.25)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-red-600 h-1.5 rounded-full" style={{ width: "25%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Orta</span>
                            <span>{Math.floor(project.totalTasks * 0.35)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-orange-600 h-1.5 rounded-full" style={{ width: "35%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Düşük</span>
                            <span>{Math.floor(project.totalTasks * 0.4)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-gray-600 h-1.5 rounded-full" style={{ width: "40%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border">
                      <h5 className="text-sm font-medium text-gray-500 mb-2">Kişi Bazlı Görevler</h5>
                      <div className="space-y-2">
                        {Array.from(new Set(tasks.map((t) => t.assignee)))
                          .slice(0, 4)
                          .map((person, idx) => {
                            const personTasks = tasks.filter((t) => t.assignee === person)
                            const completedCount = personTasks.filter((t) => t.completed).length
                            return (
                              <div key={idx}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{person}</span>
                                  <span>
                                    {completedCount}/{personTasks.length}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-600 h-1.5 rounded-full"
                                    style={{ width: `${(completedCount / personTasks.length) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          )}

          {/* Zaman Çizelgesi */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-gray-700 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Zaman Çizelgesi</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Proje Süresi</h4>
                <p className="font-medium">
                  {project.startDate} - {project.deadline}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Kalan Süre</h4>
                <p className="font-medium">{project.status === "tamamlandi" ? "Tamamlandı" : "45 gün"}</p>
              </div>
            </div>
          </div>

          {/* Proje Detayları */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-gray-700 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Proje Detayları</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.contractor && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Yüklenici</h4>
                  <p className="font-medium">{project.contractor}</p>
                </div>
              )}

              {project.client && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Müşteri</h4>
                  <p className="font-medium">{project.client}</p>
                </div>
              )}

              {project.priority && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Öncelik</h4>
                  <p className="font-medium">{priorityDetails?.text}</p>
                </div>
              )}

              {project.hasInvoice !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Fatura Durumu</h4>
                  <p className="font-medium">{project.hasInvoice ? "Fatura Mevcut" : "Fatura Bekleniyor"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Son Aktivite */}
          {project.lastActivity && (
            <div className="text-sm text-gray-500 mt-6 italic">Son aktivite: {project.lastActivity}</div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}

