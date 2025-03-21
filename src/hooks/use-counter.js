"use client"

import { useState, useEffect, useCallback } from "react"

export const useCounter = (end, duration = 1000, start = 0) => {
  const [count, setCount] = useState(start)
  const [targetValue, setTargetValue] = useState(end)

  // setValue metodu ekleyelim
  const setValue = useCallback((newValue) => {
    setTargetValue(newValue)
  }, [])

  useEffect(() => {
    setTargetValue(end)
  }, [end])

  useEffect(() => {
    if (targetValue === undefined || targetValue === null) return

    // Eğer targetValue değeri 0 ise, direkt 0 olarak ayarla
    if (targetValue === 0) {
      setCount(0)
      return
    }

    // Animasyon için başlangıç zamanı
    let startTime = null
    const startValue = count

    // Animasyon fonksiyonu
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      // Animasyon ilerlemesi (0-1 arası)
      const progressRatio = Math.min(progress / duration, 1)

      // Easing fonksiyonu (yavaşlayarak artma efekti)
      const easedProgress = progressRatio === 1 ? 1 : 1 - Math.pow(2, -10 * progressRatio)

      // Mevcut değeri hesapla
      const currentValue = startValue + (targetValue - startValue) * easedProgress

      // State'i güncelle
      setCount(currentValue)

      // Animasyon tamamlanmadıysa devam et
      if (progressRatio < 1) {
        requestAnimationFrame(animate)
      }
    }

    // Animasyonu başlat
    const animationFrame = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame)
      startTime = null
    }
  }, [targetValue, duration])

  // Değeri ve setValue metodunu döndür
  return { value: count, setValue }
}

