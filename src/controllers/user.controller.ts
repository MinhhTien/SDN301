import { NextFunction, Request, Response } from 'express'
import UserModel from '@models/user.model'
import { UserRole } from '@common/constant'
import bcrypt from 'bcryptjs'
import { comparePassword, hashPassword } from '@utils/common'

export class UserController {
  renderLogin(req: any, res: Response) {
    try {
      res.render('./auth/login', { layout: false, isLoggedIn: !!req.session.user, user: req.session.user })
    } catch (err: any) {
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }

  renderSignup(req: any, res: Response, next: NextFunction) {
    try {
      res.render('./auth/signup', { layout: false, isLoggedIn: !!req.session.user, user: req.session.user })
    } catch (err: any) {
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }

  async login(req: any, res: Response) {
    try {
      const { username, password } = req.body
      const user = await UserModel.findOne(
        {
          username
        },
        '+password'
      ).lean()
      if (!user) {
        return res.render('400', {
          errorMessage: `Username or password is incorrect! Please try again.`,
          isLoggedIn: !!req.session.user,
          user: req.session.user
        })
      }
      const isPasswordMatch = await comparePassword(password, user.password)
      if (!isPasswordMatch) {
        return res.render('400', {
          errorMessage: `Username or password is incorrect! Please try again.`,
          isLoggedIn: !!req.session.user,
          user: req.session.user
        })
      }

      user.password = ''
      req.session.user = user
      if (user.role === UserRole.ADMIN) {
        return res.redirect('/orchids/management')
      }
      if (user.role === UserRole.MEMBER) {
        return res.redirect('/orchids')
      }

      return res.redirect('/')
    } catch (err: any) {
      console.error(err)
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }

  async signup(req: any, res: Response, next: NextFunction) {
    try {
      const username = req.body.username
      const password = req.body.password
      const confirmPassword = req.body.confirmPassword
      if (password !== confirmPassword) {
        return res.render('400', {
          errorMessage: `Confirm password not match! Please try again.`,
          isLoggedIn: !!req.session.user,
          user: req.session.user
        })
      }
      const user = await UserModel.findOne(
        {
          username
        },
        { password: 1 }
      ).lean()
      if (user) {
        return res.render('400', {
          errorMessage: `Username ${username} has existed! Please try another username.`,
          isLoggedIn: !!req.session.user,
          user: req.session.user
        })
      }

      const hashedPassword = await hashPassword(password)
      await UserModel.create({
        username,
        password: hashedPassword,
        role: UserRole.MEMBER
      })

      return res.redirect('/login')
    } catch (err: any) {
      console.error(err)
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    req.session.destroy(() => {
      console.log('User logged out')
    })
    res.redirect('/')
  }

  async renderAllAccounts(req: any, res: Response, next: NextFunction) {
    try {
      const users = await UserModel.find(
        {
          role: {
            $ne: UserRole.ADMIN
          }
        },
        '-password'
      ).lean()
      res.render('./users/management', {
        users,
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    } catch (err: any) {
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }
}
