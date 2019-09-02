
import { Container } from 'typedi'

import LoggerInstance from './logger'

export default ({ dbConnection, models }: { dbConnection; models: { name: string; model: any }[] }) => {
    try {
        models.forEach(m => {
            Container.set(m.name, m.model);
        });

        Container.set('logger', LoggerInstance)
        Container.set('dbConnection', dbConnection)
        
    } catch (e) {
        LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};