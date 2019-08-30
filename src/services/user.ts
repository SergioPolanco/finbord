import { Service, Inject } from 'typedi'
import argon2 from 'argon2'
import { randomBytes } from 'crypto'
import slugify from 'slugify'

import { IUser, IUserInputDTO } from '../interfaces/IUser'

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

        let userRecord = new this.UserModel()

        userRecord.firstName = userInputDTO.firstName
        userRecord.lastName = userInputDTO.lastName
        userRecord.email = userInputDTO.email
        userRecord.salt = salt.toString('hex')
        userRecord.password = hashedPassword
        userRecord.slug = slug

        try {
            await userRecord.save(userRecord);
        } catch(error) {
            throw error
        }

        return userRecord
    }
}