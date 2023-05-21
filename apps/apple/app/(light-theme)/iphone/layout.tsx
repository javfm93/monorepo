'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Routes } from '../../routes'

const iphoneImg =
  'https://www.apple.com/v/iphone/home/bo/images/chapternav/iphone_14_pro_light__dfhcc00ur2oi_large.svg'
const compareImg =
  'https://www.apple.com/v/iphone/home/bo/images/chapternav/iphone_compare_light__f4jj7brpbvm2_large.svg'
const airpodsImg =
  'https://www.apple.com/v/iphone/home/bo/images/chapternav/airpods_light__8oj157p2476a_large.svg'
const airtagImg =
  'https://www.apple.com/v/iphone/home/bo/images/chapternav/airtag_light__cb2bmnv6aoeu_large.svg'
const accessoriesImg =
  'https://www.apple.com/v/iphone/home/bo/images/chapternav/accessories_light__ed5l6ipsevqu_large.svg'
const appleCardImg =
  'https://www.apple.com/v/iphone/home/bo/images/chapternav/iphone_apple_card_light__dtut839e76c2_large.svg'
const iosImg =
  'https://www.apple.com/v/iphone/home/bo/images/chapternav/iphone_ios_light__b8s4ws8o77iq_large.svg'
const shopIPhoneImg =
  'https://www.apple.com/v/iphone/home/bo/images/chapternav/shop_iphone_light__b2toggskllle_large.svg'
const images = {
  iphone: iphoneImg,
  compare: compareImg,
  airPods: airpodsImg,
  airTag: airtagImg,
  accessories: accessoriesImg,
  appleCard: appleCardImg,
  ios: iosImg,
  shopIPhone: shopIPhoneImg
}

type NavProduct = { img: string; name: string; route: Routes; isNew?: boolean }

const products: NavProduct[] = [
  {
    img: images.iphone,
    name: 'iphone 14 Pro',
    route: Routes.iphone14pro,
    isNew: true
  },
  {
    img: images.iphone,
    route: Routes.iphone14pro,
    name: 'iphone 14'
  },
  {
    img: images.iphone,
    name: 'iphone 13',
    route: Routes.iphone14pro
  },
  {
    img: images.iphone,
    name: 'iphone SE',
    route: Routes.iphone14pro
  },
  {
    img: images.iphone,
    name: 'iphone 12',
    route: Routes.iphone14pro
  },
  {
    img: images.compare,
    name: 'Compare',
    route: Routes.iphone14pro
  },
  {
    img: images.airPods,
    name: 'AirPods',
    route: Routes.iphone14pro
  },
  {
    img: images.airTag,
    name: 'AirTag',
    route: Routes.iphone14pro
  },
  {
    img: images.accessories,
    name: 'Accessories',
    route: Routes.iphone14pro
  },
  {
    img: images.appleCard,
    name: 'Apple Card',
    route: Routes.iphone14pro
  },
  {
    img: images.ios,
    name: 'iOS 16',
    route: Routes.iphone14pro
  },
  {
    img: images.shopIPhone,
    name: 'Shop iPhone',
    route: Routes.iphone14pro
  }
]
export type FCWithChildren<Props = {}> = React.FC<{ children: React.ReactNode } & Props>

export default function RootLayout({ children }) {
  const nav = useRef<HTMLUListElement>(null)
  const [showButton, setShowButton] = useState(false)
  const [showEndButton, setShowEndButton] = useState(true)
  const [show, setShow] = useState(false)

  useEffect(() => {
    nav.current.addEventListener('scroll', () => {
      console.log(nav.current.scrollLeft, nav.current.scrollWidth, nav.current.clientWidth)
      if (nav.current.scrollLeft + nav.current.clientWidth < nav.current.scrollWidth) {
        setShowEndButton(true)
      } else {
        setShowEndButton(false)
      }
      if (nav.current.scrollLeft === 0) {
        setShowButton(false)
      } else {
        setShowButton(true)
      }
    })
  }, [])

  useEffect(() => {
    setShow(true)
  })

  return (
    <>
      <header>
        <nav
          className={`flex bg-gray-50 ${
            show
              ? 'transition-all ease-in-out duration-300 transform -translate-x-20 relative left-20 opacity-1'
              : 'opacity-0'
          }`}
        >
          <button
            className={`border-r-2 ml-2 pr-2 h-22 my-3 opacity-${showButton ? 1 : 0}`}
            onClick={e => {
              nav.current.scrollTo({
                left: 0,
                behavior: 'smooth'
              })
            }}
          >
            {'<'}
          </button>
          <ul className="flex overflow-x-auto scrollbar-hidden py-3 gap-x-10" ref={nav}>
            {products.map(product => (
              <Link key={product.name} href={product.route} className="group">
                <li className="flex flex-col items-center">
                  <Image
                    src={product.img}
                    width={40}
                    height={54}
                    alt={product.name}
                    className="h-14 w-14"
                  />
                  <span className="text-xs whitespace-nowrap group-hover:text-blue-500">
                    {product.name}
                  </span>
                  {product.isNew && <span className="text-xs text-red-800">New</span>}
                </li>
              </Link>
            ))}
          </ul>
          <button
            className={`border-l-2 pl-2 mr-2 h-22 my-3 opacity-${showEndButton ? 1 : 0}`}
            onClick={() => {
              nav.current.scrollTo({
                left: 40000,
                behavior: 'smooth'
              })
            }}
          >
            {'>'}
          </button>
        </nav>
      </header>
      {children}
    </>
  )
}
