'use client'
import { ReactNode, useState } from 'react'
import { CTASection } from './CTASection'
import { ColorPicker } from './ColorPicker'
import { FeaturesSection } from './FeaturesSection'
import { HeroSection } from './HeroSection'
import { IPhoneComparisonSection } from './IPhoneComparisonSection'
import { TradeInSection } from './TradeInSection'
import './comparisonGrid.css'
import { useOnView } from './useOnView'
// todo: implement the arrow button functionality
// todo: Make features lazy!!!
// todo: overflow clip vs hidden
// todo: put the arrows to go to details
// todo: add animations
// todo: rest of features
// todo: understand auto rows/grid a little better
// todo: make the grid responsive
// todo: Use zunstand for the color or fine grain context

// todo:  would be nice to do an value object
export enum Colors {
  Purple = 'Deep Purple',
  Gold = 'Gold',
  Silver = 'Silver',
  Black = 'Space Black'
}
export const toFilename = (string: string) => string.toLowerCase().replaceAll(' ', '_')
export const isColorSelected = (color: Colors, selectedColor: Colors) => color === selectedColor
export const colorToStyle = (color: Colors) =>
  ({
    [Colors.Purple]: 'bg-purple-800',
    [Colors.Gold]: 'bg-yellow-100',
    [Colors.Silver]: 'bg-slate-200',
    [Colors.Black]: 'bg-gray-600'
  }[color])

export type FCWithChildren<T = {}> = React.FC<{ children: ReactNode; className?: string } & T>

export default function Page() {
  const [color, setColor] = useState(Colors.Purple)
  const { ref: titleRef, inView: titleInView } = useOnView()

  return (
    <>
      <TradeInSection />
      <div className="pt-10 relative">
        <ColorPicker color={color} setColor={setColor} titleInView={titleInView} />
        <HeroSection color={color} titleRef={titleRef} />
        <CTASection />
        <FeaturesSection color={color} />
      </div>
      <IPhoneComparisonSection />
    </>
  )
}
