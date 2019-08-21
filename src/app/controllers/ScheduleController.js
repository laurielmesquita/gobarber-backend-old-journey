import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { Op } from 'sequelize'

import User from '../models/User'
import Appointment from '../models/Appointment'

class ScheduleController {
  async index (req, res) {
    const checkUserProvider = await User.findOne({
      // Requisitos para ser um provider listados aqui
      where: {
        id: req.userId,
        provider: true
      }
    })

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider!' })
    }

    // Agora vamos pegar a data
    const { date } = req.query
    const parsedate = parseISO(date)

    // Agora vamos filtrar apenas os dias sem os horários
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        // Na data vamos fazer uma verificação a mais
        // pegando o que estiver entre os seguintes horários
        // 2019-08-20 00:00:00
        // 2019-08-20 23:59:59
        date: {
          [Op.between]: [startOfDay(parsedate), endOfDay(parsedate)]
        }
      },
      order: ['date']
    })

    return res.json(appointments)
  }
}

export default new ScheduleController()
