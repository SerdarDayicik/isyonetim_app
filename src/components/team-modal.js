"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { Users, X, Mail, Phone, Briefcase } from "lucide-react"

export const TeamModal = ({ isOpen, onClose, project }) => {
  const [activeTab, setActiveTab] = useState("workers")

  if (!project) return null

  // Takım üyelerini ve komisyoncuları göster
  const workers = project.workers || []
  const commissioners = project.commissioners || []

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
                    {project.name} - Ekip Bilgileri
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab("workers")}
                      className={`${
                        activeTab === "workers"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Çalışanlar ({workers.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("commissioners")}
                      className={`${
                        activeTab === "commissioners"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <Briefcase className="w-5 h-5 mr-2" />
                      Komisyoncular ({commissioners.length})
                    </button>
                  </nav>
                </div>

                {/* Workers Tab */}
                {activeTab === "workers" && (
                  <div className="space-y-4">
                    {workers.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Bu projede çalışan bulunamadı.</p>
                    ) : (
                      workers.map((worker, index) => (
                        <Transition
                          key={index}
                          show={true}
                          enter="transition-all duration-300"
                          enterFrom="opacity-0 translate-y-4"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition-all duration-200"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-4"
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-lg font-medium text-gray-600">
                                  {worker.name ? worker.name.charAt(0).toUpperCase() : "W"}
                                </span>
                              </div>
                              <div className="ml-4 flex-1">
                                <h4 className="text-lg font-medium text-gray-900">{worker.name || "Çalışan"}</h4>
                                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                  {worker.email && (
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                      <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                      {worker.email}
                                    </div>
                                  )}
                                  {worker.phone && (
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                      <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                      {worker.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Transition>
                      ))
                    )}
                  </div>
                )}

                {/* Commissioners Tab */}
                {activeTab === "commissioners" && (
                  <div className="space-y-4">
                    {commissioners.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Bu projede komisyoncu bulunamadı.</p>
                    ) : (
                      commissioners.map((commissioner, index) => (
                        <Transition
                          key={index}
                          show={true}
                          enter="transition-all duration-300"
                          enterFrom="opacity-0 translate-y-4"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition-all duration-200"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-4"
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          <div className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-lg font-medium text-blue-600">
                                  {commissioner.name ? commissioner.name.charAt(0).toUpperCase() : "C"}
                                </span>
                              </div>
                              <div className="ml-4 flex-1">
                                <h4 className="text-lg font-medium text-gray-900">
                                  {commissioner.name || "Komisyoncu"}
                                </h4>
                                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                  {commissioner.email && (
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                      <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                      {commissioner.email}
                                    </div>
                                  )}
                                  {commissioner.phone && (
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                      <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                      {commissioner.phone}
                                    </div>
                                  )}
                                  {commissioner.commission_price && (
                                    <div className="mt-2 flex items-center text-sm text-blue-600 font-medium">
                                      <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-blue-500" />
                                      Komisyon: {commissioner.commission_price.toLocaleString("tr-TR")} ₺
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Transition>
                      ))
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-300 hover:scale-105"
                    onClick={onClose}
                  >
                    Kapat
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

