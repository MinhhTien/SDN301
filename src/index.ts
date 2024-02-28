import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import morgan from 'morgan'
import cors from 'cors'
import { engine } from 'express-handlebars'
import * as bodyParser from 'body-parser'

import connectDB from '@utils/connect-db'
import orchidRouter from '@routes/orchid.router'
import categoryRouter from '@routes/category.router'
import { OrchidController } from '@controllers/orchid.controller'
import userRouter from '@routes/user.router'

dotenv.config()
const port = process.env.PORT
const env = process.env.NODE_ENV
const dbUrl = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/SDN301'

const app = express()
connectDB(dbUrl)

//Config
app.use(cors())
app.use(express.static(path.join(__dirname + '/public')))
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())
if (env === 'development') {
  app.use(morgan('dev'))
}
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something happened!')
})

//Template engine
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname + '/views'))
app.engine(
  'hbs',
  engine({
    defaultLayout: 'main',
    extname: '.hbs'
  })
)

//Endpoint
app.use(userRouter)
app.use('/orchids', orchidRouter)
app.use('/categories', categoryRouter)

const orchidController = new OrchidController()
app.get('/', orchidController.renderAllOrchids)
app.get('/home', (req, res) => {
  res.render('home')
})
app.get('*', (req: Request, res: Response) => {
  res.render('404')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

export default app
