import { Service, Inject } from 'typedi'
import { getRepository } from 'typeorm'
import argon2 from 'argon2'
import { randomBytes } from 'crypto'
import slugify from 'slugify'

import { IUser, IUserInputDTO } from '../interfaces/IUser'
import { RecordNotFound } from '../exceptions/models'
@Service() 
export default class UserService {
    constructor(
        @Inject('userModel') private UserModel,
        @Inject('logger') private logger,
    ) {

    }

    public async create(userInputDTO: IUserInputDTO): Promise<IUser> {
        this.logger.silly('Creating user db record')
        const salt = randomBytes(32)
        const hashedPassword = await argon2.hash(userInputDTO.password, { salt })
        const slug = slugify(
            `${userInputDTO.firstName} ${userInputDTO.lastName}`,
            {
                lower: true
            }
        )

        let userInstance = new this.UserModel()

        userInstance.firstName = userInputDTO.firstName
        userInstance.lastName = userInputDTO.lastName
        userInstance.email = userInputDTO.email
        userInstance.salt = salt.toString('hex')
        userInstance.password = hashedPassword
        userInstance.slug = slug

        try {
            await userInstance.save(userInstance);
        } catch(e) {
            const {detail} = e
            let err = new Error(detail)
            
            err.status = 400
            throw err
        }

        return userInstance
    }

    public async findUserByEmail(email: string): Promise<IUser> {
        this.logger.silly('Finding user db record')
        const repository = getRepository(this.UserModel)
        let user: any

        try {
            user = await repository.findOne({ email })
        } catch(e) {
            const { detail } = e
            let err = new Error(detail)
            err.status = 404
            throw err
        }

        if (!user) {
            const err = new RecordNotFound(`User with email ${email} doesn't exists`)
            throw err
        }

        return user
    }
}