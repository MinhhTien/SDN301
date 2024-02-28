import bcrypt from 'bcryptjs'

export const createSlug = (str: string) => {
  return str.toLowerCase().replace(/\s+/g, '-')
}

export const convertStringToColorArray = (color: string) => {
  if (!color) return []
  const colorArray = color.split(',')
  return colorArray.map((color) => color.trim())
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt()
  const hash = await bcrypt.hash(password, salt)
  return hash
}

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}
