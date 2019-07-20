import * as Yup from 'yup'
import User from '../models/User'

class UserController {
  // Métodos aqui tem a mesma face de um middleware //
  // MÉTODO PARA CADASTRAR UM NOVO USUÁRIO
  async store (req, res) {
    // Em .object() estamos validando um objeto, pois o req.body é um objeto
    // Em .shape() passaremos o formato que eu quero que esse objeto tenha
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    })

    // Agora precisamos ver se esse nosso req.body está passando
    // com esse schema validado de acordo com as regras que passei
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' })
    }

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
    // Aqui os campos não precisam ser obrigatórios
    // uma vez que o usuário não é obrigado a mudar nada
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      // Agora precisamos fazer o usuário informar uma nova senha,
      // já que a senha atual está sendo passada
      oldPassword: Yup.string().min(6),
      // Então vamos passar o campo da nova senha
      password: Yup.string()
        .min(6)
        // Aqui temos uma validação condicional
        // onde eu digo que se oldPassword estiver presente
        // eu quero que o campo password seja obrigatório
        .when('oldPassword', (oldPassword, field) =>
          // Se a minha variável 'oldPassword' estiver preenchida
          // eu quero que nosso 'field' seja obrigatório
          // Lembrando que 'field' se refere à 'password'
          // senão, 'field' fica como estava antes, sem ser obrigatório
          oldPassword ? field.required() : field
        ),
      // Agora vamos garantir que, ao informar uma nova senha,
      // o usuário confirme que a digitou corretamente
      confirmPassword: Yup.string().when('password', (password, field) =>
        // Se o campo 'password' estiver preenchido
        // eu quero que nosso 'field' seja obrigatório e igual ao 'password'
        // .oneOf() determina que esse campo só poderá ter um tipo de valor
        // Yup.ref('password') me garante que 'password' dentro dele seja igual
        // à variável 'password'
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' })
    }

    // Não faz sentido essa rota estar disponível
    // para quem não está logado no sistema

    // Pegando email e senha antiga do
    // usuário pelo corpo da requisição
    const { email, oldPassword } = req.body

    // Identificando qual o usuário pelo Id dentro da requisição
    const user = await User.findByPk(req.userId)

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } })

      if (userExists) {
        return res.status(400).json({ error: 'User already exists!' })
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match!' })
    }

    const { id, name, provider } = await user.update(req.body)

    return res.json({ id, name, email, provider })
  }
}

export default new UserController()
