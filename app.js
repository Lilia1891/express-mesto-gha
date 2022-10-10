const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } = require('./constants');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const urlRegExp = require('./utils');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegExp),
  }),
}), createUser);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Страница не найдена' });
});

app.use(errors());

app.use((err, req, res, next) => {
  if (!err.status) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  } else {
    res.status(err.status).send({ message: err.message });
  }
  return next;
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
