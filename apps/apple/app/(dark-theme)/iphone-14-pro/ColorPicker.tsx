import { FC } from 'react'
import { Colors, colorToStyle, isColorSelected } from './page'

const outline = 'outline-1 outline-gray-500 outline-offset-2 outline'

type Props = {
  color: Colors
  setColor: (color: Colors) => void
  titleInView: boolean
}

export const ColorPicker: FC<Props> = ({ color: selectedColor, setColor, titleInView }) => {
  return (
    <div
      className={`flex items-center justify-end gap-x-2 sticky top-[3.3rem] right-0 py-3.5 px-6 z-40 ${
        titleInView ? '' : 'backdrop-blur-xl backdrop-saturate-200 bg-[rgba(29,29,31,.72)]'
      }`}
    >
      <span className="mr-3 font-semibold text-sm text-white">{selectedColor}</span>
      {Object.values(Colors).map(color => (
        <button
          key={color}
          onClick={() => setColor(color)}
          className={`h-5 w-5 rounded-full ${colorToStyle(color)} opacity-80 ${
            isColorSelected(color, selectedColor) ? outline : ''
          }`}
        />
      ))}
    </div>
  )
}
