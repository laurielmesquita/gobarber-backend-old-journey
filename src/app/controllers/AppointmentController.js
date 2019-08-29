import * as Yup from 'yup'
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
import User from '../models/User'
import File from '../models/File'
import Appointment from '../models/Appointment'
import Notification from '../schemas/Notification'

import CancellationMail from '../jobs/CancellationMail'
import Queue from '../../lib/Queue'

class AppointmentController {
  async index (req, res) {
    // Passando o parâmetro e definindo um valor default para ele page = 1
    const { page = 1 } = req.query

    const appointments = await Appointment.findAll({
      // Aqui vamos listar apenas os usuários que forem igual a req.userId
      // e o cancelamento for null, ou seja, que nao foram cancelados ainda
      where: {
        user_id: req.userId,
        canceled_at: null
      },
      // Aqui vamos configurar a ordem dessa listagem por data
      order: ['date'],
      // Aqui vamos especificar quais atributos do agendamento queremos informar
      attributes: ['id', 'date'],
      // Limites de agendamentos listados por página
      limit: 20,
      // Números de registros que eu quero pular para mostrar os da próxima page
      offset: (page - 1) * 20,
      // Eu também quero listar os dados do prestador de serviço
      include: [
        {
          // O modelo de relacionamento será o de User
          model: User,
          // Porém o Appointment.js relaciona o User duas vezes e será preciso
          // passar também o as: 'provider' para dizer qual relacionamento será
          as: 'provider',
          // Aqui vamos especificar quais atributos do provider queremos informar
          attributes: ['id', 'name'],
          // Vamos dá mais um include, que é um array, para informar o avatar do
          // usuário
          include: [
            {
              model: File,
              as: 'avatar',
              // Nos atributos do avatar é IMPORTANTE incluir o PATH
              // pois o File não saberá qual é o arquivo a ser carregado
              attributes: ['id', 'path', 'url']
            }
          ]
        }
      ]
    })

    // Agora retornamos isso como appointments
    return res.json(appointments)
  }

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
    const checkIsProvider = await User.findOne({
      // As condição são:
      // Encontrar um provider_id onde provider seja true
      where: { id: provider_id, provider: true }
    })

    // Se checkIsProvider não encontrar nenhum usuário
    // vamos apresentar um aviso de erro
    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers!' })
    }

    // Verifica se hourStart está antes da data/hora atual
    const hourStart = startOfHour(parseISO(date))

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited!' })
    }

    // Vefica se prestador de serviço já não tem
    // um serviço agendado no mesmo horário
    const checkAvailability = await Appointment.findOne({
      // Condições para um agendamento livre
      where: {
        provider_id, // Id do provider que o user está tentando fazer o agendamento
        canceled_at: null, // Se o agendamento for cancelado a data está disponível
        date: hourStart // Passamos nossa variável hourStart como sendo a data
      }
    })

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available!' })
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
      date: hourStart
    })

    // Notificação de agendamento do prestador
    // Aqui vamos obter o nome do usuário
    const user = await User.findByPk(req.userId)
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt
      }
    )

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id
    })

    // Repassamos o appointment aqui no res.json
    // para ver o retorno na requisição
    return res.json(appointment)
  }

  async delete (req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ]
    })

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment!"
      })
    }

    const dateWithSub = subHours(appointment.date, 2)

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance!'
      })
    }

    appointment.canceled_at = new Date()

    await appointment.save()

    await Queue.add(CancellationMail.key, {
      appointment
    })

    return res.json(appointment)
  }
}

export default new AppointmentController()
