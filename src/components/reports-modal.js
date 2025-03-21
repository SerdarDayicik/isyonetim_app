"use client"

import { useState } from "react"
import { X, BarChart2, TrendingUp, Download, Calendar, Filter, ChevronDown } from "lucide-react"

export function ReportsModal({ isOpen, onClose, project }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("month")

  if (!isOpen || !project) return null

  // Örnek veri
  const monthlyProgress = [
    { month: "Ocak", progress: 15 },
    { month: "Şubat", progress: 30 },
    { month: "Mart", progress: 45 },
    { month: "Nisan", progress: 65 },
    { month: "Mayıs", progress: 75 },
    { month: "Haziran", progress: 85 },
    { month: "Temmuz", progress: 95 },
    { month: "Ağustos", progress: 100 },
  ]

  const taskCategories = [
    { name: "Geliştirme", count: 25, color: "bg-blue-500" },
    { name: "Tasarım", count: 15, color: "bg-purple-500" },
    { name: "Test", count: 10, color: "bg-green-500" },
    { name: "Dokümantasyon", count: 5, color: "bg-yellow-500" },
    { name: "Toplantı", count: 8, color: "bg-red-500" },
  ]

  const totalTasks = taskCategories.reduce((sum, category) => sum + category.count, 0)

  const teamPerformance = [
    { name: "Ahmet Yılmaz", role: "Proje Yöneticisi", performance: 95 },
    { name: "Ayşe Kaya", role: "Frontend Geliştirici", performance: 88 },
    { name: "Mehmet Demir", role: "Backend Geliştirici", performance: 92 },
    { name: "Zeynep Şahin", role: "UI/UX Tasarımcı", performance: 85 },
    { name: "Ali Can", role: "Mobil Geliştirici", performance: 78 },
  ]

  const riskFactors = [
    { name: "Bütçe Aşımı", risk: "Düşük", status: "bg-green-500" },
    { name: "Zaman Aşımı", risk: "Orta", status: "bg-yellow-500" },
    { name: "Kaynak Yetersizliği", risk: "Yüksek", status: "bg-red-500" },
    { name: "Teknik Zorluklar", risk: "Orta", status: "bg-yellow-500" },
    { name: "Müşteri Değişiklikleri", risk: "Düşük", status: "bg-green-500" },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <BarChart2 className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">{project.name} - Raporlar</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Filtreler */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex border-b mb-6 md:mb-0">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "overview"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Genel Bakış
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "tasks"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("tasks")}
              >
                Görevler
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "team"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("team")}
              >
                Ekip
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "risks"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("risks")}
              >
                Riskler
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <select
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">Son Hafta</option>
                  <option value="month">Son Ay</option>
                  <option value="quarter">Son Çeyrek</option>
                  <option value="year">Son Yıl</option>
                  <option value="all">Tüm Zamanlar</option>
                </select>
              </div>

              <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Raporu İndir
              </button>
            </div>
          </div>

          {/* Genel Bakış Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Özet Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Proje İlerlemesi</h3>
                  <p className="text-2xl font-bold text-gray-900">{project.progress}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Bütçe Kullanımı</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((project.spent / project.budget) * 100)}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className={`h-2.5 rounded-full ${project.spent > project.budget ? "bg-red-600" : "bg-blue-600"}`}
                      style={{ width: `${Math.min(100, (project.spent / project.budget) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Görev Tamamlama</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.tasksCompleted}/{project.totalTasks}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${(project.tasksCompleted / project.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Kalan Süre</h3>
                  <p className="text-2xl font-bold text-gray-900">45 gün</p>
                  <p className="text-sm text-gray-500 mt-2">Bitiş: {project.deadline}</p>
                </div>
              </div>

              {/* İlerleme Grafiği */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Aylık İlerleme</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>İlerleme</span>
                  </div>
                </div>
                <div className="h-64 flex items-end space-x-2">
                  {monthlyProgress.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-t-sm" style={{ height: `${month.progress}%` }}>
                        <div className="bg-blue-500 w-full rounded-t-sm" style={{ height: `${month.progress}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{month.month}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Görev Dağılımı ve Risk Faktörleri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Görev Dağılımı</h3>
                  <div className="flex flex-col space-y-4">
                    {taskCategories.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-gray-500">
                            {category.count} ({Math.round((category.count / totalTasks) * 100)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`${category.color} h-2.5 rounded-full`}
                            style={{ width: `${(category.count / totalTasks) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Faktörleri</h3>
                  <div className="space-y-4">
                    {riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 ${factor.status} rounded-full mr-3`}></div>
                          <span className="text-sm font-medium">{factor.name}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            factor.risk === "Yüksek"
                              ? "bg-red-100 text-red-800"
                              : factor.risk === "Orta"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {factor.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Görevler Tab */}
          {activeTab === "tasks" && (
            <div>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Görev Durumu</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span>Tamamlanan</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                      <span>Devam Eden</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                      <span>Bekleyen</span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Görev
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Atanan
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Durum
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Teslim Tarihi
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          İlerleme
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        {
                          name: "Tasarım Onayı",
                          assignee: "Zeynep Şahin",
                          status: "Tamamlandı",
                          dueDate: "15 Mart 2025",
                          progress: 100,
                        },
                        {
                          name: "Frontend Geliştirme",
                          assignee: "Ayşe Kaya",
                          status: "Devam Ediyor",
                          dueDate: "30 Nisan 2025",
                          progress: 65,
                        },
                        {
                          name: "Backend API",
                          assignee: "Mehmet Demir",
                          status: "Devam Ediyor",
                          dueDate: "15 Mayıs 2025",
                          progress: 40,
                        },
                        {
                          name: "Mobil Uygulama",
                          assignee: "Ali Can",
                          status: "Beklemede",
                          dueDate: "30 Mayıs 2025",
                          progress: 10,
                        },
                        {
                          name: "Test ve QA",
                          assignee: "Atanmadı",
                          status: "Beklemede",
                          dueDate: "10 Haziran 2025",
                          progress: 0,
                        },
                      ].map((task, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{task.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{task.assignee}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                task.status === "Tamamlandı"
                                  ? "bg-green-100 text-green-800"
                                  : task.status === "Devam Ediyor"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-xs">
                                <div
                                  className={`h-2 rounded-full ${
                                    task.status === "Tamamlandı"
                                      ? "bg-green-600"
                                      : task.status === "Devam Ediyor"
                                        ? "bg-blue-600"
                                        : "bg-yellow-600"
                                  }`}
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500">{task.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Görev Tamamlama Trendi</h3>
                  <div className="h-64 flex items-end space-x-2">
                    {["Hafta 1", "Hafta 2", "Hafta 3", "Hafta 4", "Hafta 5", "Hafta 6", "Hafta 7", "Hafta 8"].map(
                      (week, index) => {
                        const height = [10, 25, 30, 45, 55, 65, 80, 90][index]
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-gray-100 rounded-t-sm" style={{ height: `${height}%` }}>
                              <div className="bg-green-500 w-full rounded-t-sm" style={{ height: `${height}%` }}></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">{week}</div>
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Görev Öncelik Dağılımı</h3>
                  <div className="flex justify-center mb-4">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{project.totalTasks}</span>
                      </div>
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#f87171"
                          strokeWidth="20"
                          strokeDasharray="62.83 188.5"
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="20"
                          strokeDasharray="94.25 188.5"
                          strokeDashoffset="-62.83"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="20"
                          strokeDasharray="31.42 188.5"
                          strokeDashoffset="-157.08"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
                      <span className="text-sm">Yüksek (10)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
                      <span className="text-sm">Orta (15)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-1"></div>
                      <span className="text-sm">Düşük (5)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ekip Tab */}
          {activeTab === "team" && (
            <div>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Ekip Performansı</h3>
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
                          Tamamlanan Görevler
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teamPerformance.map((member, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-xs">
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
                              <span className="text-sm text-gray-500">{member.performance}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {Math.round(member.performance / 10)} / {Math.round(member.performance / 8)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Görev Dağılımı</h3>
                  <div className="space-y-4">
                    {teamPerformance.map((member, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{member.name}</span>
                          <span className="text-sm text-gray-500">{Math.round(member.performance / 10)} görev</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${(Math.round(member.performance / 10) / project.totalTasks) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Ekip Verimliliği</h3>
                  <div className="flex justify-center mb-4">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold">87%</span>
                          <p className="text-sm text-gray-500">Verimlilik</p>
                        </div>
                      </div>
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="10"
                          strokeDasharray="251.2"
                          strokeDashoffset="32.7"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Ekip verimliliği geçen aya göre <span className="text-green-600 font-medium">%5</span> arttı
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Riskler Tab */}
          {activeTab === "risks" && (
            <div>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Risk Analizi</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Risk Faktörü
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Seviye
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Etki
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Olasılık
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
                      {riskFactors.map((risk, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{risk.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                risk.risk === "Yüksek"
                                  ? "bg-red-100 text-red-800"
                                  : risk.risk === "Orta"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {risk.risk}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {risk.risk === "Yüksek" ? "Kritik" : risk.risk === "Orta" ? "Önemli" : "Düşük"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {risk.risk === "Yüksek" ? "Yüksek" : risk.risk === "Orta" ? "Orta" : "Düşük"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 ${risk.status} rounded-full mr-2`}></div>
                              <span className="text-sm text-gray-900">
                                {risk.risk === "Yüksek"
                                  ? "Acil Müdahale"
                                  : risk.risk === "Orta"
                                    ? "İzleniyor"
                                    : "Kontrol Altında"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Matrisi</h3>
                  <div className="grid grid-cols-5 grid-rows-5 gap-1 h-64">
                    {Array.from({ length: 25 }).map((_, index) => {
                      const row = Math.floor(index / 5)
                      const col = index % 5
                      const isRisk = (row === 0 && col === 4) || (row === 1 && col === 3) || (row === 2 && col === 2)
                      return (
                        <div
                          key={index}
                          className={`border ${
                            row < 2 && col > 2
                              ? "bg-red-100 border-red-200"
                              : row < 3 && col > 1
                                ? "bg-yellow-100 border-yellow-200"
                                : "bg-green-100 border-green-200"
                          } flex items-center justify-center`}
                        >
                          {isRisk && <div className="w-3 h-3 bg-black rounded-full"></div>}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Düşük Etki</span>
                    <span className="text-xs text-gray-500">Yüksek Etki</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500">Düşük</span>
                      <span className="text-xs text-gray-500">Olasılık</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">Yüksek</span>
                      <span className="text-xs text-gray-500">Olasılık</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Azaltma Planları</h3>
                  <div className="space-y-4">
                    <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <h4 className="font-medium text-red-800 mb-1">Kaynak Yetersizliği</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Proje için ek kaynak talebi yapıldı. Onay bekleniyor.
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Sorumlu: Ahmet Yılmaz</span>
                        <span>Son Tarih: 25 Nisan 2025</span>
                      </div>
                    </div>

                    <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                      <h4 className="font-medium text-yellow-800 mb-1">Zaman Aşımı</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Kritik görevler için paralel çalışma planı oluşturuldu.
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Sorumlu: Mehmet Demir</span>
                        <span>Son Tarih: 10 Nisan 2025</span>
                      </div>
                    </div>

                    <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                      <h4 className="font-medium text-yellow-800 mb-1">Teknik Zorluklar</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Dış danışman desteği alınması için görüşmeler yapılıyor.
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Sorumlu: Ayşe Kaya</span>
                        <span>Son Tarih: 5 Mayıs 2025</span>
                      </div>
                    </div>
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

