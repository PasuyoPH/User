import { Constants } from 'app-types'

const colorIsLight = (color: string) => {
  if (!color) color = Constants.Colors.All.main

  const hex = color.replace('#', ''),
    c_r = parseInt(hex.substring(0, 0 + 2), 16),
    c_g = parseInt(hex.substring(2, 2 + 2), 16),
    c_b = parseInt(hex.substring(4, 4 + 2), 16),
    brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000

  return brightness > 155
}

export default colorIsLight