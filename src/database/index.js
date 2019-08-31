// IMPORT QUE VAI FAZER A CONEXÃO COM O BANCO
import Sequelize from 'sequelize'
import mongoose from 'mongoose'

// Importando as configurações do bando de dados
import databaseConfig from '../config/database'

import User from '../app/models/User'
import File from '../app/models/File'
import Appointment from '../app/models/Appointment'

// Array com os models da aplicação
const models = [User, File, Appointment]

class Database {
  // Method constructor
  constructor () {
    // Chamando o método init()
    this.init()
    this.mongo()
  }

  // Método init() que faz a conexão com a base de dados
  // e também carregar os nossos models
  init () {
    // Vamos instanciar uma variável ```connection```
    // que vai me dar a minha conexão com a base de dados
    this.connection = new Sequelize(databaseConfig)

    // Vamos percorrer o array com os models
    // chamando o init() para connection
    models
      .map(model => model.init(this.connection))
      // Esse segundo map vai percorrer novamente os models
      // chamando para cada um dos models o método associate.
      // Só vamos executar esse método associate se ele existir no model.
      // Para tal, vamos criar uma condição com && que vai fazer com que
      // toda a parte que vem depois só seja executada se a parte
      // anterior for verdadeira.
      .map(model => model.associate && model.associate(this.connection.models))
  }

  mongo () {
    this.mongoConnection = mongoose.connect(
      // Aqui dentro eu preciso passar a url de conexão do mongo
      // Não tendo user e senha (já que o docker run padrão do mongo não gera)
      // eu posso passar diretamente qual será o host
      process.env.MONGO_URL,
      // Agora vamos passar um objeto com algumas configurações adicionais
      {
        // Porque estamos utilizando um formato de url do mongo um pouco mais
        // novo que o formato utilizado até pouco tempo
        useNewUrlParser: true,
        // Essa é uma configuração do mongo para a forma que vamos encontrar e
        // modificar registros
        useFindAndModify: true
      }
    )
  }
}

export default new Database()
