import { Router } from 'express'
import { Container } from 'typedi'
import { celebrate, Joi } from 'celebrate'

import AuthController from '../../controllers/auth'
import methodNotAllowedHandler from '../middlewares/methodNotAllowed'

const route = Router()

export default (app: Router) => {
    app.use('/auth', route)

    const authControllerInstance = Container.get(AuthController)
    
    const signupBody = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
    })

    route.post(
        '/signup',
        celebrate({
            body: signupBody,
        }),
        authControllerInstance.signUp,
    )
    
    const signInBody = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    
    route.post(
        '/signin',
        celebrate({
            body: signInBody
        }),
        authControllerInstance.signIn
    )
    route.all('/signup', methodNotAllowedHandler)
}