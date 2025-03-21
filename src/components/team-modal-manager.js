"use client"

import { useState } from "react"
import { X, Users, Mail, Phone, Calendar, Clock, Search, Plus } from "lucide-react"

export function TeamModalManager({ isOpen, onClose, project }) {
  const [activeTab, setActiveTab] = useState("members")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)

  // Örnek takım üyeleri (gerçek veriler olmadığı için)
  const teamMembers = [
    {
      id: 1,
      name: "Ahmet Yılmaz",
      role: "Proje Yöneticisi",
      email: "ahmet.yilmaz@example.com",
      phone: "+90 555 123 4567",
      joinDate: "15 Ocak 2025",
      experience: "8 yıl",
      skills: ["Proje Yönetimi", "Agile", "Scrum", "Risk Yönetimi"],
      avatar: "/placeholder.svg?height=80&width=80",
      performance: 95,
      tasksCompleted: 18,
      totalTasks: 20,
      status: "active",
    },
    {
      id: 2,
      name: "Ayşe Kaya",
      role: "Frontend Geliştirici",
      email: "ayse.kaya@example.com",
      phone: "+90 555 234 5678",
      joinDate: "20 Ocak 2025",
      experience: "5 yıl",
      skills: ["React", "JavaScript", "HTML/CSS", "UI/UX"],
      avatar: "/placeholder.svg?height=80&width=80",
      performance: 88,
      tasksCompleted: 12,
      totalTasks: 15,
      status: "active",
    },
    {
      id: 3,
      name: "Mehmet Demir",
      role: "Backend Geliştirici",
      email: "mehmet.demir@example.com",
      phone: "+90 555 345 6789",
      joinDate: "18 Ocak 2025",
      experience: "6 yıl",
      skills: ["Node.js", "Python", "SQL", "API Tasarımı"],
      avatar: "/placeholder.svg?height=80&width=80",
      performance: 92,
      tasksCompleted: 22,
      totalTasks: 25,
      status: "active",
    },
    {
      id: 4,
      name: "Zeynep Şahin",
      role: "UI/UX Tasarımcı",
      email: "zeynep.sahin@example.com",
      phone: "+90 555 456 7890",
      joinDate: "25 Ocak 2025",
      experience: "4 yıl",
      skills: ["Figma", "Adobe XD", "Sketch", "Kullanıcı Araştırması"],
      avatar: "/placeholder.svg?height=80&width=80",
      performance: 85,
      tasksCompleted: 8,
      totalTasks: 10,
      status: "active",
    },
    {
      id: 5,
      name: "Ali Can",
      role: "Mobil Geliştirici",
      email: "ali.can@example.com",
      phone: "+90 555 567 8901",
      joinDate: "1 Şubat 2025",
      experience: "3 yıl",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      avatar: "/placeholder.svg?height=80&width=80",
      performance: 78,
      tasksCompleted: 14,
      totalTasks: 20,
      status: "leave",
    },
  ].slice(0, project?.teamSize || 0)

  // Filtrelenmiş takım üyeleri
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Performans durumunu belirle
  const getPerformanceStatus = (performance) => {
    if (performance >= 90) return { color: "text-green-600", text: "Mükemmel" }
    if (performance >= 80) return { color: "text-blue-600", text: "İyi" }
    if (performance >= 70) return { color: "text-yellow-600", text: "Ortalama" }
    return { color: "text-red-600", text: "Geliştirilebilir" }
  }

  // Rol bazlı dağılım
  const roleDistribution = teamMembers.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1
    return acc
  }, {})

  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">{project.name} - Ekip Yönetimi</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "members"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("members")}
            >
              Ekip Üyeleri
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "performance"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("performance")}
            >
              Performans
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "schedule"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("schedule")}
            >
              Çalışma Takvimi
            </button>
          </div>

          {/* Ekip Üyeleri Tab */}
          {activeTab === "members" && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Ekip üyesi ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ekip Üyesi Ekle
                </button>
              </div>

              {/* Ekip Üyesi Ekleme Formu */}
              {showAddMemberForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Ekip Üyesi Ekle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Ad Soyad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Rol Seçin</option>
                        <option value="developer">Geliştirici</option>
                        <option value="designer">Tasarımcı</option>
                        <option value="manager">Proje Yöneticisi</option>
                        <option value="analyst">Analist</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                      <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="E-posta"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                      <input
                        type="tel"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Telefon"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      onClick={() => setShowAddMemberForm(false)}
                    >
                      İptal
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Ekip Üyesi Ekle
                    </button>
                  </div>
                </div>
              )}

              {/* Ekip Üyeleri Listesi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMembers.length === 0 ? (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-500">Arama kriterlerine uygun ekip üyesi bulunamadı.</p>
                  </div>
                ) : (
                  filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-5">
                        <div className="flex items-start">
                          <img
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            className="w-16 h-16 rounded-full mr-4 object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-lg font-bold text-gray-900">{member.name}</h4>
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  member.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {member.status === "active" ? "Aktif" : "İzinde"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{member.role}</p>

                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <Mail className="w-4 h-4 mr-1" />
                              <span>{member.email}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="w-4 h-4 mr-1" />
                              <span>{member.phone}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                              <span>Katılım: {member.joinDate}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1 text-gray-500" />
                              <span>Deneyim: {member.experience}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Yetenekler</h5>
                          <div className="flex flex-wrap gap-2">
                            {member.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Profili Görüntüle
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">Ekipten Çıkar</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Performans Tab */}
          {activeTab === "performance" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Ortalama Performans</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    %{Math.round(teamMembers.reduce((sum, member) => sum + member.performance, 0) / teamMembers.length)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{teamMembers.length} ekip üyesi</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Tamamlanan Görevler</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Toplam: {teamMembers.reduce((sum, member) => sum + member.totalTasks, 0)} görev
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Görev Tamamlama Oranı</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    %
                    {Math.round(
                      (teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0) /
                        teamMembers.reduce((sum, member) => sum + member.totalTasks, 0)) *
                        100,
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Son 30 gün</p>
                </div>
              </div>

              {/* Performans Tablosu */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Ekip Performans Tablosu</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ekip Üyesi
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Rol
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Performans
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Görevler
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teamMembers.map((member) => {
                        const performanceStatus = getPerformanceStatus(member.performance)
                        return (
                          <tr key={member.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={member.avatar || "/placeholder.svg"}
                                    alt={member.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                  <div className="text-sm text-gray-500">{member.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{member.role}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">{member.performance}%</span>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      member.performance >= 90
                                        ? "bg-green-600"
                                        : member.performance >= 80
                                          ? "bg-blue-600"
                                          : member.performance >= 70
                                            ? "bg-yellow-600"
                                            : "bg-red-600"
                                    }`}
                                    style={{ width: `${member.performance}%` }}
                                  ></div>
                                </div>
                                <span className={`ml-2 text-xs font-medium ${performanceStatus.color}`}>
                                  {performanceStatus.text}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {member.tasksCompleted}/{member.totalTasks}
                              </div>
                              <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                  className="bg-green-600 h-1.5 rounded-full"
                                  style={{ width: `${(member.tasksCompleted / member.totalTasks) * 100}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  member.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {member.status === "active" ? "Aktif" : "İzinde"}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Performans Grafikleri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Rol Bazlı Performans</h3>
                  <div className="space-y-4">
                    {Object.entries(roleDistribution).map(([role, count], index) => {
                      const roleMembers = teamMembers.filter((member) => member.role === role)
                      const avgPerformance =
                        roleMembers.reduce((sum, member) => sum + member.performance, 0) / roleMembers.length
                      return (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{role}</span>
                            <span className="text-sm font-medium">{Math.round(avgPerformance)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                avgPerformance >= 90
                                  ? "bg-green-600"
                                  : avgPerformance >= 80
                                    ? "bg-blue-600"
                                    : avgPerformance >= 70
                                      ? "bg-yellow-600"
                                      : "bg-red-600"
                              }`}
                              style={{ width: `${avgPerformance}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{count} kişi</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Görev Tamamlama Oranları</h3>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <img
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="text-sm font-medium">{member.name}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {Math.round((member.tasksCompleted / member.totalTasks) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(member.tasksCompleted / member.totalTasks) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {member.tasksCompleted}/{member.totalTasks} görev
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Çalışma Takvimi Tab */}
          {activeTab === "schedule" && (
            <div>
              <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ekip Çalışma Takvimi</h3>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, index) => (
                    <div key={index} className="text-center font-medium text-gray-500 text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, index) => {
                    const day = index + 1
                    const isToday = day === 15
                    const hasEvent = [3, 8, 12, 15, 22, 27].includes(day)
                    return (
                      <div
                        key={index}
                        className={`aspect-square border rounded-md flex flex-col items-center justify-center p-1 ${
                          isToday ? "bg-blue-100 border-blue-300" : ""
                        }`}
                      >
                        <span className={`text-sm ${isToday ? "font-bold text-blue-700" : "text-gray-700"}`}>
                          {day}
                        </span>
                        {hasEvent && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1"></div>}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Yaklaşan Toplantılar</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <p className="font-medium">Haftalık Durum Toplantısı</p>
                        <p className="text-sm text-gray-500">Pazartesi, 10:00 - 11:00</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Düzenli
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">Sprint Planlama</p>
                        <p className="text-sm text-gray-500">Çarşamba, 14:00 - 16:00</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Bu Hafta
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">Proje Değerlendirme</p>
                        <p className="text-sm text-gray-500">Cuma, 11:00 - 12:00</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        Özel
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">İzin Takvimi</h3>
                  <div className="space-y-3">
                    {teamMembers
                      .filter((member) => member.status === "leave")
                      .map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                        >
                          <img
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">15 Nisan - 22 Nisan 2025</p>
                          </div>
                        </div>
                      ))}

                    <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <img
                          src="/placeholder.svg?height=40&width=40"
                          alt="Ayşe Kaya"
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">Ayşe Kaya</p>
                          <p className="text-sm text-gray-500">25 Nisan - 30 Nisan 2025</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        Yaklaşan
                      </span>
                    </div>

                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Plus className="w-4 h-4 mr-2" />
                      İzin Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

