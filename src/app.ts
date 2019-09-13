import 'reflect-metadata'
import express from 'express'

import config from './config'
import Logger from './loaders/logger'

async function startServer() {
    const app = express()

    /**
     * A little hack here
     * Import/Export can only be used in 'top-level code'
     * Well, at least in node 10 without babel and at the time of writing
     * So we are using good old require.
     **/

    try {
        await require('./loaders').default({ expressApp: app })
    } catch(e) {
        Logger.error(e)
        return
    }
    

    app.listen(config.port, err => {
        if (err) {
            Logger.error(err);
            process.exit(1);
            return;
        }
        Logger.info(`
            ################################################
            🛡️  Server listening on port: ${config.port} 🛡️ 
            ################################################
        `);
    });
}
  
startServer();