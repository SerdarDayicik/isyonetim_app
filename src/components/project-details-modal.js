"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState, useEffect } from "react"
import { Calendar, Clock, DollarSign, User, Users, X } from "lucide-react"
import { useCounter } from "../hooks/use-counter"
import { AnimatedStats } from "./animated-stats"

export const ProjectDetailsModal = ({ isOpen, onClose, project }) => {
  const [animationTriggered, setAnimationTriggered] = useState(false)

  // useCounter hook'unu doğru şekilde kullan
  const budgetCounter = useCounter(0, 1500)
  const spentCounter = useCounter(0, 1500)
  const progressCounter = useCounter(0, 1000)
  const tasksCompletedCounter = useCounter(0, 1000)

  useEffect(() => {
    if (isOpen && project) {
      setAnimationTriggered(true)

      // Update counters with project values when modal opens
      budgetCounter.setValue(project.budget || 0)
      spentCounter.setValue(project.spent || 0)
      progressCounter.setValue(project.progress || 0)
      tasksCompletedCounter.setValue(project.tasksCompleted || 0)
    } else {
      // Modal kapandığında animasyonu sıfırla
      setTimeout(() => {
        setAnimationTriggered(false)
      }, 300)
    }
  }, [isOpen, project, budgetCounter, spentCounter, progressCounter, tasksCompletedCounter])

  if (!project) return null

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

  // Öncelik renklerini ve metinlerini belirle (eğer varsa)
  const getPriorityDetails = (priority) => {
    if (!priority) return null

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

  const statusDetails = getStatusDetails(project.status)
  const priorityDetails = project.priority ? getPriorityDetails(project.priority) : null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900">
                    {project.name}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.color}`}>
                    {statusDetails.text}
                  </span>
                  {priorityDetails && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityDetails.color}`}>
                      {priorityDetails.text}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-6">{project.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Transition
                    show={animationTriggered}
                    enter="transition-all duration-500"
                    enterFrom="opacity-0 -translate-x-10"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition-all duration-300"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 -translate-x-10"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Proje Detayları</h4>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                          <span className="text-sm">Başlangıç: {project.startDate}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="w-5 h-5 mr-2 text-gray-500" />
                          <span className="text-sm">Teslim: {project.deadline || "Belirtilmemiş"}</span>
                        </div>
                        {project.client && (
                          <div className="flex items-center text-gray-700">
                            <User className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-sm">Müşteri: {project.client}</span>
                          </div>
                        )}
                        {project.teamSize && (
                          <div className="flex items-center text-gray-700">
                            <Users className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-sm">Ekip Büyüklüğü: {project.teamSize} kişi</span>
                          </div>
                        )}
                        {project.budget && (
                          <div className="flex items-center text-gray-700">
                            <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-sm">
                              Bütçe:{" "}
                              <AnimatedStats
                                value={budgetCounter.value}
                                formatter={(val) => val.toLocaleString("tr-TR") + " ₺"}
                                className="inline font-medium"
                              />
                            </span>
                          </div>
                        )}
                        {project.spent && (
                          <div className="flex items-center text-gray-700">
                            <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-sm">
                              Harcanan:{" "}
                              <AnimatedStats
                                value={spentCounter.value}
                                formatter={(val) => val.toLocaleString("tr-TR") + " ₺"}
                                className="inline font-medium"
                              />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Transition>

                  <Transition
                    show={animationTriggered}
                    enter="transition-all duration-500 delay-200"
                    enterFrom="opacity-0 translate-x-10"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition-all duration-300"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-10"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">İlerleme</h4>
                      {project.progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Tamamlanma</span>
                            <span className="text-sm font-medium text-gray-700">
                              {Math.round(progressCounter.value)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                project.status === "tamamlandi" ? "bg-green-600" : "bg-blue-600"
                              } transition-all duration-1000 ease-out`}
                              style={{ width: `${progressCounter.value}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {project.tasksCompleted !== undefined && project.totalTasks !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Görevler</span>
                            <span className="text-sm font-medium text-gray-700">
                              {Math.round(tasksCompletedCounter.value)}/{project.totalTasks}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${(tasksCompletedCounter.value / project.totalTasks) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Transition>
                </div>

                {/* Çalışanlar Listesi */}
                {project.workers && project.workers.length > 0 && (
                  <Transition
                    show={animationTriggered}
                    enter="transition-all duration-500 delay-300"
                    enterFrom="opacity-0 translate-y-10"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-all duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-10"
                  >
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Çalışanlar</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {project.workers.map((worker, index) => (
                            <Transition
                              key={index}
                              show={animationTriggered}
                              enter="transition-all duration-300"
                              enterFrom="opacity-0 scale-95"
                              enterTo="opacity-100 scale-100"
                              leave="transition-all duration-200"
                              leaveFrom="opacity-100 scale-100"
                              leaveTo="opacity-0 scale-95"
                              style={{ transitionDelay: `${index * 100}ms` }}
                            >
                              <div className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors">
                                <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600">
                                    {worker.name ? worker.name.charAt(0).toUpperCase() : "W"}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{worker.name || "Çalışan"}</p>
                                  <p className="text-xs text-gray-500">{worker.email || "Email bilgisi yok"}</p>
                                </div>
                              </div>
                            </Transition>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Transition>
                )}

                {/* Komisyoncular Listesi */}
                {project.commissioners && project.commissioners.length > 0 && (
                  <Transition
                    show={animationTriggered}
                    enter="transition-all duration-500 delay-400"
                    enterFrom="opacity-0 translate-y-10"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-all duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-10"
                  >
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Komisyoncular</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {project.commissioners.map((commissioner, index) => (
                            <Transition
                              key={index}
                              show={animationTriggered}
                              enter="transition-all duration-300"
                              enterFrom="opacity-0 scale-95"
                              enterTo="opacity-100 scale-100"
                              leave="transition-all duration-200"
                              leaveFrom="opacity-100 scale-100"
                              leaveTo="opacity-0 scale-95"
                              style={{ transitionDelay: `${index * 100}ms` }}
                            >
                              <div className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors">
                                <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {commissioner.name ? commissioner.name.charAt(0).toUpperCase() : "C"}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {commissioner.name || "Komisyoncu"}
                                  </p>
                                  <p className="text-xs text-gray-500">{commissioner.email || "Email bilgisi yok"}</p>
                                  {commissioner.commission_price && (
                                    <p className="text-xs text-blue-600">
                                      Komisyon:{" "}
                                      <AnimatedStats
                                        value={commissioner.commission_price}
                                        formatter={(val) => val.toLocaleString("tr-TR") + " ₺"}
                                        className="inline"
                                      />
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Transition>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Transition>
                )}

                <Transition
                  show={animationTriggered}
                  enter="transition-all duration-500 delay-500"
                  enterFrom="opacity-0 translate-y-5"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition-all duration-300"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-5"
                >
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-300 hover:scale-105"
                      onClick={onClose}
                    >
                      Kapat
                    </button>
                  </div>
                </Transition>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

