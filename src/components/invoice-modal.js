// src/components/invoice-modal.js
"use client"

import { X, FileText, DollarSign, CreditCard, Download, Printer, Mail, CheckCircle, AlertCircle } from "lucide-react"

export function InvoiceModal({ isOpen, onClose, project }) {
  if (!isOpen || !project) return null

  // Fatura durumunu belirle
  const getInvoiceStatus = () => {
    // İlerleme durumuna göre fatura durumunu belirle
    if (project.progress === 0) return { status: "beklemede", text: "Beklemede", color: "bg-yellow-100 text-yellow-800" }
    if (project.progress === 100) return { status: "odendi", text: "Ödendi", color: "bg-green-100 text-green-800" }
    if (project.progress < 30) return { status: "beklemede", text: "Beklemede", color: "bg-yellow-100 text-yellow-800" }
    if (project.progress >= 30 && project.progress < 70) return { status: "bekliyor", text: "Ödeme Bekliyor", color: "bg-blue-100 text-blue-800" }
    if (project.progress >= 70 && project.progress < 100) return { status: "gecikti", text: "Gecikti", color: "bg-red-100 text-red-800" }
    
    return { status: "bekliyor", text: "Ödeme Bekliyor", color: "bg-blue-100 text-blue-800" }
  }

  const invoiceStatus = getInvoiceStatus()

  // Fatura numarası oluştur (proje ID'sine göre tutarlı olsun)
  const invoiceNumber = `INV-${new Date().getFullYear()}-${project.id.toString().padStart(4, "0")}`
  
  // Proje başlangıç ve bitiş tarihlerini Date nesnesi olarak hazırla
  const startDate = project.startTimeRaw ? new Date(project.startTimeRaw) : new Date(project.startDate)
  const endDate = project.endTimeRaw ? new Date(project.endTimeRaw) : new Date(project.deadline)
  
  // Fatura tarihi oluştur (proje başlangıç tarihinden 5 gün sonra)
  const invoiceDate = new Date(startDate)
  invoiceDate.setDate(invoiceDate.getDate() + 5)
  const invoiceDateFormatted = invoiceDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  
  // Ödeme tarihi oluştur (fatura tarihinden 30 gün sonra)
  const dueDate = new Date(invoiceDate)
  dueDate.setDate(dueDate.getDate() + 30)
  const dueDateFormatted = dueDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

  // Fatura kalemleri oluştur
  const generateInvoiceItems = () => {
    const items = []
    
    // Ana hizmet kalemini ekle (ana proje)
    items.push({
      id: 1,
      description: project.name,
      quantity: 1,
      unitPrice: Math.round(project.price * 0.7),
      total: Math.round(project.price * 0.7)
    })
    
    // Çalışanlar için alt hizmet kalemleri ekle
    if (project.workers && project.workers.length > 0) {
      const workerServicePrice = Math.round(project.price * 0.2 / project.workers.length)
      
      project.workers.forEach((worker, index) => {
        items.push({
          id: index + 2,
          description: `${worker.name} - İş Gücü`,
          quantity: 1,
          unitPrice: workerServicePrice,
          total: workerServicePrice
        })
      })
    } else {
      // Eğer çalışan yoksa, genel bir hizmet kalemi ekle
      items.push({
        id: 2,
        description: "İş Gücü",
        quantity: 1,
        unitPrice: Math.round(project.price * 0.2),
        total: Math.round(project.price * 0.2)
      })
    }
    
    // Komisyoncular için komisyon kalemleri ekle
    if (project.commissioners && project.commissioners.length > 0) {
      project.commissioners.forEach((commissioner, index) => {
        const commissionPrice = commissioner.commission_price || Math.round(project.price * 0.1 / project.commissioners.length)
        
        items.push({
          id: project.workers ? project.workers.length + index + 2 : index + 3,
          description: `${commissioner.name} - Komisyon`,
          quantity: 1,
          unitPrice: commissionPrice,
          total: commissionPrice
        })
      })
    } else {
      // Eğer komisyoncu yoksa, diğer hizmetler kalemi ekle
      items.push({
        id: project.workers ? project.workers.length + 2 : 3,
        description: "Diğer Hizmetler",
        quantity: 1,
        unitPrice: Math.round(project.price * 0.1),
        total: Math.round(project.price * 0.1)
      })
    }
    
    return items
  }

  const invoiceItems = generateInvoiceItems()

  // Toplam tutarları hesapla
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0)
  const taxRate = 18
  const taxAmount = Math.round(subtotal * (taxRate / 100))
  const total = subtotal + taxAmount

  // Ödeme geçmişi oluştur
  const generatePaymentHistory = () => {
    if (invoiceStatus.status === "beklemede") return []

    if (invoiceStatus.status === "odendi") {
      return [
        {
          id: 1,
          date: dueDateFormatted,
          amount: total,
          method: "Banka Havalesi",
          status: "Tamamlandı",
        },
      ]
    }

    if (invoiceStatus.status === "bekliyor") {
      return []
    }

    if (invoiceStatus.status === "gecikti") {
      const partialPaymentDate = new Date(dueDate)
      partialPaymentDate.setDate(partialPaymentDate.getDate() - 15)
      
      return [
        {
          id: 1,
          date: partialPaymentDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
          amount: Math.round(total * 0.3),
          method: "Kredi Kartı",
          status: "Tamamlandı",
        },
      ]
    }
    
    return []
  }

  const paymentHistory = generatePaymentHistory()

  // Sağlayıcı bilgilerini belirle
  const getContractorInfo = () => {
    if (project.workers && project.workers.length > 0) {
      return project.workers[0].name
    }
    return project.contractor || "Belirtilmedi"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Fatura Detayları</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Fatura Başlığı ve Durum */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
              <p className="text-gray-600">{project.description}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${invoiceStatus.color}`}>
                {invoiceStatus.text}
              </span>
            </div>
          </div>

          {/* Fatura Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Fatura Bilgileri</h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fatura No:</span>
                  <span className="font-medium">{invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fatura Tarihi:</span>
                  <span className="font-medium">{invoiceDateFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Son Ödeme Tarihi:</span>
                  <span className="font-medium">{dueDateFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Proje Başlangıç:</span>
                  <span className="font-medium">{project.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Proje Bitiş:</span>
                  <span className="font-medium">{project.deadline}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Müşteri ve Sağlayıcı</h4>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Müşteri</h5>
                  <p className="text-gray-600">Şirketiniz A.Ş.</p>
                  <p className="text-gray-600">Merkez Mah. Ana Cad. No:123</p>
                  <p className="text-gray-600">İstanbul, Türkiye</p>
                  <p className="text-gray-600">Vergi No: 1234567890</p>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700">Sağlayıcı</h5>
                  <p className="text-gray-600">{getContractorInfo()}</p>
                  <p className="text-gray-600">Teknoloji Mah. Yazılım Cad. No:456</p>
                  <p className="text-gray-600">İstanbul, Türkiye</p>
                  <p className="text-gray-600">Vergi No: 0987654321</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fatura Kalemleri */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Fatura Kalemleri</h4>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Açıklama
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Miktar
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Birim Fiyat
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Toplam
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.unitPrice.toLocaleString("tr-TR")} ₺
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                        {item.total.toLocaleString("tr-TR")} ₺
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Ara Toplam:</span>
                <span className="font-medium">{subtotal.toLocaleString("tr-TR")} ₺</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">KDV (%{taxRate}):</span>
                <span className="font-medium">{taxAmount.toLocaleString("tr-TR")} ₺</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Toplam:</span>
                <span>{total.toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>
          </div>

          {/* Ödeme Geçmişi */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Ödeme Geçmişi</h4>

            {paymentHistory.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                {invoiceStatus.status === "beklemede" ? (
                  <p className="flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                    Fatura henüz ödeme için hazır değil.
                  </p>
                ) : (
                  <p className="flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                    Henüz ödeme yapılmadı.
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tarih
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tutar
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ödeme Yöntemi
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
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                          {payment.amount.toLocaleString("tr-TR")} ₺
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            {payment.method === "Banka Havalesi" ? (
                              <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                            ) : (
                              <CreditCard className="w-4 h-4 mr-2 text-purple-500" />
                            )}
                            {payment.method}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            {payment.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Toplam Durumu */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Ödeme Durumu Özeti</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Toplam Tutar</p>
                <p className="text-xl font-bold">{total.toLocaleString("tr-TR")} ₺</p>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Ödenen</p>
                <p className="text-xl font-bold">
                  {paymentHistory.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString("tr-TR")} ₺
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Kalan</p>
                <p className="text-xl font-bold">
                  {(total - paymentHistory.reduce((sum, payment) => sum + payment.amount, 0)).toLocaleString("tr-TR")} ₺
                </p>
              </div>
            </div>
          </div>

          {/* Fatura Düğmeleri */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              PDF İndir
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
              <Printer className="w-4 h-4 mr-2" />
              Yazdır
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
              <Mail className="w-4 h-4 mr-2" />
              E-posta Gönder
            </button>

            {invoiceStatus.status === "bekliyor" && (
              <button className="flex items-center ml-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                <CreditCard className="w-4 h-4 mr-2" />
                Ödeme Yap
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}