"use client"

import { useState, useEffect } from "react"
import { X, Settings, Bell, Shield, User, Palette, Save } from "lucide-react"

export function SettingsModal({ isOpen, onClose, project }) {
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    client: "",
    priority: "orta",
    notifications: {
      email: true,
      push: true,
      daily: false,
      weekly: true,
    },
    privacy: {
      isPublic: false,
      requireApproval: true,
      showBudget: true,
    },
    appearance: {
      theme: "light",
      accentColor: "blue",
    },
  })

  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.name,
        description: project.description,
        client: project.client,
        priority: project.priority || "orta",
        notifications: {
          email: true,
          push: true,
          daily: false,
          weekly: true,
        },
        privacy: {
          isPublic: false,
          requireApproval: true,
          showBudget: true,
        },
        appearance: {
          theme: "light",
          accentColor: "blue",
        },
      })
    }
  }, [project])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === "checkbox" ? checked : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Burada API'ye gönderme işlemi yapılabilir
    console.log("Ayarlar kaydedildi:", formData)
    // Başarılı mesajı göster
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Settings className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">{project?.name} - Proje Ayarları</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Sol Taraf - Tabs */}
          <div className="w-64 border-r bg-gray-50">
            <nav className="p-4 space-y-1">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-md ${
                  activeTab === "general" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <User size={18} />
                <span>Genel Ayarlar</span>
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-md ${
                  activeTab === "notifications" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <Bell size={18} />
                <span>Bildirimler</span>
              </button>

              <button
                onClick={() => setActiveTab("privacy")}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-md ${
                  activeTab === "privacy" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <Shield size={18} />
                <span>Gizlilik ve Erişim</span>
              </button>

              <button
                onClick={() => setActiveTab("appearance")}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-md ${
                  activeTab === "appearance" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <Palette size={18} />
                <span>Görünüm</span>
              </button>
            </nav>
          </div>

          {/* Sağ Taraf - İçerik */}
          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {/* Genel Ayarlar */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900">Genel Proje Ayarları</h3>

                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                      Proje Adı
                    </label>
                    <input
                      type="text"
                      id="projectName"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Proje Açıklaması
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                      Müşteri
                    </label>
                    <input
                      type="text"
                      id="client"
                      name="client"
                      value={formData.client}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Öncelik
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="düşük">Düşük</option>
                      <option value="orta">Orta</option>
                      <option value="yüksek">Yüksek</option>
                      <option value="kritik">Kritik</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tehlikeli Bölge</h4>
                    <button type="button" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                      Projeyi Arşivle
                    </button>
                  </div>
                </div>
              )}

              {/* Bildirimler */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900">Bildirim Ayarları</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">E-posta Bildirimleri</h4>
                        <p className="text-sm text-gray-500">Proje güncellemeleri hakkında e-posta alın</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          name="notifications.email"
                          checked={formData.notifications.email}
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Push Bildirimleri</h4>
                        <p className="text-sm text-gray-500">Anlık bildirimler alın</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          name="notifications.push"
                          checked={formData.notifications.push}
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Günlük Özet</h4>
                        <p className="text-sm text-gray-500">Her gün proje özeti alın</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          name="notifications.daily"
                          checked={formData.notifications.daily}
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Haftalık Rapor</h4>
                        <p className="text-sm text-gray-500">Her hafta proje raporu alın</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          name="notifications.weekly"
                          checked={formData.notifications.weekly}
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Gizlilik ve Erişim */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900">Gizlilik ve Erişim Ayarları</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Herkese Açık Proje</h4>
                        <p className="text-sm text-gray-500">Projeyi şirket içinde herkese görünür yap</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          name="privacy.isPublic"
                          checked={formData.privacy.isPublic}
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Onay Gerektir</h4>
                        <p className="text-sm text-gray-500">Yeni ekip üyeleri için onay gerektir</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          name="privacy.requireApproval"
                          checked={formData.privacy.requireApproval}
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Bütçe Bilgilerini Göster</h4>
                        <p className="text-sm text-gray-500">Bütçe bilgilerini ekip üyelerine göster</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          name="privacy.showBudget"
                          checked={formData.privacy.showBudget}
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Erişim Yönetimi</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <div className="font-medium">Proje Yöneticileri</div>
                          <div className="text-sm text-gray-500">Tam erişim</div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">Düzenle</button>
                      </div>

                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <div className="font-medium">Ekip Üyeleri</div>
                          <div className="text-sm text-gray-500">Düzenleme erişimi</div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">Düzenle</button>
                      </div>

                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <div className="font-medium">Müşteriler</div>
                          <div className="text-sm text-gray-500">Görüntüleme erişimi</div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">Düzenle</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Görünüm */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900">Görünüm Ayarları</h3>

                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                      Tema
                    </label>
                    <select
                      id="theme"
                      name="appearance.theme"
                      value={formData.appearance.theme}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="light">Açık Tema</option>
                      <option value="dark">Koyu Tema</option>
                      <option value="system">Sistem Teması</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 mb-1">
                      Vurgu Rengi
                    </label>
                    <select
                      id="accentColor"
                      name="appearance.accentColor"
                      value={formData.appearance.accentColor}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="blue">Mavi</option>
                      <option value="green">Yeşil</option>
                      <option value="purple">Mor</option>
                      <option value="red">Kırmızı</option>
                      <option value="orange">Turuncu</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Önizleme</h4>
                    <div
                      className={`p-4 rounded-lg border ${
                        formData.appearance.theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            formData.appearance.accentColor === "blue"
                              ? "bg-blue-500"
                              : formData.appearance.accentColor === "green"
                                ? "bg-green-500"
                                : formData.appearance.accentColor === "purple"
                                  ? "bg-purple-500"
                                  : formData.appearance.accentColor === "red"
                                    ? "bg-red-500"
                                    : "bg-orange-500"
                          }`}
                        ></div>
                        <span className="font-medium">Proje Başlığı</span>
                      </div>
                      <div
                        className={`w-full h-2 rounded-full ${
                          formData.appearance.theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                        } mb-2`}
                      >
                        <div
                          className={`h-2 rounded-full ${
                            formData.appearance.accentColor === "blue"
                              ? "bg-blue-500"
                              : formData.appearance.accentColor === "green"
                                ? "bg-green-500"
                                : formData.appearance.accentColor === "purple"
                                  ? "bg-purple-500"
                                  : formData.appearance.accentColor === "red"
                                    ? "bg-red-500"
                                    : "bg-orange-500"
                          }`}
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                      <div className="text-xs">Örnek metin içeriği</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Ayarları Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

