'use client'
import { FC } from 'react'

export const NavEndButton: FC = () => {
  return (
    <button
      className="border-l-2 pl-2 static right-0"
      onClick={() => {
        document.getElementById('products-nav').scrollTo({
          left: 0,
          behavior: 'smooth'
        })
      }}
    >
      {'<'}
    </button>
  )
}
