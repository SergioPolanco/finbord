import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import { celebrate, Joi } from 'celebrate'
import AuthService from '../../services/auth'
import { IUserInputDTO } from '../../interfaces/IUser'

const route = Router()

export default (app: Router) => {
    app.use('/auth', route)

    route.post(
        '/signup',
        celebrate({
            body: Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger')
            logger.debug('Calling Sign-Up endpoint with body: %o', req.body )
            const authServiceInstance = Container.get(AuthService)

            try {    
                const { user, token } = await authServiceInstance.signUp(
                    req.body as IUserInputDTO
                )
                return res.status(201).json({ user, token })
            } catch (e) {
                logger.error('🔥 error: %o', e)
                return next(e)
            }
        },
    )
}