import { rgbColour } from "../types"

export const rgbObjToString = (rgbColour: rgbColour) => {
  const { r, g, b } = rgbColour
  return `${r},${g},${b}`
}
