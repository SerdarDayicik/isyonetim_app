"use client"

import { X, FileText, DollarSign, CreditCard, Download, Printer, Mail, CheckCircle, AlertCircle } from "lucide-react"

export function InvoiceModal({ isOpen, onClose, project }) {
  if (!isOpen || !project) return null

  // Fatura durumunu belirle
  const getInvoiceStatus = () => {
    if (!project.hasInvoice) return { status: "beklemede", text: "Beklemede", color: "bg-yellow-100 text-yellow-800" }

    // Örnek olarak rastgele bir durum atayalım (gerçek veriler olmadığı için)
    const statuses = [
      { status: "odendi", text: "Ödendi", color: "bg-green-100 text-green-800" },
      { status: "bekliyor", text: "Ödeme Bekliyor", color: "bg-blue-100 text-blue-800" },
      { status: "gecikti", text: "Gecikti", color: "bg-red-100 text-red-800" },
    ]

    // Proje ID'sine göre tutarlı bir durum seçelim
    const index = project.id % 3
    return statuses[index]
  }

  const invoiceStatus = getInvoiceStatus()

  // Fatura numarası oluştur (proje ID'sine göre tutarlı olsun)
  const invoiceNumber = `INV-${2025}-${project.id.toString().padStart(4, "0")}`

  // Fatura tarihi oluştur (proje başlangıç tarihinden 5 gün sonra)
  const getInvoiceDate = () => {
    const startDateParts = project.startDate.split(" ")
    const day = Number.parseInt(startDateParts[0]) + 5
    return `${day} ${startDateParts[1]} ${startDateParts[2]}`
  }

  const invoiceDate = getInvoiceDate()

  // Ödeme tarihi oluştur (fatura tarihinden 30 gün sonra)
  const getDueDate = () => {
    const startDateParts = project.startDate.split(" ")
    const day = Number.parseInt(startDateParts[0]) + 35
    return `${day} ${startDateParts[1]} ${startDateParts[2]}`
  }

  const dueDate = getDueDate()

  // Fatura kalemleri oluştur
  const generateInvoiceItems = () => {
    // Proje fiyatının %70'i ana hizmet, %20'si ek hizmetler, %10'u diğer
    const mainServicePrice = Math.round(project.price * 0.7)
    const additionalServicesPrice = Math.round(project.price * 0.2)
    const otherServicesPrice = project.price - mainServicePrice - additionalServicesPrice

    return [
      {
        id: 1,
        description: project.name,
        quantity: 1,
        unitPrice: mainServicePrice,
        total: mainServicePrice,
      },
      {
        id: 2,
        description: "Ek Hizmetler",
        quantity: 1,
        unitPrice: additionalServicesPrice,
        total: additionalServicesPrice,
      },
      {
        id: 3,
        description: "Diğer Hizmetler",
        quantity: 1,
        unitPrice: otherServicesPrice,
        total: otherServicesPrice,
      },
    ]
  }

  const invoiceItems = generateInvoiceItems()

  // KDV hesapla (%18)
  const subtotal = project.price
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
          date: dueDate,
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
      return [
        {
          id: 1,
          date: getDueDate().replace(getDueDate().split(" ")[0], Number.parseInt(getDueDate().split(" ")[0]) - 15),
          amount: Math.round(total * 0.3),
          method: "Kredi Kartı",
          status: "Tamamlandı",
        },
      ]
    }
  }

  const paymentHistory = generatePaymentHistory()

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
                  <span className="font-medium">{invoiceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Son Ödeme Tarihi:</span>
                  <span className="font-medium">{dueDate}</span>
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
                  <p className="text-gray-600">{project.contractor}</p>
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

          {/* Ödeme Bilgileri */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Ödeme Bilgileri</h4>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-4">
                <DollarSign className="w-5 h-5 text-gray-700 mr-2" />
                <h5 className="text-sm font-medium text-gray-700">Ödeme Detayları</h5>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Tutar:</span>
                  <span className="font-medium">{total.toLocaleString("tr-TR")} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ödenen Tutar:</span>
                  <span className="font-medium">
                    {paymentHistory.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kalan Tutar:</span>
                  <span className="font-medium">
                    {(total - paymentHistory.reduce((sum, payment) => sum + payment.amount, 0)).toLocaleString("tr-TR")}{" "}
                    ₺
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Son Ödeme Tarihi:</span>
                  <span className="font-medium">{dueDate}</span>
                </div>
              </div>
            </div>

            {/* Ödeme Geçmişi */}
            {paymentHistory.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Ödeme Geçmişi</h5>
                <div className="space-y-2">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <div>
                          <p className="font-medium">{payment.amount.toLocaleString("tr-TR")} ₺</p>
                          <p className="text-xs text-gray-500">
                            {payment.date} - {payment.method}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ödeme Yöntemleri */}
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Ödeme Yöntemleri</h5>
              <div className="bg-white p-3 rounded-lg border">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Banka Havalesi</p>
                    <p className="text-sm text-gray-600">Banka: Örnek Bank</p>
                    <p className="text-sm text-gray-600">IBAN: TR12 3456 7890 1234 5678 9012 34</p>
                    <p className="text-sm text-gray-600">Hesap Sahibi: {project.contractor}</p>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="font-medium">Kredi Kartı</p>
                    <p className="text-sm text-gray-600">
                      Güvenli ödeme sayfasından kredi kartı ile ödeme yapabilirsiniz.
                    </p>
                    <button className="mt-2 flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
                      <CreditCard className="w-4 h-4 mr-1" />
                      Ödeme Yap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notlar ve Şartlar */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Notlar ve Şartlar</h4>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Ödeme Şartları</h5>
                  <p className="text-sm text-gray-600">
                    Fatura tutarı, belirtilen son ödeme tarihine kadar ödenmelidir. Geç ödemeler için %2 aylık gecikme
                    faizi uygulanacaktır.
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700">Notlar</h5>
                  <p className="text-sm text-gray-600">
                    Bu fatura, {project.name} projesi için düzenlenmiştir. Proje kapsamı ve detayları için sözleşmeye
                    bakınız.
                  </p>
                </div>

                {invoiceStatus.status === "gecikti" && (
                  <div className="flex items-start p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-red-800">Gecikmiş Ödeme Uyarısı</h5>
                      <p className="text-sm text-red-700">
                        Bu faturanın son ödeme tarihi geçmiştir. Lütfen en kısa sürede ödeme yapınız.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              İndir
            </button>
            <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Printer className="w-4 h-4 mr-2" />
              Yazdır
            </button>
            <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Mail className="w-4 h-4 mr-2" />
              E-posta Gönder
            </button>
          </div>

          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}

