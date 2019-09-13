import "reflect-metadata"
import { join } from 'path'
import { createConnection, Connection, ConnectionOptions } from "typeorm"
import config from '../config'
const parentDir = join(__dirname, '..');

const { database} = config
const connectionOpts: ConnectionOptions = {
    type: "postgres",
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.name,
    synchronize: true,
    logging: false,
    entities: [
        `${parentDir}/models/*.ts`
    ],
};

export default async (): Promise<Connection> => {
    try {
        const connection = await createConnection(connectionOpts)
        return connection
    } catch(e) {
        throw e
    }    
} 