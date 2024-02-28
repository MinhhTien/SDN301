import { NextFunction, Request, Response } from 'express'
import UserModel from '@models/user.model'
import { UserRole } from '@common/constant'
import bcrypt from 'bcryptjs'
import { comparePassword, hashPassword } from '@utils/common'

export class UserController {
  renderLogin(req: Request, res: Response) {
    try {
      res.render('./auth/login', { layout: false })
    } catch (err: any) {
      res.render('404')
    }
  }

  renderSignup(req: Request, res: Response, next: NextFunction) {
    try {
      res.render('./auth/signup', { layout: false })
    } catch (err: any) {
      res.render('404')
    }
  }

  async login(req: Request, res: Response) {
    try {
      console.log(req.body)
      const username = req.body.username
      const password = req.body.password
      const user = await UserModel.findOne(
        {
          username
        },
        { password: 1 }
      ).lean()
      if (!user) {
        return res.render('400', {
          errorMessage: `Username or password is incorrect! Please try again.`
        })
      }
      const isPasswordMatch = await comparePassword(password, user.password)
      if (!isPasswordMatch) {
        return res.render('400', {
          errorMessage: `Username or password is incorrect! Please try again.`
        })
      }

      if (user.role === UserRole.ADMIN) {
        return res.redirect('/orchids/management')
      }
      if (user.role === UserRole.MEMBER) {
        return res.redirect('/orchids/all')
      }

      return res.redirect('/')
    } catch (err: any) {
      console.error(err)
      res.render('404')
    }
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body)
      const username = req.body.username
      const password = req.body.password
      const confirmPassword = req.body.confirmPassword
      if (password !== confirmPassword) {
        return res.render('400', {
          errorMessage: `Confirm password not match! Please try again.`
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
          errorMessage: `Username ${username} has existed! Please try another username.`
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
      res.render('404')
    }
  }

  async _hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    return hash
  }

  _comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
