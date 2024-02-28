import mongoose from 'mongoose'

const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url)
  } catch (error) {
    console.log(error)
  }
}

export default connectDB
