'use client'
import Image from 'next/image'
import { FC } from 'react'
import { Colors, FCWithChildren, colorToFilename } from './page'

const iphone14Video = '/iphone_14_pro_hero_video.mp4'

const images = {
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

export const FeaturesSection: FC<{ color: Colors }> = ({ color }) => {
  return (
    <section className="grid grid-cols-[1fr_0.5361fr_1fr] grid-flow-row auto-rows-[14rem] bg-[#161617] gap-4 px-20 pt-16 lg:px-[22rem]">
      <article className="row-span-2 col-span-2 bg-black pt-10 px-14 lg:px-20 rounded-3xl overflow-clip relative animate-fade">
        <FeatureHeading color={color} className="text-center">
          Meet <br />
          dynamic island.
        </FeatureHeading>

        <Image
          className="pt-6"
          src={images.features.island(color)}
          alt={`iPhone 14 ${color} dynamic island`}
          width={1325}
          height={968}
        />
        <button className="absolute w-7 h-7 bottom-4 right-4 bg-white rounded-full">
          <ArrowSvg />
        </button>
      </article>
      <article className="bg-black rounded-3xl overflow-clip relative">
        <Image
          className="absolute -top-10"
          src={images.features.camera(color)}
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
      </article>
      <article className="bg-black pt-6 pl-6 rounded-3xl overflow-clip relative">
        <FeatureHeading color={color}>
          The <br /> mastermind <br />
          behind it all.
        </FeatureHeading>
        <Image
          className="mt-4"
          src={images.features.chip(color)}
          width={1325}
          height={968}
          alt="iPhone 14 chip"
        />
        <button className="absolute w-7 h-7 bottom-4 right-4 bg-white rounded-full">
          <ArrowSvg />
        </button>
      </article>
      <article className="bg-black pt-6 pl-6 rounded-3xl overflow-clip relative">
        <p>A battery that’s</p>
        <FeatureHeading color={color} className="text-5xl">
          all in,
          <br /> all day.
        </FeatureHeading>
        <button className="absolute w-7 h-7 bottom-4 right-4 bg-white rounded-full">
          <ArrowSvg />
        </button>
      </article>
      <article className="bg-black col-span-2 pt-6 pl-6 rounded-3xl overflow-clip relative">
        <video autoPlay muted src={iphone14Video}></video>

        <button className="absolute w-7 h-7 bottom-4 right-4 bg-white rounded-full">
          <ArrowSvg />
        </button>
      </article>
    </section>
  )
}
