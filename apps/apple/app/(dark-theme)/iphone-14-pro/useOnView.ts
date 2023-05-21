'use client'
import { useEffect, useRef, useState } from 'react'

export const useOnView = () => {
  const [inView, setInView] = useState(true)
  const ref = useRef()
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setInView(entry.isIntersecting)
      })
    })
    observer.observe(ref.current)
    return () => observer.unobserve(ref.current)
  }, [])
  return { ref, inView }
}
