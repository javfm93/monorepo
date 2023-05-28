'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { BuyButton } from '../../components/BuyButton'
import './comparisonGrid.css'
import { toFilename } from './page'

enum IPhones {
  'iPhone14' = 'iPhone 14',
  'iPhone14Pro' = 'iPhone 14 Pro',
  'iPhone13' = 'iPhone 13',
  'iPhoneSE' = 'iPhone SE'
}

const toCssClass = (iphone: IPhones) =>
  ({
    [IPhones.iPhone14]: 'iphone-14',
    [IPhones.iPhone14Pro]: 'iphone-14-pro',
    [IPhones.iPhone13]: 'iphone-13',
    [IPhones.iPhoneSE]: 'iphone-se'
  }[iphone])

type IphoneSpecs = {
  isNew: boolean
  slogan: string
  price: number
  screen: {
    size: string
    resolution: string
    technology: string
    alwaysOn: boolean
  }
}

const toSpecs = (iPhone: IPhones): IphoneSpecs =>
  ({
    [IPhones.iPhone14Pro]: {
      isNew: true,
      slogan: 'The ultimate iPhone.',
      price: 999,
      screen: {
        size: '6.7″ or 6.1″',
        resolution: 'Super Retina XDR display',
        technology: 'ProMotion technology',
        alwaysOn: true
      }
    },
    [IPhones.iPhone14]: {
      isNew: true,
      slogan: 'A total powerhouse.',
      price: 799,
      screen: {
        size: '6.7″ or 6.1″',
        resolution: 'Super Retina XDR display',
        technology: '-',
        alwaysOn: false
      }
    },
    [IPhones.iPhone13]: {
      isNew: false,
      slogan: 'As amazing as ever.',
      price: 599,
      screen: {
        size: '6.1″ or 5.4″',
        resolution: 'Super Retina XDR display',
        technology: '-',
        alwaysOn: false
      }
    },
    [IPhones.iPhoneSE]: {
      isNew: false,
      slogan: 'Serious power. Serious value.',
      price: 429,
      screen: {
        size: '4.7″',
        resolution: 'Retina HD display',
        technology: '-',
        alwaysOn: false
      }
    }
  }[iPhone])

const images = {
  compare: (iphone: IPhones) => `/compare_${toFilename(iphone)}.jpeg`,
  colors: (iphone: IPhones) => `/colors_${toFilename(iphone)}.png`
}

export const IPhoneComparisonSection = () => {
  return (
    <section className="bg-[#161617] px-20 pt-28 xl:px-48 2xl:px-[22rem]">
      <header className="flex justify-between">
        <h2 className="text-5xl font-semibold">
          Which iPhone
          <br />
          is right for you?
        </h2>
        <Link href={'#'} className="place-self-end text-blue-500">
          Compare all
          <br />
          IPhone models {'>'}
        </Link>
      </header>
      <article className="grid iphone-comparison-grid gap-x-16 gap-y-10 mt-10 mx-auto max-w-lg lg:gap-x-8 lg:max-w-full lg:px-2">
        {Object.values(IPhones).map(iphone => (
          <IphoneSpecs key={iphone} iPhone={iphone} />
        ))}
      </article>
    </section>
  )
}

const IphoneSpecs: FC<{ iPhone: IPhones }> = ({ iPhone }) => {
  const iphoneCssClass = toCssClass(iPhone)
  const specs = toSpecs(iPhone)

  return (
    <>
      <div
        className={`${iphoneCssClass}-mobile flex flex-col items-center justify-center border-b pb-10`}
      >
        <Image
          className={`w-4/6 h-3/4 lg:w-4/6 lg:h-[40%]`}
          src={images.compare(iPhone)}
          alt={iPhone}
          width={380}
          height={514}
        />
        <Image
          className="h-4 w-auto mt-6"
          src={images.colors(iPhone)}
          alt={`${iPhone} colors`}
          width={276}
          height={36}
        />
        <span className={`text-xs text-red-500 mt-4 ${specs.isNew ? 'opacity-100' : 'opacity-0'}`}>
          New
        </span>
        <h3 className="text-2xl font-semibold">{iPhone}</h3>
        <h4 className="text-sm mt-1">{specs.slogan}</h4>
        <p className="text-sm mt-12">From ${specs.price}**</p>
        <BuyButton className="text-xs font-light py-0.5 px-2 mt-4" />
        <Link className="text-blue-500 mt-4 text-sm" href={'#'}>
          Learn more {'>'}
        </Link>
      </div>

      <div
        className={`${iphoneCssClass}-screen flex flex-col items-center justify-center text-sm border-b pb-10`}
      >
        <h4 className="text-base font-semibold">{specs.screen.size}</h4>
        <p>{specs.screen.resolution}</p>
        <p className="mt-2">{specs.screen.technology}</p>
        <p className="mt-2">{specs.screen.alwaysOn ? 'Always-On display' : '-'}</p>
      </div>
    </>
  )
}
