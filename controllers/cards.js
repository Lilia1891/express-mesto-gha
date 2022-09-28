const Card = require("../models/card");
const NotFoundError = require("../Errors/NotFoundError");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name: name, link: link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: " Переданы некорректные данные при создании карточки.",
        });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError("Запрашиваемая карточка не найдена"))
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new NotFoundError("Передан несуществующий id карточки."))
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new NotFoundError("Передан несуществующий id карточки."))
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
