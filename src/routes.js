// Import only routes of Express
import { Router } from 'express'
import User from './app/models/User'

// We'll work only the routes here
const routes = new Router()

// Methods of routes
routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Lauriel Mesquita',
    email: 'laurielmesquita@me.com',
    password_hash: '123456789'
  })

  return res.json(user)
})

export default routes
