import { Service, Inject, Container } from 'typedi'
import jwt from 'jsonwebtoken'

import config from '../config'
import UserService from './user'
import { IUser, IUserInputDTO } from '../interfaces/IUser'


@Service()
export default class AuthService {
    constructor(
        @Inject('logger') private logger,
    ) {

    }

    public async signUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
        const userServiceInstance = Container.get(UserService)
        let userRecord: IUser

        try {
            userRecord = await userServiceInstance.create(userInputDTO)
        } catch(e) {
            throw e
        }

        this.logger.silly('Generating JWT')
        const token = this.generateToken(userRecord)

        Reflect.deleteProperty(userRecord, 'password')
        Reflect.deleteProperty(userRecord, 'salt')

        return {
            user: userRecord,
            token
        }
    }

    private generateToken(user) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
    
        this.logger.silly(`Sign JWT for userId: ${user._id}`);

        return jwt.sign(
            {
                _id: user._id,
                role: user.role,
                name: user.name,
                exp: exp.getTime() / 1000,
            },
            config.jwtSecret,
        );
    }
}
