import { Request, Response, NextFunction } from 'express'
import { Service, Inject, Container } from 'typedi'

import AuthService from '../services/auth'
import { IUserInputDTO } from '../interfaces/IUser'

@Service()
export default class AuthController {
    constructor(
        @Inject('logger') private logger,
    ) {
    }

    public signUp = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
        const { body } = req
        this.logger.debug('Calling Sign-Up endpoint with body: %o', body )
        const authServiceInstance = Container.get(AuthService)
        
        try {    
            const { user, token } = await authServiceInstance.signUp(body as IUserInputDTO)
            return res.status(201).json({ user, token })
        } catch (e) {
            this.logger.error('🔥 error: %o', e)
            return next(e)
        }
    }

    public signIn = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
        const { body } = req
        this.logger.debug('Calling Sign-In endpoint with body: %o', body)
        const { email, password } = body
        const authServiceInstance = Container.get(AuthService)

        try {
            const { user, token } = await authServiceInstance.signIn(email, password)
            return res.status(200).json({ user, token })
        } catch (e) {
            this.logger.error('🔥 error: %o', e)
            return next(e)
        }
    }
}