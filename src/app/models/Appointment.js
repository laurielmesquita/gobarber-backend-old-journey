import Sequelize, { Model } from 'sequelize'

class Appointment extends Model {
  // Método stático que é chamado automáticamente pelo sequelize
  static init (sequelize) {
    // super.init() Chamando o método init da classe pai
    // super é passado como primeiro parâmetro,
    // é um objeto contendo todas as colunas
    super.init(
      {
        // Vamos enviar as colunas da nossa base de dados
        // Somente as colunas que serão inseridas pelo user
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE
      },
      // Aqui é o segundo parâmetro com o objeto sequelize
      // Aqui também poderia passar mais configurações
      {
        sequelize
      }
    )

    // Retorna o módulo que acabou de ser inicializado
    return this
  }

  // Método estático de associação que recebe todos os models
  static associate (models) {
    // Informamos que o model de agendamento pertence ao model de usuário
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' })
  }
}

export default Appointment
