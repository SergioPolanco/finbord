import expressLoader from './express'
import dependencyInjectorLoader from './dependencyInjector'
import Logger from './logger'
import dbConnection from './typeorm'
import {User} from '../models/user'

export default async ({ expressApp }) => {
    const userModel = {
        name: 'userModel',
        model: User,
    };

    const connection = await dbConnection()
    await dependencyInjectorLoader({
        dbConnection: connection,
        models: [
            userModel,
        ],
        
    });
    Logger.info('✌️ Dependency Injector loaded')

    await expressLoader({ app: expressApp })
    Logger.info('✌️ Express loaded')
};