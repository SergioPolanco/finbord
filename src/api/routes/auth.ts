import { Router } from 'express'
import { Container } from 'typedi'
import { celebrate, Joi } from 'celebrate'

import AuthController from '../../controllers/auth'
import methodNotAllowedHandler from '../middlewares/methodNotAllowed'

const route = Router()

export default (app: Router) => {
    app.use('/auth', route)

    const signupBody = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
    })

    const authControllerInstance = Container.get(AuthController)

    route.post(
        '/signup',
        celebrate({
            body: signupBody ,
        }),
        authControllerInstance.signUp,
    )

    route.all('/signup', methodNotAllowedHandler)
}