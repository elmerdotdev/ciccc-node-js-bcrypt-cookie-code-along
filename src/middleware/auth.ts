import { Request, Response, NextFunction } from 'express'

// Auth check
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.sessionAuthToken) {
    next()
  } else {
    res.redirect('/login')
  }
}

// Check if not authenticated
export const checkNotAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.sessionAuthToken) {
    res.redirect('/profile')
  } else {
    next()
  }
}