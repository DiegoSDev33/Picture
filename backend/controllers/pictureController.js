const Picture = require("../models/Picture");

//helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PictureController {
  static async create(req, res) {
    const { title, comment } = req.body;

    const images = req.files;

    const available = true;

    if (!title) {
      res.status(422).json({ message: "O titulo é obrigatorio!!" });
      return;
    }
    if (!comment) {
      res.status(422).json({ message: "Deixe um comentario" });
      return;
    }

    if (images.length === 0) {
      res
        .status(422)
        .json({ message: "Para postar é necessario pelo menos uma imagem" });
      return;
    }

    // get user prints
    const token = getToken(req);
    const user = await getUserByToken(token);

    const picture = new Picture({
      title,
      comment,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });

    images.map((image) => {
      picture.images.push(image.filename);
    });

    try {
      const newPicture = await picture.save();
      res.status(201).json({
        message: "Lugar cadastrado com sucesso!",
        newPicture,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getAll(req, res) {
    const pictures = await Picture.find().sort("-createdAt");

    res.status(200).json({
      pictures: pictures,
    });
  }

  static async getAllUserPictures(req, res) {
    //get user from token

    const token = getToken(req);
    const user = await getUserByToken(token);

    const pictures = await Picture.find({ "user._id": user._id }).sort(
      "-createdAt"
    );

    res.status(200).json({
      pictures,
    });
  }

  static async getAllUserFavorites(req, res) {
    //get user from token

    const token = getToken(req);
    const user = await getUserByToken(token);

    const pictures = await Picture.find({ "favorite._id": user._id }).sort(
      "-createdAt"
    );

    res.status(200).json({
      pictures,
    });
  }

  static async getPictureById(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido" });
      return;
    }

    //check if pictures exists
    const pictures = await Picture.findOne({_id:id})

    if(!pictures) {
      res.status(404).json({message: "Foto não encontrada!!"})
      return
    }

    res.status(200).json({
      pictures: pictures,
    })

  }

  static async removePictureById(req, res){
    const id = req.params.id

    // check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido" });
      return;
    }

    const picture = await Picture.findOne({_id : id})

    if(!picture){
      res.status(404).json({ message: 'Imagem não encontrada!!'})
      return
    }


    //check if logged in user registered the picture

    const token = getToken(req)
    const user = await getUserByToken(token)

    if(picture.user._id.toString() !== user._id.toString()){
      res.status(422).json({ message: "Houve um problema em processar a sua solicitação" });
      return;
    }

    await Picture.findByIdAndDelete(id)

    res.status(200).json({message: "Foto removida com sucesso!!!"})


  }

  static async updatePicture(req, res){
    const { title, comment, available } = req.body;

    const images = req.files;

    const updateData = {}

    // Obtenha o ID a partir dos parâmetros da requisição
    const id = req.params.id;

      //check if pictures exists
      const picture = await Picture.findOne({_id : id})

      if(!picture){
        res.status(404).json({ message: 'Imagem não encontrada!!'})
        return
      }
  //check if logged in user registered the picture

  const token = getToken(req)
  const user = await getUserByToken(token)

  if(picture.user._id.toString() !== user._id.toString()){
    res.status(422).json({ message: "Houve um problema em processar a sua solicitação" });
    return;
  }


  //validation
  if (!title) {
    res.status(422).json({ message: "O titulo é obrigatorio!!" });
    return
   
  } else{
    updateData.title = title
  }
  if (!comment) {
    res.status(422).json({ message: "Deixe um comentario" });
    return;
  } else{
    updateData.comment = comment
  }
  if (images.length === 0) {
    res
      .status(422)
      .json({ message: "Para postar é necessario pelo menos uma imagem" });
    return;
  }else{
    updateData.images = []
    images.map((image) => {
      updateData.images.push(image.filename)
    })

  }

  await Picture.findByIdAndUpdate(id, updateData)

  res.status(200).json({ message: ' Fotos atualizadas com sucesso!!!'})


  }

static async favorites(req, res){

  const id = req.params.id

  //check if pictures exists
  const picture = await Picture.findOne({_id : id})

  if(!picture){
    res.status(404).json({ message: 'Imagem não encontrada!!'})
    return
  }

    //check if logged in user registered the picture

    const token = getToken(req)
    const user = await getUserByToken(token)

    if(picture.user._id.equals(user._id)){
      res.status(422).json({ message: "voce nao pode favoritar sua mesma mensagem" });
      return;
    }

    if(picture.favorites){
      if(picture.favorites._id.equals(user._id)){
        res.status(422).json({
          message: 'Esta imagem ja é sua favorita'
        })
        return
      }
    }

    // add user with pictures

    picture.favorites = {
      _id: user._id,
      name: user.name,
      image: user.image
    }

    await Picture.findByIdAndUpdate(id, picture)
      
      res.status(200).json({
        message: `A imagem foi adicionada aos favoritos`
      })


}


};
