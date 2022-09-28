const express = require("express");
const userRouter = require("./routes/users.js");
const cardRouter = require("./routes/cards.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "63307f3ec55b1b5e51d826e5",
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", userRouter);
app.use("/cards", cardRouter);
app.use("*", function (req, res) {
  res.status(404).send({ message: "Страница не найдена" });
});

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
