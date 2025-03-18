"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Plus, X, User, Users } from "lucide-react"

// Mock data for people search
const mockPeople = [
  { id: 1, name: "Ahmet Yılmaz", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Ayşe Demir", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: 3, name: "Mehmet Kaya", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Zeynep Çelik", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
  { id: 5, name: "Mustafa Şahin", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
]

// Mock data for brokers search
const mockBrokers = [
  { id: 1, name: "Can Özdemir", avatar: "https://randomuser.me/api/portraits/men/10.jpg" },
  { id: 2, name: "Selin Yıldız", avatar: "https://randomuser.me/api/portraits/women/11.jpg" },
  { id: 3, name: "Burak Aksoy", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
]

export function ProjectCreate() {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [price, setPrice] = useState("")

  const [peopleSearch, setPeopleSearch] = useState("")
  const [brokerSearch, setBrokerSearch] = useState("")

  const [showPeopleResults, setShowPeopleResults] = useState(false)
  const [showBrokerResults, setShowBrokerResults] = useState(false)

  const [invitedPeople, setInvitedPeople] = useState([])
  const [invitedBrokers, setInvitedBrokers] = useState([])

  const peopleSearchRef = useRef(null)
  const brokerSearchRef = useRef(null)

  // Filter people based on search term
  const filteredPeople = mockPeople.filter(
    (person) =>
      person.name.toLowerCase().includes(peopleSearch.toLowerCase()) &&
      !invitedPeople.some((invited) => invited.id === person.id),
  )

  // Filter brokers based on search term
  const filteredBrokers = mockBrokers.filter(
    (broker) =>
      broker.name.toLowerCase().includes(brokerSearch.toLowerCase()) &&
      !invitedBrokers.some((invited) => invited.id === broker.id),
  )

  // Handle click outside search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (peopleSearchRef.current && !peopleSearchRef.current.contains(event.target)) {
        setShowPeopleResults(false)
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

  // Invite a person to the project
  const invitePerson = (person) => {
    setInvitedPeople([...invitedPeople, person])
    setPeopleSearch("")
    setShowPeopleResults(false)
  }

  // Invite a broker to the project
  const inviteBroker = (broker) => {
    setInvitedBrokers([...invitedBrokers, broker])
    setBrokerSearch("")
    setShowBrokerResults(false)
  }

  // Remove an invited person
  const removePerson = (personId) => {
    setInvitedPeople(invitedPeople.filter((person) => person.id !== personId))
  }

  // Remove an invited broker
  const removeBroker = (brokerId) => {
    setInvitedBrokers(invitedBrokers.filter((broker) => broker.id !== brokerId))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    const projectData = {
      project_name: projectName,
      project_description: projectDescription,
      price: Number.parseFloat(price),
      invited_people: invitedPeople.map((p) => p.id),
      invited_brokers: invitedBrokers.map((b) => b.id),
    }

    console.log("Project data:", projectData)
    // Here you would typically send this data to your API
  }

  return (
    <div className="flex-1 overflow-auto bg-white w-full h-full">
      <div className="w-full h-full">
        <div className="bg-black text-white p-5 w-full">
          <h2 className="text-2xl font-bold">Yeni Proje Oluştur</h2>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Name and Price - Side by side */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="space-y-3 flex-1">
                <label htmlFor="projectName" className="text-sm font-medium text-gray-700 block">
                  Proje İsmi
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Projenin adını girin"
                  className="w-full px-4 py-3 border border-gray-800/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#c1ff00] focus:border-[#c1ff00]"
                  required
                />
              </div>
              <div className="space-y-3 md:w-1/3">
                <label htmlFor="price" className="text-sm font-medium text-gray-700 block">
                  Fiyat
                </label>
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 px-4 py-3 border border-gray-800/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#c1ff00] focus:border-[#c1ff00]"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₺</span>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="space-y-3">
              <label htmlFor="projectDescription" className="text-sm font-medium text-gray-700 block">
                Proje Açıklaması
              </label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Projenin detaylarını girin"
                className="w-full px-4 py-3 border border-gray-800/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#c1ff00] focus:border-[#c1ff00] min-h-[120px]"
                required
              />
            </div>

            {/* People and Broker Invitations - Side by side */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* People Invitations */}
              <div className="space-y-3 flex-1">
                <label htmlFor="peopleSearch" className="text-sm font-medium text-gray-700 block">
                  Projeye Davet Edilecek Kişiler
                </label>
                <div ref={peopleSearchRef} className="relative">
                  <div className="relative">
                    <input
                      id="peopleSearch"
                      type="text"
                      value={peopleSearch}
                      onChange={(e) => setPeopleSearch(e.target.value)}
                      onFocus={() => setShowPeopleResults(true)}
                      placeholder="Kişi ara..."
                      className="w-full pl-10 px-4 py-3 border border-gray-800/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#c1ff00] focus:border-[#c1ff00]"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  </div>

                  {/* Search Results */}
                  {showPeopleResults && filteredPeople.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-800/20">
                      <ul className="py-1">
                        {filteredPeople.map((person) => (
                          <li
                            key={person.id}
                            className="px-4 py-3 hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center">
                              <img
                                src={person.avatar || "/placeholder.svg"}
                                alt={person.name}
                                className="w-10 h-10 rounded-full mr-3 border border-gray-200"
                              />
                              <span className="font-medium">{person.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => invitePerson(person)}
                              className="text-black hover:text-[#c1ff00] px-3 py-1 rounded-md text-sm font-medium transition-colors"
                            >
                              Davet Et
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Invited People List */}
                  {invitedPeople.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {invitedPeople.map((person) => (
                        <div
                          key={person.id}
                          className="flex items-center gap-1 px-3 py-2 bg-black/5 text-black border border-gray-800/20 rounded-full"
                        >
                          <User className="h-4 w-4" />
                          <span className="font-medium">{person.name}</span>
                          <button
                            type="button"
                            onClick={() => removePerson(person.id)}
                            className="ml-1 text-black hover:text-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Broker Invitations */}
              <div className="space-y-3 flex-1">
                <label htmlFor="brokerSearch" className="text-sm font-medium text-gray-700 block">
                  Komisyoncu Daveti
                </label>
                <div ref={brokerSearchRef} className="relative">
                  <div className="relative">
                    <input
                      id="brokerSearch"
                      type="text"
                      value={brokerSearch}
                      onChange={(e) => setBrokerSearch(e.target.value)}
                      onFocus={() => setShowBrokerResults(true)}
                      placeholder="Komisyoncu ara..."
                      className="w-full pl-10 px-4 py-3 border border-gray-800/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#c1ff00] focus:border-[#c1ff00]"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  </div>

                  {/* Search Results */}
                  {showBrokerResults && filteredBrokers.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-800/20">
                      <ul className="py-1">
                        {filteredBrokers.map((broker) => (
                          <li
                            key={broker.id}
                            className="px-4 py-3 hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center">
                              <img
                                src={broker.avatar || "/placeholder.svg"}
                                alt={broker.name}
                                className="w-10 h-10 rounded-full mr-3 border border-gray-200"
                              />
                              <span className="font-medium">{broker.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => inviteBroker(broker)}
                              className="text-black hover:text-[#c1ff00] px-3 py-1 rounded-md text-sm font-medium transition-colors"
                            >
                              Davet Et
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Invited Brokers List */}
                  {invitedBrokers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {invitedBrokers.map((broker) => (
                        <div
                          key={broker.id}
                          className="flex items-center gap-1 px-3 py-2 bg-black/5 text-black border border-gray-800/20 rounded-full"
                        >
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{broker.name}</span>
                          <button
                            type="button"
                            onClick={() => removeBroker(broker.id)}
                            className="ml-1 text-black hover:text-red-600 transition-colors"
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

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white py-4 px-4 rounded-md transition-all flex items-center justify-center font-medium text-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Proje Oluştur
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

