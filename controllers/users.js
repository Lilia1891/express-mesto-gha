const User = require("../models/user");
const NotFoundError = require("../Errors/NotFoundError");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError("Запрашиваемый пользователь не найден"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let { status = 500, message = "Произошла ошибка" } = err;
      if (err.name === "CastError") {
        status = 400;
        message = err.message;
      }
      res.status(status).send({ message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new NotFoundError("Запрашиваемый пользователь не найден"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(new NotFoundError("Запрашиваемый пользователь не найден"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};
