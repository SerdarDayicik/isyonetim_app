"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { Calendar, DollarSign, FileText, Users, CheckCircle, Clock, Briefcase, Search, X } from "lucide-react"

export function ProjectCreate() {
  // API'den çekilecek kullanıcılar için state
  const API_KEY = process.env.REACT_APP_API_URL

  const [users, setUsers] = useState([])

  // formData state'ine komisyoncu bilgisini ekleyin
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    client: "",
    startDate: "",
    deadline: "",
    budget: "",
    priority: "orta",
    projectType: "web",
    teamMembers: [],
    broker: "", // Komisyoncu bilgisi için yeni alan
  })

  const [selectedTeamMembers, setSelectedTeamMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showTeamResults, setShowTeamResults] = useState(false)

  // Komisyoncu arama için state ekleyin
  const [brokerSearchTerm, setBrokerSearchTerm] = useState("")
  const [selectedBroker, setSelectedBroker] = useState(null)
  const [showBrokerResults, setShowBrokerResults] = useState(false)

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Referanslar
  const teamSearchRef = useRef(null)
  const brokerSearchRef = useRef(null)

  // API'den kullanıcıları çek
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_KEY}/Session/user_list`)
        if (response.ok) {
          const data = await response.json()
          // Her kullanıcıya id ekle
          const usersWithId = data.map((user, index) => ({
            ...user,
            id: user.id || index + 1,
            avatar:
              user.profile_photo_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
            role: user.role || "Kullanıcı", // Varsayılan rol
            company: user.company || "Şirket Belirtilmedi", // Varsayılan şirket
          }))
          setUsers(usersWithId)
        } else {
          console.error("Failed to fetch users")
          toast.error("Kullanıcı listesi yüklenemedi!")
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        toast.error("Kullanıcı listesi yüklenemedi!")
      }
    }

    fetchUsers()
  }, [])

  // Dışarı tıklandığında sonuçları kapat
  useEffect(() => {
    function handleClickOutside(event) {
      if (teamSearchRef.current && !teamSearchRef.current.contains(event.target)) {
        setShowTeamResults(false)
      }
      if (brokerSearchRef.current && !brokerSearchRef.current.contains(event.target)) {
        setShowBrokerResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Hata varsa temizle
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleTeamMemberSelect = (member) => {
    if (!selectedTeamMembers.some((m) => m.id === member.id)) {
      setSelectedTeamMembers((prev) => [...prev, member])
      setFormData((prev) => ({ ...prev, teamMembers: [...prev.teamMembers, member.id] }))
    }
    setSearchTerm("")
    setShowTeamResults(false)
  }

  const handleTeamMemberRemove = (memberId) => {
    setSelectedTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
    setFormData((prev) => ({ ...prev, teamMembers: prev.teamMembers.filter((id) => id !== memberId) }))
  }

  // Komisyoncu seçimi için fonksiyon ekleyin
  const handleBrokerSelect = (broker) => {
    setSelectedBroker(broker)
    setFormData((prev) => ({ ...prev, broker: broker.id }))
    setBrokerSearchTerm("")
    setShowBrokerResults(false)
  }

  // Komisyoncu kaldırma için fonksiyon ekleyin
  const handleBrokerRemove = () => {
    setSelectedBroker(null)
    setFormData((prev) => ({ ...prev, broker: "" }))
  }

  // Filtrelenmiş ekip üyeleri
  const filteredTeamMembers = users.filter(
    (member) =>
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.role && member.role.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      !selectedTeamMembers.some((m) => m.id === member.id),
  )

  // Filtrelenmiş komisyoncu listesi için hesaplama ekleyin
  const filteredBrokers = users.filter(
    (broker) =>
      (broker.name.toLowerCase().includes(brokerSearchTerm.toLowerCase()) ||
        (broker.company && broker.company.toLowerCase().includes(brokerSearchTerm.toLowerCase()))) &&
      (!selectedBroker || broker.id !== selectedBroker.id),
  )

  const validateForm = () => {
    const newErrors = {}

    if (!formData.projectName.trim()) newErrors.projectName = "Proje adı gereklidir"
    if (!formData.description.trim()) newErrors.description = "Proje açıklaması gereklidir"
    if (!formData.client.trim()) newErrors.client = "Müşteri adı gereklidir"
    if (!formData.startDate) newErrors.startDate = "Başlangıç tarihi gereklidir"
    if (!formData.deadline) newErrors.deadline = "Bitiş tarihi gereklidir"
    if (formData.startDate && formData.deadline && new Date(formData.startDate) > new Date(formData.deadline)) {
      newErrors.deadline = "Bitiş tarihi başlangıç tarihinden sonra olmalıdır"
    }
    if (!formData.budget.trim()) newErrors.budget = "Bütçe gereklidir"
    if (isNaN(Number(formData.budget))) newErrors.budget = "Bütçe sayısal bir değer olmalıdır"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Butonun disabled durumunu kontrol etmek için yeni bir fonksiyon ekleyin
  // validateForm fonksiyonundan sonra ve handleSubmit fonksiyonundan önce ekleyin:

  const isFormComplete = () => {
    return (
      formData.projectName.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.client.trim() !== "" &&
      formData.startDate !== "" &&
      formData.deadline !== "" &&
      formData.budget.trim() !== "" &&
      !isNaN(Number(formData.budget)) &&
      selectedTeamMembers.length > 0 &&
      selectedBroker !== null
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // API için veri hazırla
      const projectData = {
        project_name: formData.projectName,
        price: Number.parseFloat(formData.budget),
        description: formData.description,
        invitees: selectedTeamMembers.map((member) => member.name),
        brokers: selectedBroker ? [selectedBroker.name] : [],
        // Diğer alanları da ekleyebilirsiniz
        start_date: formData.startDate,
        deadline: formData.deadline,
        priority: formData.priority,
        project_type: formData.projectType,
      }

      // API isteği
      const response = await fetch("http://10.33.41.153:8000/Project/CreateProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        toast.success("Proje başarıyla oluşturuldu!")
        // Formu sıfırla
        setFormData({
          projectName: "",
          description: "",
          client: "",
          startDate: "",
          deadline: "",
          budget: "",
          priority: "orta",
          projectType: "web",
          teamMembers: [],
          broker: "",
        })
        setSelectedTeamMembers([])
        setSelectedBroker(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(`Hata: ${errorData.message || "Bir hata oluştu"}`)
      }
    } catch (error) {
      console.error("Hata:", error)
      toast.error("Proje oluşturulurken bir hata oluştu.")
    } finally {
      setIsLoading(false)
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

  const priorityDetails = getPriorityDetails(formData.priority)

  return (
    <div className="p-6 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Yeni Proje Oluştur</h3>
        <p className="text-gray-600">Yeni bir proje oluşturmak için aşağıdaki formu doldurun.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Taraf - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Temel Bilgiler */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-700" />
                    Proje Bilgileri
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                        Proje Adı <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        className={`w-full p-2.5 border ${errors.projectName ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Proje adını girin"
                      />
                      {errors.projectName && <p className="mt-1 text-sm text-red-500">{errors.projectName}</p>}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Proje Açıklaması <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className={`w-full p-2.5 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Proje detaylarını girin"
                      ></textarea>
                      {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                          Müşteri <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="client"
                          name="client"
                          value={formData.client}
                          onChange={handleChange}
                          className={`w-full p-2.5 border ${errors.client ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Müşteri adını girin"
                        />
                        {errors.client && <p className="mt-1 text-sm text-red-500">{errors.client}</p>}
                      </div>

                      <div>
                        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                          Proje Tipi
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="web">Web Geliştirme</option>
                          <option value="mobile">Mobil Uygulama</option>
                          <option value="design">Tasarım</option>
                          <option value="marketing">Pazarlama</option>
                          <option value="consulting">Danışmanlık</option>
                          <option value="other">Diğer</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zaman ve Bütçe */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-700" />
                    Zaman ve Bütçe
                  </h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Başlangıç Tarihi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className={`w-full p-2.5 border ${errors.startDate ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
                      </div>

                      <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                          Bitiş Tarihi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="deadline"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleChange}
                          className={`w-full p-2.5 border ${errors.deadline ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                          Bütçe (₺) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className={`w-full p-2.5 border ${errors.budget ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Proje bütçesini girin"
                        />
                        {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
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
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="düşük">Düşük</option>
                          <option value="orta">Orta</option>
                          <option value="yüksek">Yüksek</option>
                          <option value="kritik">Kritik</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ekip Üyeleri */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-700" />
                    Ekip Üyeleri
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ekip Üyesi Ekle</label>
                      <div className="relative" ref={teamSearchRef}>
                        <div className="relative">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowTeamResults(true)}
                            className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ekip üyesi ara..."
                          />
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>

                        {showTeamResults && searchTerm && filteredTeamMembers.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredTeamMembers.map((member) => (
                              <div
                                key={member.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                onClick={() => handleTeamMemberSelect(member)}
                              >
                                <div className="flex items-center">
                                  <img
                                    src={member.avatar || "/placeholder.svg"}
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full mr-2"
                                  />
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-xs text-gray-500">{member.role}</div>
                                  </div>
                                </div>
                                <button type="button" className="text-blue-600 hover:text-blue-800 text-sm">
                                  Ekle
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Seçilen Ekip Üyeleri</h5>
                      {selectedTeamMembers.length === 0 ? (
                        <p className="text-gray-500 text-sm">Henüz ekip üyesi seçilmedi</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedTeamMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center">
                                <img
                                  src={member.avatar || "/placeholder.svg"}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-xs text-gray-500">{member.role}</div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleTeamMemberRemove(member.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Komisyoncu */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-gray-700" />
                    Komisyoncu
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Komisyoncu Ekle</label>
                      <div className="relative" ref={brokerSearchRef}>
                        <div className="relative">
                          <input
                            type="text"
                            value={brokerSearchTerm}
                            onChange={(e) => setBrokerSearchTerm(e.target.value)}
                            onFocus={() => setShowBrokerResults(true)}
                            className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Komisyoncu ara..."
                          />
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>

                        {showBrokerResults && brokerSearchTerm && filteredBrokers.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredBrokers.map((broker) => (
                              <div
                                key={broker.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                onClick={() => handleBrokerSelect(broker)}
                              >
                                <div className="flex items-center">
                                  <img
                                    src={broker.avatar || "/placeholder.svg"}
                                    alt={broker.name}
                                    className="w-8 h-8 rounded-full mr-2"
                                  />
                                  <div>
                                    <div className="font-medium">{broker.name}</div>
                                    <div className="text-xs text-gray-500">{broker.company}</div>
                                  </div>
                                </div>
                                <button type="button" className="text-blue-600 hover:text-blue-800 text-sm">
                                  Ekle
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Seçilen Komisyoncu</h5>
                      {selectedBroker === null ? (
                        <p className="text-gray-500 text-sm">Henüz komisyoncu seçilmedi</p>
                      ) : (
                        <div className="space-y-2">
                          <div
                            key={selectedBroker.id}
                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center">
                              <img
                                src={selectedBroker.avatar || "/placeholder.svg"}
                                alt={selectedBroker.name}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <div className="font-medium">{selectedBroker.name}</div>
                                <div className="text-xs text-gray-500">{selectedBroker.company}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleBrokerRemove()}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">{/* Buton buradan kaldırıldı */}</div>
            </form>
          </div>
        </div>

        {/* Sağ Taraf - Önizleme */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-6">
            <div className="p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Proje Önizleme</h4>

              <div className="space-y-6">
                {/* Proje Adı ve Açıklama */}
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2">{formData.projectName || "Proje Adı"}</h5>
                  <p className="text-gray-600 mb-4">{formData.description || "Proje açıklaması burada görünecek."}</p>

                  {/* Öncelik */}
                  <div className="flex items-center mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityDetails.color}`}>
                      {priorityDetails.text}
                    </span>
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formData.projectType === "web"
                        ? "Web Geliştirme"
                        : formData.projectType === "mobile"
                          ? "Mobil Uygulama"
                          : formData.projectType === "design"
                            ? "Tasarım"
                            : formData.projectType === "marketing"
                              ? "Pazarlama"
                              : formData.projectType === "consulting"
                                ? "Danışmanlık"
                                : "Diğer"}
                    </span>
                  </div>
                </div>

                {/* Müşteri ve Tarihler */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Müşteri: <span className="font-medium">{formData.client || "Belirtilmedi"}</span>
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Başlangıç: <span className="font-medium">{formData.startDate || "Belirtilmedi"}</span>
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Bitiş: <span className="font-medium">{formData.deadline || "Belirtilmedi"}</span>
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Bütçe:{" "}
                      <span className="font-medium">
                        {formData.budget ? `${Number(formData.budget).toLocaleString("tr-TR")} ₺` : "Belirtilmedi"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Ekip */}
                <div>
                  <div className="flex items-center text-gray-700 mb-2">
                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Ekip Üyeleri ({selectedTeamMembers.length})</span>
                  </div>

                  {selectedTeamMembers.length === 0 ? (
                    <p className="text-gray-500 text-sm">Henüz ekip üyesi seçilmedi</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamMembers.map((member) => (
                        <div key={member.id} className="flex items-center">
                          <img
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            title={`${member.name} - ${member.role}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Komisyoncu */}
                <div>
                  <div className="flex items-center text-gray-700 mb-2">
                    <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Komisyoncu</span>
                  </div>

                  {!selectedBroker ? (
                    <p className="text-gray-500 text-sm">Henüz komisyoncu seçilmedi</p>
                  ) : (
                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <img
                        src={selectedBroker.avatar || "/placeholder.svg"}
                        alt={selectedBroker.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium">{selectedBroker.name}</div>
                        <div className="text-xs text-gray-500">{selectedBroker.company}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kontrol Listesi */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Kontrol Listesi</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${formData.projectName ? "text-green-500" : "text-gray-300"}`}
                      />
                      <span className={`text-sm ${formData.projectName ? "text-gray-700" : "text-gray-400"}`}>
                        Proje adı
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${formData.description ? "text-green-500" : "text-gray-300"}`}
                      />
                      <span className={`text-sm ${formData.description ? "text-gray-700" : "text-gray-400"}`}>
                        Proje açıklaması
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${formData.client ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-sm ${formData.client ? "text-gray-700" : "text-gray-400"}`}>
                        Müşteri bilgisi
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${formData.startDate && formData.deadline ? "text-green-500" : "text-gray-300"}`}
                      />
                      <span
                        className={`text-sm ${formData.startDate && formData.deadline ? "text-gray-700" : "text-gray-400"}`}
                      >
                        Proje tarihleri
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${formData.budget ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-sm ${formData.budget ? "text-gray-700" : "text-gray-400"}`}>
                        Bütçe bilgisi
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${selectedTeamMembers.length > 0 ? "text-green-500" : "text-gray-300"}`}
                      />
                      <span className={`text-sm ${selectedTeamMembers.length > 0 ? "text-gray-700" : "text-gray-400"}`}>
                        Ekip üyeleri
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${selectedBroker ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-sm ${selectedBroker ? "text-gray-700" : "text-gray-400"}`}>
                        Komisyoncu
                      </span>
                    </li>
                  </ul>

                  {/* Buton kontrol listesinin altına eklendi */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !isFormComplete()}
                    className={`w-full mt-6 px-6 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                      isFormComplete()
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? "Oluşturuluyor..." : "Proje Oluştur"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

