import User from '../models/User'

class UserController {
  // Métodos aqui tem a mesma face de um middleware //
  // MÉTODO PARA CADASTRAR UM NOVO USUÁRIO
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

  // MÉTODO PARA O USUÁRIO EDITAR SUAS INFORMAÇÕES CADASTRAIS
  async update (req, res) {
    // Não faz sentido essa rota estar disponível
    // para quem não está logado no sistema

    console.log(req.userId)
    return res.json({ Ok: true })
  }
}

export default new UserController()
