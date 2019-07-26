module.exports = {
  up: (queryInterface, Sequelize) => {
    // Essa é a interface para
    // adicionar a nova coluna
    return queryInterface.addColumn(
      // O primeiro parâmetro informa a tabela
      // a qual vou adicionar essa nova coluna
      'users',
      // Esse parâmetro informa o nome da coluna
      'avatar_id',
      {
        // Esse campo será do tipo inteiro porque vou
        // referenciar o ID da imageme não a imagem em si
        type: Sequelize.INTEGER,
        // Aqui eu vou criar uma foreign key
        // chamada chave estrangeira no banco relacional
        // Em model referenciamos a tabela files e depois a chave
        // Ou seja, a chave id da tabela files
        references: { model: 'files', key: 'id' },
        // Indica o que acontece se ele for atualizao
        onUpdate: 'CASCADE',
        // Indica o que acontece se ele for deletado
        onDelete: 'SET NULL',
        allowNull: true
      }
    )
  },

  down: queryInterface => {
    // Aqui instruimos que deve ser apagada
    // a coluna avatar_id dentro da tabela users
    return queryInterface.removeColumn('users', 'avatar_id')
  }
}
