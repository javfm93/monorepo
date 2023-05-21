import { BuyButton } from '../../components/BuyButton'

export const CTASection = () => {
  return (
    <section className="bg-[#161617] pt-20 flex flex-col items-center">
      <h3 className="text-2xl font-medium text-center">iPhone 14 Pro and iPhone 14 Pro Max</h3>
      <h4 className="text-gray-400 mt-4">From $999 or $41.62/mo. for 24 mo. before trade‑in*</h4>
      <BuyButton className="mt-8"></BuyButton>
    </section>
  )
}
