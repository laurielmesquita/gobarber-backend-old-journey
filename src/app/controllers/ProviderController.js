import User from '../models/User'
import File from '../models/File'

class ProviderController {
  // Método index que será utilizado para a listagem
  async index (req, res) {
    // Aqui vamos começar nossa listagem
    // chamando todos os users via findAll
    const providers = await User.findAll({
      // Agora precisamos criar uma condição
      // para retornar apenas os providers
      where: { provider: true },
      // Aqui vamos passar apenas as informações
      // que eu quero apresentar
      attributes: ['id', 'name', 'email', 'avatar_id'],
      // Agora vamos retornar também todos
      // os dados do avatar do usuário
      include: [
        {
          model: File,
          // Codinome que será apresentado
          // na listagem dos dados
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      ]
    })
    // Agora retornamos a constante providers
    return res.json(providers)
  }
}

export default new ProviderController()
