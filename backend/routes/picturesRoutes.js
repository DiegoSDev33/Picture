const router = require("express").Router();

const PictureController = require("../controllers/pictureController");

//middlewares
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post(
  "/create",
  verifyToken,
  imageUpload.array("images"),
  PictureController.create
);
router.get("/", PictureController.getAll);
router.get("/mypictures", verifyToken, PictureController.getAllUserPictures);
router.get("/myfavorites", verifyToken, PictureController.getAllUserFavorites);
router.get("/:id", PictureController.getPictureById);
router.delete("/:id", verifyToken, PictureController.removePictureById)
//router.patch('/:id', verifyToken, imageUpload.array('images', PictureController.updatePicture))
router.patch('/:id', verifyToken, PictureController.updatePicture);


module.exports = router;
