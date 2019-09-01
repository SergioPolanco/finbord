import "reflect-metadata"
import { join } from 'path'
import { createConnection, Connection, ConnectionOptions } from "typeorm"
const parentDir = join(__dirname, '..');

const connectionOpts: ConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgresroot*.",
    database: "finbord",
    synchronize: true,
    logging: false,
    entities: [
        `${parentDir}/models/*.ts`
    ],
};

export default async (): Promise<Connection> => {
    const connection = await createConnection(connectionOpts)
    return connection
} 