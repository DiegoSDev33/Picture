const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:3333" }));

app.use(express.static("public"));

const UserRoutes = require("./routes/userRoutes");
const PictureRoutes = require("./routes/picturesRoutes");

app.use("/users", UserRoutes);
app.use("/pictures", PictureRoutes);

app.listen(5555);
