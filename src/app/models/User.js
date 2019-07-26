import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

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
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN
      },
      // Aqui é o segundo parâmetro com o objeto sequelize
      // Aqui também poderia passar mais configurações
      {
        sequelize
      }
    )
    // Esse código será executado de forma automatica
    // antes do usuário ser salvo no banco de dados
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8)
      }
    })

    // Retorna o módulo que acabou de ser inicializado
    return this
  }

  // Método estático de associação que recebe todos os models
  static associate (models) {
    // Aqui informamos que o model de usuário pertence ao model de file
    // Isso quer dizer que eu vou ter um arquivo de id sendo guardado
    // dentro do meu modo de usuário passando o nome da coluna que vai
    // armazenar a referencia do arquivo, que é avatar_id
    // Em as: 'avatar', estamos passando um codinome para esse relacionamento
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' })
  }

  // Método para comparar senhas
  checkPassword (password) {
    // Se as senhas forem iguais o bcrypt.compare
    // vai retornar true, senão retorna false
    return bcrypt.compare(password, this.password_hash)
  }
}

export default User
