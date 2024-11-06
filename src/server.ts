import express, { Request, Response } from 'express'
// import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import path from 'path'
import pageRouter from './routes/page.routes'
import dotenv from 'dotenv'
dotenv.config()

// Create server
const app = express()

// Middleware
const SIGN_KEY = process.env.COOKIE_SESSION_SIGN_KEY ?? 'vnolrk1vjns'
const ENCRYPT_KEY = process.env.COOKIE_SESSION_ENCRYPT_KEY ?? 'bvn1oiel2jk'
app.use(cookieSession({
  name: "session",
  keys: [SIGN_KEY, ENCRYPT_KEY],
  maxAge: 3 * 60 * 1000
}))
// app.use(cookieParser(process.env.COOKIE_KEY))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../src/views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use('/', pageRouter)

// 404 Fallback
app.use((req: Request, res: Response) => {
  res.status(404).render('404')
})

// Start server
const PORT: number = Number(process.env.PORT || 3000)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})