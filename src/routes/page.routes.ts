import { Router, Request, Response } from 'express'
import { User } from '../types/user'
const pageRouter = Router()
import bcrypt from 'bcrypt'
import { checkAuth, checkNotAuth } from '../middleware/auth'

// Helper function for bcrypt
//const hashPassword = async (password: string, rounds: number): Promise<string> => {
//  const salt = await bcrypt.genSalt(rounds)
//  const hash = await bcrypt.hash(password, salt)
//  return hash // hashed password
//}

// In-memory database
let users: User[] = []

// Home
pageRouter.get('/', (req: Request, res: Response) => {
  res.status(200).render('index', { users })
})

// Register
pageRouter.get('/register', checkNotAuth, (req: Request, res: Response) => {
  res.status(200).render('register')
})

// Register process
pageRouter.post('/register', async (req: Request<{}, {}, User>, res: Response) => {
  try {
    const { username, password, email } = req.body
    const found = users.find(user => user.username === username)
    if (found) {
      res.status(500).send('Username already taken')
      return
    }
    const newPassword = await bcrypt.hash(password, 12); // 12 is the recommended rounds
    const newUser = {
      username,
      password: newPassword,
      email
    }
    users.push(newUser)
    console.log(newUser)
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.send(500).send("Internal server error")
  }
})

// Login
pageRouter.get('/login', checkNotAuth, (req: Request, res: Response) => {
  res.status(200).render('login')
})

// Login process
pageRouter.post('/login', async (req: Request<{}, {}, Omit<User, 'email'>>, res: Response) => {
  try {
    const { username, password } = req.body
    const found = users.find(user => user.username === username)
    if (found && await bcrypt.compare(password, found.password)) {
      // res.cookie('authToken', 'authenticated', {
      //   maxAge: 3 * 60 * 1000,
      //   httpOnly: true,
      //   signed: true
      // })
      req.session!.sessionAuthToken = true
      req.session!.username = found.username
      res.redirect('/profile')
      return
    }
    res.status(404).send('User not found!')
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal server error")
  }
})

// Profile
pageRouter.get('/profile', checkAuth, (req: Request, res: Response) => {
  res.status(200).render('profile')
})

// Logout
pageRouter.get('/logout', (req: Request, res: Response) => {
  // res.clearCookie('authToken')
  req.session = null
  res.redirect('/login')
})

export default pageRouter
