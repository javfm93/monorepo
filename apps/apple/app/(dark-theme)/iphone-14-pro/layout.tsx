'use client'

import Link from 'next/link'
import { Routes } from '../../routes'

export default function RootLayout({ children }) {
  return (
    <>
      <header className="flex flex-row items-center py-2.5 px-6 border-b-gray-600 bg-black border-b-[1px] z-50 sticky top-0">
        <h2 className="text-2xl flex-grow">iPhone 4 Pro</h2>
        <ul className="flex flex-basis-1/2 gap-5 text-xs items-center">
          <li>
            <Link className="text-gray-500" href={Routes.iphone14pro}>
              Overview
            </Link>
          </li>
          <li>Switch from Android to iPhone</li>
          <li>Tech Specs</li>
          <li>
            <button className={`bg-blue-500 hover:bg-blue-700 py-1 px-3 rounded-full`}>Buy</button>{' '}
          </li>
        </ul>
      </header>
      {children}
    </>
  )
}
