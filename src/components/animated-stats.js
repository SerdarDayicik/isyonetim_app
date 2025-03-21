"use client"

import { useEffect, useState } from "react"

export const AnimatedStats = ({ value, duration = 1500, formatter = (val) => val, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

    const updateValue = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        // Easing fonksiyonu - yavaşlayarak artma efekti
        const progressRatio = progress / duration
        const easedProgress = progressRatio === 1 ? 1 : 1 - Math.pow(2, -10 * progressRatio)

        setDisplayValue(Math.round(easedProgress * value))
        animationFrame = requestAnimationFrame(updateValue)
      } else {
        setDisplayValue(value)
      }
    }

    animationFrame = requestAnimationFrame(updateValue)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [value, duration])

  return <span className={className}>{formatter(displayValue)}</span>
}

