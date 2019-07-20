// Import only routes of Express
import { Router } from 'express'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

import authMiddleware from './app/middlewares/auth'

// We'll work only the routes here
const routes = new Router()

// Methods of routes
routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

// Como o middlaware global está sendo colocado nesse ponto
// todos as rotas a partir daqui já contarão com esse middleware,
// as rotas anteriores não passarão por esse middleware
routes.use(authMiddleware)

routes.put('/users', UserController.update)

export default routes
