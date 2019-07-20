import jwt from 'jsonwebtoken'

// Promisify transforma uma função callback para uma
// função async/await, como no try/catch mais abaixo
import { promisify } from 'util' // util é uma lib padrão que vem com o NodeJS

// Vamos importar a authConfig porque é nela que está
// o segredo para descriptografar o token e ver se ele é válido
import authConfig from '../../config/auth'

// Middleware para verificar se o usuário está logado
// Nosso middleware será sempre uma função que recebe
// 3 parâmetros (req, res, next) como vemos abaixo
export default async (req, res, next) => {
  // Usaremos o next para determinar se a nossa
  // aplicação deve continuar ou não
  const authHeader = req.headers.authorization // Modo se referenciar ao header

  // Caso esse Header com o nosso token não for encontrado
  // vamos avisar que não foi provido um token na esquisição
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided!' })
  }

  // Agora vamos dividir a requisição em partes para pegar
  // somente o token que é a parte que realmente nos interessa
  // Para isso vamos desestruturar o array criado com essas
  // duas partes, ignorando o primeiro item desse array passando
  // apenas uma vírgula ',' e em seguida o nosso token
  const [, token] = authHeader.split(' ')

  try {
    // 1) Aqui podemos usar o await + promisify e dentro dele coloco o método
    // 2) que eu quero promisificar, ficará assim: await promisify(jwt.verify)
    // 3) Isso vai chamar uma outra função com os seguintes parâmetros
    // (token, authConfig.secret)
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    // Aqui vamos incluir o Id do usuário dentro da requisição
    req.userId = decoded.id

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid!' })
  }
}
