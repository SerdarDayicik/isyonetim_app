"use client"

import { X, Users, Mail, Phone, Calendar, Clock, Briefcase } from "lucide-react"

export function TeamModal({ isOpen, onClose, project }) {
  if (!isOpen || !project) return null

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
    },
  ].slice(0, project.teamSize || 0)

  // Eğer takım üyesi sayısı 4'ten az ise, kalan üyeleri oluştur
  if (teamMembers.length < project.teamSize) {
    const additionalMembers = [
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
      },
      {
        id: 6,
        name: "Elif Yıldız",
        role: "QA Uzmanı",
        email: "elif.yildiz@example.com",
        phone: "+90 555 678 9012",
        joinDate: "5 Şubat 2025",
        experience: "4 yıl",
        skills: ["Test Otomasyonu", "Manuel Test", "Kalite Güvence", "Hata Takibi"],
        avatar: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 7,
        name: "Burak Kara",
        role: "DevOps Mühendisi",
        email: "burak.kara@example.com",
        phone: "+90 555 789 0123",
        joinDate: "10 Şubat 2025",
        experience: "5 yıl",
        skills: ["Docker", "Kubernetes", "CI/CD", "AWS"],
        avatar: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 8,
        name: "Selin Aksoy",
        role: "Veri Analisti",
        email: "selin.aksoy@example.com",
        phone: "+90 555 890 1234",
        joinDate: "15 Şubat 2025",
        experience: "3 yıl",
        skills: ["SQL", "Python", "Veri Görselleştirme", "İstatistik"],
        avatar: "/placeholder.svg?height=80&width=80",
      },
    ]

    const neededMembers = project.teamSize - teamMembers.length
    teamMembers.push(...additionalMembers.slice(0, neededMembers))
  }

  // Rol bazlı dağılım
  const roleDistribution = teamMembers.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1
    return acc
  }, {})

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">{project.name} - Ekip</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Ekip Özeti */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ekip Özeti</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Toplam Üye</h4>
                <p className="font-medium">{project.teamSize} kişi</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Proje Başlangıcı</h4>
                <p className="font-medium">{project.startDate}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Sizin Rolünüz</h4>
                <p className="font-medium">{project.role || "Belirtilmemiş"}</p>
              </div>
            </div>

            {/* Rol Dağılımı */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Rol Dağılımı</h4>
              <div className="space-y-3">
                {Object.entries(roleDistribution).map(([role, count], index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{role}</span>
                      <span>{count} kişi</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          index % 4 === 0
                            ? "bg-blue-600"
                            : index % 4 === 1
                              ? "bg-green-600"
                              : index % 4 === 2
                                ? "bg-purple-600"
                                : "bg-orange-600"
                        }`}
                        style={{ width: `${(count / project.teamSize) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ekip Üyeleri */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ekip Üyeleri</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
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
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{member.name}</h4>
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ekip İletişimi */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ekip İletişimi</h3>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Briefcase className="w-5 h-5 text-gray-700 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Toplantı Bilgileri</h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium">Haftalık Durum Toplantısı</p>
                    <p className="text-sm text-gray-500">Her Pazartesi, 10:00</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Düzenli</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium">Sprint Planlama</p>
                    <p className="text-sm text-gray-500">Her iki haftada bir, Çarşamba 14:00</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Düzenli
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium">Proje Değerlendirme</p>
                    <p className="text-sm text-gray-500">20 Nisan 2025, 11:00</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Özel</span>
                </div>
              </div>
            </div>
          </div>
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

