const mongoose = require('../db/conn')
const {Schema} = mongoose

const User = mongoose.model(
  'User',
  new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
  }, {timestamps: true})// nos da as informações de quando foi criado ou atualizado
)

module.exports = User