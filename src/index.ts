import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import morgan from 'morgan'
import cors from 'cors'
import { engine } from 'express-handlebars'
import * as bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import moment from 'moment'

import connectDB from '@utils/connect-db'
import orchidRouter from '@routes/orchid.router'
import categoryRouter from '@routes/category.router'
import { OrchidController } from '@controllers/orchid.controller'
import userRouter from '@routes/user.router'
import commentRouter from '@routes/comment.router'

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
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'asdhbv618fbv7yfdf',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
)
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
    extname: '.hbs',
    helpers: {
      inc: function (value: any, options: any) {
        return parseInt(value) + 1
      },
      prettifyDate: function (timestamp: any) {
        return moment(timestamp, 'YYYY-MM-DDTHH:mm:ss.SSS').format('YYYY-MM-DD HH:mm')
      },
      commentDate: function (timestamp: any) {
        console.log(timestamp, moment(timestamp).format('MMM. Do YYYY HH:MM'))
        return moment(timestamp, 'YYYY-MM-DDTHH:mm:ss.SSS').format('MMM. Do YYYY HH:mm')
      },
      ifEquals: function (arg1: any, arg2: any, options: any) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this)
      }
    }
  })
)

//Endpoint
app.use(userRouter)
app.use('/orchids', orchidRouter)
app.use('/categories', categoryRouter)
app.use('/comments', commentRouter)

const orchidController = new OrchidController()
app.get('/', orchidController.renderAllOrchids)
app.get('/home', (req: any, res) => {
  res.render('home', {
    isLoggedIn: !!req.session.user,
    user: req.session.user
  })
})
app.get('*', (req: any, res: Response) => {
  res.render('404', {
    isLoggedIn: !!req.session.user,
    user: req.session.user
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

export default app
