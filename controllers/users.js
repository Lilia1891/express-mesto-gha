const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../Errors/NotFoundError');
const ValidationError = require('../Errors/ValidationError');
const ServerError = require('../Errors/ServerError');
const AuthorizationError = require('../Errors/AuthorizationError');
const RegistrationError = require('../Errors/RegistrationError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => {
      throw new ServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
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

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
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

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании пользователя.');
      } else if (err.code === 11000) {
        throw new RegistrationError('Такой email уже существует.');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  console.log(req.body.name, req.body.about);
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
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
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      } else {
        throw new ServerError('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      throw new AuthorizationError('Неправильные почта или пароль');
    })
    .catch(next);
};
