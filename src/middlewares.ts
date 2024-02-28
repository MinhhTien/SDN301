import { UserRole } from '@common/constant'
import { NextFunction, Response } from 'express'

export const Authorization = (roles: UserRole[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (req.session.user) {
      const user = req.session.user
      console.log(req.session.user)
      if (roles.includes(user.role)) {
        next()
      } else {
        res.render('404', {
          isLoggedIn: !!req.session.user
        })
      }
    } else {
      res.render('404', {
        isLoggedIn: !!req.session.user
      })
    }
  }
}

export const AuthRoute = (req: any, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    next()
  } else {
    res.redirect('/')
  }
}
