import Image from 'next/image'
import Link from 'next/link'

const iphonesImg =
  'https://www.apple.com/v/iphone/home/bo/images/overview/hero/hero_iphone_14__de41900yuggi_medium.jpg'
const iphone14ProSectionImg =
  'https://www.apple.com/v/iphone/home/bo/images/overview/hero/hero_iphone_14_pro__e8bufymdlseq_medium.jpg'

const images = {
  sections: {
    iphone14: iphonesImg,
    iphone14Pro: iphone14ProSectionImg
  }
}

const Section = ({ children, className = '' }) => (
  <section className={`flex flex-col items-center pt-12 ${className}`}>{children}</section>
)

export default function Page() {
  return (
    <>
      <section className="bg-gray-100 py-8">
        <p className="text-center">
          Get $200–$630 in credit toward iPhone 14 or iPhone 14 Pro when you <br />
          trade in iPhone 11 or higher.<sup>1</sup>
          <Link href={'/shop/iphone'} className="text-blue-500">
            Shop iPhone
          </Link>
        </p>
      </section>
      <Section>
        <p className="text-gray-500 text-xs">New</p>
        <p className="mt-2"> iPhone 14</p>
        <h2 className="text-5xl mt-4"> Wonderful.</h2>
        <p className="text-xl mt-8">
          From $799 or $33.29/mo. for 24 mo. before trade‑in<sup>2</sup>
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded-full">
          Buy
        </button>
        <Link className="text-blue-500 mt-4" href={'/iphone'}>
          Learn more {'>'}
        </Link>
        <Image
          className="mt-16"
          src={images.sections.iphone14}
          alt="iPhone 14 image in different colors"
          width={675}
          height={342}
        />
      </Section>
      <Section className="bg-black mt-16">
        <p className="text-white mt-4">iPhone 14 Pro</p>
        <h2 className="text-white text-5xl mt-4"> Pro. Beyond.</h2>
        <p className="text-white text-xl mt-8">
          From $999 or $41.62/mo. for 24 mo. before trade‑in<sup>2</sup>
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded-full">
          Buy
        </button>
        <Link className="text-blue-500 mt-4" href={'/iphone'}>
          Learn more {'>'}
        </Link>
        <Image
          className="mt-16"
          src={images.sections.iphone14Pro}
          alt="iPhone 14 pro image in different colors"
          width={686}
          height={282}
        />
      </Section>
    </>
  )
}
