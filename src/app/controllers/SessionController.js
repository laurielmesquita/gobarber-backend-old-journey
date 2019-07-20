import jwt from 'jsonwebtoken'

import User from '../models/User'
import authConfig from '../../config/auth'

class SessionControler {
  // Método para a criação da nossa sessão
  async store (req, res) {
    // Vamos pegar email e senha que o
    // usuário passa ao se autenticar
    const { email, password } = req.body

    // E vamos verificar se existe ou não
    // uma conta com esse email
    const user = await User.findOne({ where: { email } })

    // Se o usuário nao existir
    if (!user) {
      return res.status(401).json({ error: 'User not found!' })
    }

    // Verificar se as duas senhas conferem
    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Password does not match!' })
    }

    // Se chegou até aqui as duas checagens passram
    const { id, name } = user

    // Agora vamos retornar os dados do usuário
    return res.json({
      user: {
        id,
        name,
        email
      },
      // 1) Aqui no token, mais precisamente no payload,
      // que é um objeto, vou colocar o Id do usuário
      // para idendificar esse usuário.
      //
      // 2) O segundo parâmetro desse objeto precisa ser
      // uma string de valor único em toda a aplicação
      // e que só a gente tenha acesso (https://www.md5online.org)
      //
      // 3) No terceiro parâmetro podemos passar algumas
      // configurações para o nosso token
      token: jwt.sign({ id }, authConfig.secret, {
        // Configurando data de expiração do token
        expiresIn: authConfig.expiresIn
      })
    })
  }
}

export default new SessionControler()
