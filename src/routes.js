// Import only routes of Express
import { Router } from 'express'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

// We'll work only the routes here
const routes = new Router()

// Methods of routes
routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

export default routes
