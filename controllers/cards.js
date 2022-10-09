const Card = require('../models/card');
const NotFoundError = require('../Errors/NotFoundError');
const ValidationError = require('../Errors/ValidationError');
const ServerError = require('../Errors/ServerError');
const ForbiddenError = require('../Errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Запрашиваемая карточка не найдена'))
    .then((card) => {
      if (req.user._id === String(card.owner)) {
        return Card.findByIdAndRemove(req.params.cardId);
      }
      throw new ForbiddenError('Нет прав на удаление этой карточки');
    })
    .catch((err) => {
      if (err.name === 'NotFoundError' || err.name === 'ForbiddenError') {
        throw err;
      } else if (err.name === 'CastError') {
        throw new ValidationError('Передан некорректный id');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий id карточки.'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw err;
      } else if (err.name === 'CastError') {
        throw new ValidationError('Передан некорректный id');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий id карточки.'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw err;
      } else if (err.name === 'CastError') {
        throw new ValidationError('Передан некорректный id');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};
