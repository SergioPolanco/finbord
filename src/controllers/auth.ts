import { Request, Response, NextFunction, Handler } from 'express'
import { Service, Inject, Container } from 'typedi'

import AuthService from '../services/auth'
import { IUserInputDTO } from '../interfaces/IUser'

@Service()
export default class AuthController {
    constructor(
        @Inject('logger') private logger,
    ) {

    }

    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        this.logger.debug('Calling Sign-Up endpoint with body: %o', req.body )
        const authServiceInstance = Container.get(AuthService)
        const {status} = res

        try {    
            const { user, token } = await authServiceInstance.signUp(
                req.body as IUserInputDTO
            )
            return status(201).json({ user, token })
        } catch (e) {
            this.logger.error('🔥 error: %o', e)
            return next(e)
        }
    }
}