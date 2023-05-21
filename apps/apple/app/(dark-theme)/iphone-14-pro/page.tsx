'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { BuyButton } from '../../components/BuyButton'

// todo: overflow clip vs hidden
// todo: put the arrows to go to details
// todo: add animations
// todo: rest of colors
// todo: rest of features
// todo: understand auto rows/grid a little better
// todo: make the grid responsive
// todo: texts of colors
const iphone14Video =
  'https://www.apple.com/105/media/us/iphone-14-pro/2023/b094f6e4-dcdb-494f-bd72-45d659126dcd/anim/hero/medium.mp4'

const purpleIphoneImg =
  'https://www.apple.com/v/iphone-14-pro/h/images/key-features/hero/hero_deep_purple__dlhl8s8j6wk2_large.jpg'
const purpleIslandFeature =
  'https://www.apple.com/v/iphone-14-pro/h/images/key-features/features/dynamic-island/dynamic_island_deep_purple__exowosw6732a_medium_2x.jpg'
const purpleCameraFeature =
  'https://www.apple.com/v/iphone-14-pro/h/images/key-features/features/main-camera/camera_deep_purple__fviv8fv1dyqa_medium_2x.jpg'
const purpleChipFeature =
  'https://www.apple.com/v/iphone-14-pro/h/images/key-features/features/chip/chip_deep_purple__bs3dtgitlt6q_large_2x.jpg'

const blackIphoneImg =
  'https://www.apple.com/v/iphone-14-pro/h/images/key-features/hero/hero_space_black__d2ll5e0lazcm_large.jpg'
const silverIphoneImg =
  'https://www.apple.com/v/iphone-14-pro/h/images/key-features/hero/hero_silver__8is8ix39ybm2_large.jpg'
const goldIphoneImg =
  'https://www.apple.com/v/iphone-14-pro/h/images/key-features/hero/hero_gold__eys85yr14k2u_large.jpg'

enum Colors {
  Purple = 'Deep Purple',
  Black = 'Space Black',
  Silver = 'Silver',
  Gold = 'Gold'
}

const images = {
  hero: {
    iphone: {
      [Colors.Purple]: purpleIphoneImg,
      [Colors.Black]: blackIphoneImg,
      [Colors.Silver]: silverIphoneImg,
      [Colors.Gold]: goldIphoneImg
    }
  },
  features: {
    island: {
      [Colors.Purple]: purpleIslandFeature
    },
    camera: {
      [Colors.Purple]: purpleCameraFeature
    },
    chip: {
      [Colors.Purple]: purpleChipFeature
    }
  }
}

const ArrowSvg = () => (
  <svg className="text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path
      fill-rule="evenodd"
      d="M21.71 14.918l-6.999-6.999a1.523 1.523 0 0 0-2.156 0 1.523 1.523 0 0 0 0 2.156l5.92 5.921-5.92 5.92a1.525 1.525 0 1 0 2.156 2.157l6.981-6.981.006-.007.012-.011a1.523 1.523 0 0 0 0-2.156"
      fill="currentColor"
    ></path>
  </svg>
)

const FeatureHeading: FCWithChildren = ({ children, className }) => (
  <h3
    className={`text-3xl font-semibold bg-gradient-to-b from-purple-300 to-purple-700 bg-clip-text text-transparent ${className}`}
  >
    {children}
  </h3>
)

export type FCWithChildren<T = {}> = React.FC<{ children: ReactNode; className?: string } & T>

const Section: FCWithChildren = ({ children, className = '' }) => (
  <section className={`flex flex-col pt-8 px-6 ${className}`}>{children}</section>
)

const Iphone14ProImg = ({ color }: { color: Colors }) => {
  return (
    <div className="mt-16 mx-20 flex justify-center">
      <Image
        className="max-w-3xl animate-fade animate-duration-[2000ms] animate-ease-in-out"
        src={images.hero.iphone[color]}
        alt={`iPhone 14 ${color} image`}
        width={1325}
        height={968}
      />
    </div>
  )
}

const selectedColorStyles = 'outline-1 outline-gray-500 outline-offset-2 outline'

export default function Page() {
  const [selectedColor, setSelectedColor] = useState(Colors.Purple)
  const selectColor = (color: Colors) => () => {
    setSelectedColor(color)
  }
  const videoRef = useRef<HTMLVideoElement>(null)
  const [displayVideo, setDisplayVideo] = useState(true)

  useEffect(() => {
    const showColorPicker = () => {
      setDisplayVideo(false)
    }

    console.log('videoRef.current', videoRef.current)

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
      <Section>
        <header className="flex justify-between">
          <h2 className="text-5xl font-medium">Pro. Beyond</h2>
          <div className="flex items-center gap-x-2">
            <span className="mr-3">{selectedColor}</span>
            <button
              onClick={selectColor(Colors.Purple)}
              className={`h-5 w-5 rounded-full bg-purple-800 opacity-80 ${
                selectedColor === 'Deep Purple' ? selectedColorStyles : ''
              }`}
            ></button>
            <button
              onClick={selectColor(Colors.Gold)}
              className={`h-5 w-5 rounded-full bg-yellow-100 opacity-80 ${
                selectedColor === 'Gold' ? selectedColorStyles : ''
              }`}
            ></button>
            <button
              onClick={selectColor(Colors.Silver)}
              className={`h-5 w-5 rounded-full bg-slate-200 opacity-80 ${
                selectedColor === 'Silver' ? selectedColorStyles : ''
              }`}
            ></button>
            <button
              onClick={selectColor(Colors.Black)}
              className={`h-5 w-5 rounded-full bg-gray-600 opacity-80 ${
                selectedColor === 'Space Black' ? selectedColorStyles : ''
              }`}
            ></button>
          </div>
        </header>
        {displayVideo ? (
          <video className="mt-8" autoPlay muted src={iphone14Video} ref={videoRef}></video>
        ) : (
          <Iphone14ProImg color={selectedColor} />
        )}
      </Section>
      <section className="bg-[#161617] py-20 flex flex-col items-center">
        <h3 className="text-2xl font-medium text-center">iPhone 14 Pro and iPhone 14 Pro Max</h3>
        <h4 className="text-gray-400 mt-4">From $999 or $41.62/mo. for 24 mo. before trade‑in*</h4>
        <BuyButton className="mt-8"></BuyButton>

        <div className="grid grid-cols-[1fr_0.5361fr_1fr] grid-flow-row auto-rows-[14rem] gap-4 px-20 pt-16 lg:px-[22rem]">
          <div className="row-span-2 col-span-2 bg-black pt-10 px-14 lg:px-20 rounded-3xl overflow-clip relative">
            <FeatureHeading className="text-center">
              Meet <br />
              dynamic island.
            </FeatureHeading>

            <Image
              className="pt-6"
              src={images.features.island[selectedColor]}
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
              src={images.features.camera[selectedColor]}
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
            <FeatureHeading>
              The <br /> mastermind <br />
              behind it all.
            </FeatureHeading>
            <Image
              className="mt-4"
              src={images.features.chip[selectedColor]}
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
    </>
  )
}
