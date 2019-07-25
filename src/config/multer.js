import multer from 'multer'
import crypto from 'crypto'
import { extname, resolve } from 'path'

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // Em filename vamos formatar o nome do arquivo
    // Em req temos todos os dados da requisição
    // Em file todos as informações sobre o arquivo, como tipo e tamanho etc
    //
    filename: (req, file, cb) => {
      // Chamamos o crypto para criar uma sequencia única de caracteres
      // 16 é o número de bytes aleatórios que quero criar
      // O segungo parâmetro é um callback
      crypto.randomBytes(16, (err, res) => {
        // Se der algum erro vamos retornar esse erro
        // passando esse erro dento de cb (callback)
        if (err) return cb(err)

        // Se nao deu erro vamos retornar o callback
        // Recebe null no primeiro parâmetro pq queremos
        // passar nesse momento o nome do arquivo, beleza?
        // No segundo parâmetro vamos passar a resposta da
        // requisição informando o nome gerado a partir da
        // extensão do aquivo e dos caracteres aleatórios
        return cb(null, res.toString('hex') + extname(file.originalname))
      })
    }
  })
}
