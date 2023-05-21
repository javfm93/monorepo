'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { BuyButton } from '../../components/BuyButton'

// todo: Make features lazy!!!
// todo: overflow clip vs hidden
// todo: put the arrows to go to details
// todo: add animations
// todo: rest of colors
// todo: rest of features
// todo: understand auto rows/grid a little better
// todo: make the grid responsive
// todo: texts of colors
const iphone14Video = '/iphone_14_pro_hero_video.mp4'

enum Colors {
  Purple = 'Deep Purple',
  Gold = 'Gold',
  Silver = 'Silver',
  Black = 'Space Black'
}

const colorToFilename = (color: Colors) => color.toLowerCase().replace(' ', '_')

const isColorSelected = (color: Colors, selectedColor: Colors) => color === selectedColor

const colorToStyle = (color: Colors) =>
  ({
    [Colors.Purple]: 'bg-purple-800',
    [Colors.Gold]: 'bg-yellow-100',
    [Colors.Silver]: 'bg-slate-200',
    [Colors.Black]: 'bg-gray-600'
  }[color])

const images = {
  hero: {
    iphone: (color: Colors) => `/iphone_14_pro_hero_${colorToFilename(color)}.jpeg`
  },
  features: {
    island: (color: Colors) => `/dynamic_island_${colorToFilename(color)}.jpeg`,
    camera: (color: Colors) => `/camera_${colorToFilename(color)}.jpeg`,
    chip: (color: Colors) => `/chip_${colorToFilename(color)}.jpeg`
  }
}

const ArrowSvg = () => (
  <svg className="text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path
      fillRule="evenodd"
      d="M21.71 14.918l-6.999-6.999a1.523 1.523 0 0 0-2.156 0 1.523 1.523 0 0 0 0 2.156l5.92 5.921-5.92 5.92a1.525 1.525 0 1 0 2.156 2.157l6.981-6.981.006-.007.012-.011a1.523 1.523 0 0 0 0-2.156"
      fill="currentColor"
    ></path>
  </svg>
)

