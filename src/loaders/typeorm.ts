import "reflect-metadata"
import { join } from 'path'
import { createConnection, Connection, ConnectionOptions } from "typeorm"
const parentDir = join(__dirname, '..');

const connectionOpts: ConnectionOptions = {
    type: "postgres",
    host: "db",
    port: 5432,
    username: "finbord",
    password: "finbord",
    database: "finbord",
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