const mongoose = require('../db/conn')
const {Schema} = mongoose

const Picture = mongoose.model(
  'Picture',
  new Schema({
    title: {
      type: String,
      required: true
    },
   images:{
    type: Array,
    required:true
   },
   available:{
    type:Boolean,
   },
   comment:{
    type: String,
    required: true
  },
   user:Object,
   travel:Object,
  }, {timestamps: true})// nos da as informações de quando foi criado ou atualizado
)

module.exports = Picture