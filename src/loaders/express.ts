import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import routes from '../api'
import config from '../config'

export default ({ app } : { app: express.Application}) => {
    /**
     * Health Check endpoints
     */
    app.get('/status', (_req, res) => {
        res.status(200).end()
    })

    app.head('/status', (_req, res) => {
        res.status(200).end()
    })

    // Show the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy')

    app.use(cors())

    app.use(require('method-override')())

    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.json())

    // Load API routes
    app.use(config.api.prefix, routes())

    // catch 404 and forward to error handler
    app.use((_req, _res, next) => {
        const err = new Error('Not Found')
        err['status'] = 404
        next(err)
    })

    // error handlers
    app.use((err, _req, res, next) => {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (err.name === 'UnauthorizedError') {
        return res
            .status(err.status)
            .send({ message: err.message })
            .end()
        }
        return next(err)
    })

    app.use((err, _req, res, _next) => {
        res.status(err.status || 405)
        res.json({
            errors: {
                message: err.message,
            },
        })
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
