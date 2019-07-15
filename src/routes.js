// Import only routes of Express
import { Router } from 'express'

// We'll work only the routes here
const routes = new Router()

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello world' })
})

export default routes
