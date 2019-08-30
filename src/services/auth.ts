import { Service, Inject, Container } from 'typedi'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import { randomBytes } from 'crypto'
import slugify from 'slugify'

import config from '../config'
import UserService from './user'
import { IUser, IUserInputDTO } from '../interfaces/IUser'
import { User } from '../models/user'


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
            throw new Error('User cannot be created')
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

// async function createUser(userInputDTO: IUserInputDTO, Model): Promise<IUser> {
//     const salt = randomBytes(32)
//     const hashedPassword = await argon2.hash(userInputDTO.password, { salt })
//     const slug = slugify(
//         `${userInputDTO.firstName} ${userInputDTO.lastName}`,
//         {
//             lower: true
//         }
//     )
//     let user = new Model()

//     user.firstName = userInputDTO.firstName
//     user.lastName = userInputDTO.lastName
//     user.email = userInputDTO.email
//     user.salt = salt.toString('hex')
//     user.password = hashedPassword
//     user.slug = slug

//     try {
//         await user.save(user);
//     } catch(error) {
//         console.log(error)
//         return
//     }

//     return user
// }