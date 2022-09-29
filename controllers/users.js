const User = require('../models/user');
const NotFoundError = require('../Errors/NotFoundError');
const {
  BAD_REQUEST_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let {
        status = INTERNAL_SERVER_ERROR,
        message = 'На сервере произошла ошибка',
      } = err;

      if (err.name === 'ValidationError') {
        status = BAD_REQUEST_ERROR;
        message = 'Переданы некорректные данные';
      }
      res.status(status).send({ message });
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
    },
  )
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let {
        status = INTERNAL_SERVER_ERROR,
        message = 'На сервере произошла ошибка',
      } = err;

      if (err.name === 'ValidationError') {
        status = BAD_REQUEST_ERROR;
        message = 'Переданы некорректные данные';
      }
      res.status(status).send({ message });
    });
};
