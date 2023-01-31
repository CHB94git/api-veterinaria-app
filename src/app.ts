import cors, { CorsOptions } from 'cors'
import 'dotenv/config'
import express from 'express'
import connectDB from './database/mongo'
import { errorHandlerMiddleware } from './middlewares/errorHandlerGlobal.middleware'
import mascotaRoutes from './routes/mascota.routes'
import veterinarioRoutes from './routes/veterinario.routes'

const app = express()

connectDB()

const allowedOrigins = ['postman-client', 'http://localhost:3000', process.env.FRONTEND_URL!]

const corsOptions: CorsOptions = {
  origin: allowedOrigins
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())

app.use('/api/v1/veterinarios', veterinarioRoutes)
app.use('/api/v1/mascotas', mascotaRoutes)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server application running on port: ${ PORT } 🚀🚀🚀`))

