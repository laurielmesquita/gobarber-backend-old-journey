import User from '../models/User'

class UserController {
  // Tem a mesma face de um middleware
  async store (req, res) {
    // Verifica se já existe um usuário
    // com o email que estamos tentando
    const userExists = await User.findOne({ where: { email: req.body.email } })

    if (userExists) {
      return res.status(400).json({ error: 'User already exists!' })
    }

    // const user = await User.create(req.body)
    // Aqui vamos retornar apenas os campos
    // que nos interessa exibir no front-end
    const { id, name, email, provider } = await User.create(req.body)

    // Agora retornamos o user, utilizado acima para receber
    // os dados do usuário no corpo da requisição, como JSON
    // na resposta
    return res.json({ id, name, email, provider })
  }
}

export default new UserController()
