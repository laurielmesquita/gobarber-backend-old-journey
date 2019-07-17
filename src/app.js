import express from 'express'
import routes from './routes'

import './database'

class App {
  // Method automatically called to instance this class
  constructor () {
    this.server = express()

    // Call the methods below
    this.middlewares()
    this.routes()
  }

  // Method middleware
  middlewares () {
    // Send requisitions and receive responses on JSON format from our API
    this.server.use(express.json())
  }

  // Method routes
  routes () {
    this.server.use(routes)
  }
}

// Export the only thing that can be accessed
// The method server
export default new App().server
