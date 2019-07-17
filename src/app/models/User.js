import Sequelize, { Model } from 'sequelize'

class User extends Model {
  // Método stático que é chamado automáticamente pelo sequelize
  static init (sequelize) {
    // super.init() Chamando o método init da classe pai
    // super é passado como primeiro parâmetro,
    // é um objeto contendo todas as colunas
    super.init(
      {
        // Vamos enviar as colunas da nossa base de dados
        // Somente as colunas que serão inseridas pelo user
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN
      },
      // Aqui é o segundo parâmetro com o objeto sequelize
      // Aqui também poderia passar mais configurações
      {
        sequelize
      }
    )
  }
}

export default User
