import 'dotenv/config'
import express from 'express'
import path from 'path'
import Youch from 'youch'
import * as Sentry from '@sentry/node'
import 'express-async-errors'
import routes from './routes'
import sentryConfig from './config/sentry'

import './database'

class App {
  // Method automatically called to instance this class
  constructor () {
    this.server = express()

    Sentry.init(sentryConfig)

    // Call the methods below
    this.middlewares()
    this.routes()
    this.exceptionHandler()
  }

  // Method middleware
  middlewares () {
    this.server.use(Sentry.Handlers.requestHandler())
    // Send requisitions and receive responses on JSON format from our API
    this.server.use(express.json())
    // Vamos chamar o express.static para servir
    // arquivos estáticos e a imagem ser exibida
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    )
  }

  // Method routes
  routes () {
    this.server.use(routes)
    this.server.use(Sentry.Handlers.errorHandler())
  }

  exceptionHandler () {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON()

        return res.status(500).json(errors)
      }
      return res.status(500).json({ error: 'Internal server error!' })
    })
  }
}

// Export the only thing that can be accessed
// The method server
export default new App().server
