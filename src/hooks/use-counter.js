import { useState, useEffect } from 'react';

export const useCounter = (end, duration = 1000, start = 0) => {
  const [count, setCount] = useState(start);
  
  useEffect(() => {
    if (end === undefined || end === null) return;
    
    // Eğer end değeri 0 ise, direkt 0 olarak ayarla
    if (end === 0) {
      setCount(0);
      return;
    }
    
    // Animasyon için başlangıç zamanı
    let startTime = null;
    const startValue = start;
    
    // Animasyon fonksiyonu
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Animasyon ilerlemesi (0-1 arası)
      const progressRatio = Math.min(progress / duration, 1);
      
      // Easing fonksiyonu (yavaşlayarak artma efekti)
      const easedProgress = progressRatio === 1 ? 1 : 1 - Math.pow(2, -10 * progressRatio);
      
      // Mevcut değeri hesapla
      const currentValue = startValue + (end - startValue) * easedProgress;
      
      // State'i güncelle
      setCount(currentValue);
      
      // Animasyon tamamlanmadıysa devam et
      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    // Animasyonu başlat
    requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      startTime = null;
    };
  }, [end, duration, start]);
  
  return count;
};
