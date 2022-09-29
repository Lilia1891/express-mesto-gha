const Card = require('../models/card');
const NotFoundError = require('../Errors/NotFoundError');
const { BAD_REQUEST_ERROR, INTERNAL_SERVER_ERROR } = require('../constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: ' Переданы некорректные данные при создании карточки.',
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError('Запрашиваемая карточка не найдена'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let {
        status = INTERNAL_SERVER_ERROR,
        message = 'На сервере произошла ошибка',
      } = err;
      if (err.name === 'CastError') {
        status = BAD_REQUEST_ERROR;
        message = 'Передан некорректный id';
      }
      res.status(status).send({ message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий id карточки.'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let {
        status = INTERNAL_SERVER_ERROR,
        message = 'На сервере произошла ошибка',
      } = err;
      if (err.name === 'CastError') {
        status = BAD_REQUEST_ERROR;
        message = 'Передан некорректный id';
      }
      res.status(status).send({ message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий id карточки.'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let {
        status = INTERNAL_SERVER_ERROR,
        message = 'На сервере произошла ошибка',
      } = err;
      if (err.name === 'CastError') {
        status = BAD_REQUEST_ERROR;
        message = 'Передан некорректный id';
      }
      res.status(status).send({ message });
    });
};
