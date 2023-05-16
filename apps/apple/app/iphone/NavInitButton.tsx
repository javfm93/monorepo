'use client'
import { FC } from 'react'

export const NavInitButton: FC = () => {
  return (
    <button
      className="border-r-2 pr-2 static left-0"
      onClick={() => {
        document.getElementById('products-nav').scrollTo({
          left: 4000,
          behavior: 'smooth'
        })
      }}
    >
      {'>'}
    </button>
  )
}
