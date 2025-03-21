"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { Percent, X, DollarSign, Calendar, Clock, User } from "lucide-react"
import { AnimatedStats } from "./animated-stats"

export const CommissionModal = ({ isOpen, onClose, project }) => {
  const [animationTriggered, setAnimationTriggered] = useState(false)

  // Modal açıldığında animasyonu tetikle
  useState(() => {
    if (isOpen && project) {
      setAnimationTriggered(true)
    } else {
      setTimeout(() => {
        setAnimationTriggered(false)
      }, 300)
    }
  }, [isOpen, project])

  if (!project) return null

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

  const paymentStatusDetails = getPaymentStatusDetails(project.paymentStatus || "kısmi-ödeme")

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
                    Komisyon Bilgileri
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h4>
                  <p className="text-gray-600">{project.description}</p>
                </div>

                <Transition
                  show={animationTriggered}
                  enter="transition-all duration-500"
                  enterFrom="opacity-0 -translate-y-4"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition-all duration-300"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-4"
                >
                  <div className="bg-blue-50 rounded-lg p-5 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full mr-4">
                          <Percent className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">Komisyon Oranı</h5>
                          <p className="text-2xl font-bold text-gray-900">%{project.commissionRate}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full mr-4">
                          <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">Komisyon Tutarı</h5>
                          <p className="text-2xl font-bold text-blue-600">
                            <AnimatedStats
                              value={project.commissionAmount}
                              formatter={(val) => val.toLocaleString("tr-TR") + " ₺"}
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>

                <Transition
                  show={animationTriggered}
                  enter="transition-all duration-500 delay-100"
                  enterFrom="opacity-0 translate-y-4"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition-all duration-300"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Proje Bilgileri</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Proje Tutarı:</span>
                            <span className="font-medium">{project.totalPrice?.toLocaleString("tr-TR")} ₺</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Komisyon Oranı:</span>
                            <span className="font-medium">%{project.commissionRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Komisyon Tutarı:</span>
                            <span className="font-medium text-blue-600">
                              {project.commissionAmount?.toLocaleString("tr-TR")} ₺
                            </span>
                          </div>
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Ödeme Durumu:</span>
                              <span className={`font-medium ${paymentStatusDetails.color}`}>
                                {paymentStatusDetails.text}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Proje Detayları</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-700">
                            <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-sm">Başlangıç: {project.startDate}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Clock className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-sm">Teslim: {project.deadline}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <User className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-sm">Müşteri: {project.client}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>

                <Transition
                  show={animationTriggered}
                  enter="transition-all duration-500 delay-200"
                  enterFrom="opacity-0 translate-y-4"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition-all duration-300"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-4"
                >
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Ödeme Bilgileri</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Ödeme Yöntemi:</span>
                        <span className="font-medium">Banka Transferi</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Ödeme Tarihi:</span>
                        <span className="font-medium">
                          {project.paymentStatus === "ödendi"
                            ? "15 Haziran 2025"
                            : project.paymentStatus === "kısmi-ödeme"
                              ? "Kısmi ödeme alındı"
                              : "Bekleniyor"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Fatura Durumu:</span>
                        <span className="font-medium">
                          {project.paymentStatus === "ödendi" ? "Kesildi" : "Beklemede"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Transition>

                <Transition
                  show={animationTriggered}
                  enter="transition-all duration-500 delay-300"
                  enterFrom="opacity-0 translate-y-4"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition-all duration-300"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-4"
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

