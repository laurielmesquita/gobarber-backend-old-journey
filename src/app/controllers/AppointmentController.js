import * as Yup from 'yup'
import User from '../models/User'
import Appointment from '../models/Appointment'

class AppointmentController {
  async store (req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    })

    // Checar se os campos foram preenchidos adequadamente
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' })
    }

    const { provider_id, date } = req.body

    // Checar se o provider_id é um provider
    // Vamos criar uma constante para encontrar um registro
    // com where e dentro desse where as condições
    const isProvider = await User.findOne({
      // As condição são:
      // Encontrar um provider_id onde provider seja true
      where: { id: provider_id, provider: true }
    })

    // Se isProvider não encontrar nenhum usuário
    // vamos apresentar um aviso de erro
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers!' })
    }

    // Agora vamos criar o agendamento
    const appointment = await Appointment.create({
      // O primeiro dado será o user_id, que é o ID do usuário que está criando
      // esse agendamento, podemos pegar esse user_id direto de req.userId que
      // está no nosso middleware auth.js
      user_id: req.userId,
      // Vamos passar também o provider_id direto do req.body
      provider_id,
      // E o último campo será o date
      date
    })

    // Repassamos o appointment aqui no res.json
    // para ver o retorno na requisição
    return res.json(appointment)
  }
}

export default new AppointmentController()
