import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { errors } from 'celebrate'
import routes from '../api'
import config from '../config'

export default ({ app } : { app: express.Application}) => {
    const {api} = config

    /**
     * Health Check endpoints
     */
    app.get('/status', (_req, res) => {
        const {status} = res
        status(200).end()
    })

    app.head('/status', (_req, res) => {
        const {status} = res
        status(200).end()
    })

    // Show the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy')

    app.use(cors())

    app.use(require('method-override')())

    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.json())

    // Load API routes
    app.use(api.prefix, routes())

    // Catch celebrate errors
    app.use(errors())
    
    // catch 404 and forward to error handler
    app.use((_req, _res, next) => {
        const err = new Error('Not Found')
        err.status = 404
        next(err)
    })

    // error handlers
    app.use((err, _req, res, next) => {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (err.name === 'UnauthorizedError') {
            const {message} = err
            return res
                .status(err.status)
                .send({ message })
                .end()
        }
        return next(err)
    })

    app.use((err, _req, res, _next) => {
        res.status(err.status || 500)
        res.json({
            errors: {
                message: err.message,
            },
        })
    })

}
