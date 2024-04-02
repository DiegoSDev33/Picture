  const getToken = (req) => {
  const authHeader = req.headers.authorization
  const token = authHeader.split(" ")[1] // com o espaço dentro dos parenteses, transforma o que tem dentro em um array, assim estou pegando a primeira parte

  return token

}


module.exports = getToken