import Link from 'next/link'

export const TradeInSection = () => {
  return (
    <section className="bg-[#161617] py-8">
      <p className="text-center">
        Get $200–$630 in credit toward iPhone 14 Pro when <br /> you trade in iPhone 11 or higher.
        <sup>1</sup>
        <Link href={'/shop/iphone'} className="text-blue-500">
          Shop iPhone
        </Link>
      </p>
    </section>
  )
}
