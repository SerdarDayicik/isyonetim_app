"use client"

import { useScrollAnimation } from "../hooks/use-scroll-animation"

export const AnimatedCard = ({ children, delay = 0, className = "", ...props }) => {
  const { ref, isInView } = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className} ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  )
}

