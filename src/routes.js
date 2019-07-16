// Import only routes of Express
import { Router } from 'express'

// We'll work only the routes here
const routes = new Router()

// Methods of routes
routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Lauriel' })
})

export default routes
