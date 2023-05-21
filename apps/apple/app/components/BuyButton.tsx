import { FC } from 'react'

export const BuyButton: FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded-full ${className}`}
    >
      Buy
    </button>
  )
}