const FeatureHeading: FCWithChildren<{ color: Colors }> = ({ children, className, color }) => {
  const colorToGradient = {
    [Colors.Purple]: 'from-purple-300 to-purple-700',
    [Colors.Gold]: 'from-yellow-300 to-yellow-700',
    [Colors.Silver]: 'from-blue-300 to-blue-700',
    [Colors.Black]: 'from-gray-300 to-gray-700'
  }
  return (
    <h3
      className={`text-3xl font-semibold bg-gradient-to-b ${colorToGradient[color]} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </h3>
  )
}

export type FCWithChildren<T = {}> = React.FC<{ children: ReactNode; className?: string } & T>

const Section: FCWithChildren = ({ children, className = '' }) => (
  <section className={`flex flex-col pt-8 px-6 ${className}`}>{children}</section>
)

const Iphone14ProImg = ({ color }: { color: Colors }) => {
  return (
    <div className="mt-8 mx-20 flex justify-center">
      <Image
        className="max-w-3xl animate-fade animate-duration-[2000ms] animate-ease-in-out"
        src={images.hero.iphone(color)}
        alt={`iPhone 14 ${color} image`}
        width={1325}
        height={968}
      />
    </div>
  )
}

const selectedColorStyles = 'outline-1 outline-gray-500 outline-offset-2 outline'

const useOnView = () => {
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

export default function Page() {
  const [selectedColor, setSelectedColor] = useState(Colors.Purple)
  const selectColor = (color: Colors) => () => {
    setSelectedColor(color)
  }
  const videoRef = useRef<HTMLVideoElement>(null)
  const [displayVideo, setDisplayVideo] = useState(true)

  const { ref: titleRef, inView: titleInView } = useOnView()

  useEffect(() => {
    const showColorPicker = () => {
      setDisplayVideo(false)
    }

    if (videoRef.current) {
      videoRef.current.addEventListener('ended', showColorPicker)
    }
    return () => videoRef.current?.removeEventListener('ended', showColorPicker)
  }, [])

  return (
    <>
      <section className="bg-[#161617] py-8">
        <p className="text-center">
          Get $200–$630 in credit toward iPhone 14 Pro when <br /> you trade in iPhone 11 or higher.
          <sup>1</sup>
          <Link href={'/shop/iphone'} className="text-blue-500">
            Shop iPhone
          </Link>
        </p>
      </section>

      <div className="mt-10 relative">
        <div
          className={`flex items-center justify-end gap-x-2 sticky top-[3.3rem] right-0 py-3.5 px-6 z-40 ${
            titleInView ? '' : 'backdrop-blur-xl backdrop-saturate-200 bg-[rgba(29,29,31,.72)]'
          }`}
        >
          <span className="mr-3 font-semibold text-sm text-white">{selectedColor}</span>
          {Object.values(Colors).map(color => (
            <button
              key={color}
              onClick={selectColor(color)}
              className={`h-5 w-5 rounded-full ${colorToStyle(color)} opacity-80 ${
                isColorSelected(color, selectedColor) ? selectedColorStyles : ''
              }`}
            />
          ))}
        </div>
        <section className={`flex flex-col mx-6`}>
          <h2 ref={titleRef} className="text-5xl font-medium relative -top-12">
            Pro. Beyond
          </h2>
          {displayVideo ? (
            <video className="mt-6" autoPlay muted src={iphone14Video} ref={videoRef}></video>
          ) : (
            <Iphone14ProImg color={selectedColor} />
          )}
        </section>
        <section className="bg-[#161617] py-20 flex flex-col items-center">
          <h3 className="text-2xl font-medium text-center">iPhone 14 Pro and iPhone 14 Pro Max</h3>
          <h4 className="text-gray-400 mt-4">
            From $999 or $41.62/mo. for 24 mo. before trade‑in*
          </h4>
          <BuyButton className="mt-8"></BuyButton>

          <div className="grid grid-cols-[1fr_0.5361fr_1fr] grid-flow-row auto-rows-[14rem] gap-4 px-20 pt-16 lg:px-[22rem]">
            <div className="row-span-2 col-span-2 bg-black pt-10 px-14 lg:px-20 rounded-3xl overflow-clip relative animate-fade">
              <FeatureHeading color={selectedColor} className="text-center">
                Meet <br />
                dynamic island.
              </FeatureHeading>

              <Image
                className="pt-6"
                src={images.features.island(selectedColor)}
                alt={`iPhone 14 ${selectedColor} dynamic island`}
                width={1325}
                height={968}
              />
              <button className="absolute w-7 h-7 bottom-4 right-4 bg-white rounded-full">
                <ArrowSvg />
              </button>
            </div>
            <div className="bg-black rounded-3xl overflow-clip relative">
              <Image
                className="absolute -top-10"
                src={images.features.camera(selectedColor)}
                width={1325}
                height={968}
                alt="iPhone 14 camera"
              />
              <div className="z-20 absolute flex bottom-4 right-4 left-4 justify-between">
                <p className="text-lg font-semibold">
                  48MP Main camera.
                  <br />
                  Mind-blowing detail.
                </p>
                <button className="w-7 h-7 bg-white rounded-full self-end">
                  <ArrowSvg />
                </button>
              </div>
              <div className="absolute bottom-0 w-full h-1/2 z-10 bg-gradient-to-b from-transparent to-black"></div>
            </div>
            <div className="bg-black pt-6 pl-6 rounded-3xl overflow-clip relative">
              <FeatureHeading color={selectedColor}>
                The <br /> mastermind <br />
                behind it all.
              </FeatureHeading>
              <Image
                className="mt-4"
                src={images.features.chip(selectedColor)}
                width={1325}
                height={968}
                alt="iPhone 14 chip"
              />
              <button className="absolute w-7 h-7 bottom-4 right-4 bg-white rounded-full">
                <ArrowSvg />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
