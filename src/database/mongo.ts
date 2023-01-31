import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.set('strictQuery', false)
  mongoose.connect(<string> process.env.MONGODB_URI!)
    .then(() => console.log(`MongoDB conectado 👨‍💻👍`))
    .catch((error) => {
      console.log(`Error: ${ error?.message }`)
      process.exit(1)
    })
}

export default connectDB