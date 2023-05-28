'use client'
import Image from 'next/image'
import { FC, RefObject, useEffect, useRef, useState } from 'react'
import { Colors, toFilename } from './page'

const iphone14Video = '/iphone_14_pro_hero_video.mp4'

const images = {
  hero: {
    iphone: (color: Colors) => `/iphone_14_pro_hero_${toFilename(color)}.jpeg`
  }
}

export const HeroSection: FC<{
  color: Colors
  titleRef: RefObject<HTMLHeadingElement>
}> = ({ color: selectedColor, titleRef }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [displayVideo, setDisplayVideo] = useState(true)

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
    <section className="flex flex-col mx-6">
      <h2 ref={titleRef} className="text-5xl font-medium relative -top-12">
        Pro. Beyond
      </h2>
      {displayVideo ? (
        <video className="mt-6" autoPlay muted src={iphone14Video} ref={videoRef}></video>
      ) : (
        <div className="mt-8 mx-20 flex justify-center">
          <Image
            className="max-w-3xl animate-fade animate-duration-[2000ms] animate-ease-in-out"
            src={images.hero.iphone(selectedColor)}
            alt={`iPhone 14 ${selectedColor} image`}
            width={1325}
            height={968}
          />
        </div>
      )}
    </section>
  )
}
