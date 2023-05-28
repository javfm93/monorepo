import Image from 'next/image'
import { FC } from 'react'
import { Colors, FCWithChildren, toFilename } from './page'

const cinematicModeVideo = '/cinematic_mode.mp4'

const images = {
  features: {
    island: (color: Colors) => `/dynamic_island_${toFilename(color)}.jpeg`,
    camera: (color: Colors) => `/camera_${toFilename(color)}.jpeg`,
    chip: (color: Colors) => `/chip_${toFilename(color)}.jpeg`
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
    <section className="grid grid-cols-1 gap-y-4 grid-flow-row auto-rows-[28rem] pt-16 mx-auto px-6 bg-[#161617] sm:auto-rows-[14rem] sm:grid-cols-[1fr_0.5361fr_1fr] sm:gap-4 sm:px-20 lg:gap-x-8 lg:max-w-full lg:px-36 2xl:px-96">
      <article className="h-full bg-black pt-10 rounded-3xl overflow-clip relative animate-fade sm:row-span-2 sm:col-span-2 sm:px-14 lg:px-20">
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

      <article className="bg-black rounded-3xl overflow-clip relative sm:col-span-2">
        <video autoPlay muted src={cinematicModeVideo} />

        <div className="z-20 absolute flex bottom-4 right-4 left-4">
          <div className="text-lg font-semibold flex-grow text-center">
            <p>Pro video</p>
            <h3 className="text-3xl font-semibold">Film like a Pro.</h3>
          </div>
          <h3></h3>
          <button className="w-7 h-7 bg-white rounded-full self-end">
            <ArrowSvg />
          </button>
        </div>
      </article>
    </section>
  )
}
