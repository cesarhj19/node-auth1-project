/* eslint-disable global-require */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('../users/users-router');
const authRouter = require('../auth/auth-router');
const loginRouter = require('../login/login-router');

const restricted = require('../auth/restricted-middleware');

const server = express();

const sessionConfig = {
  name: 'peter',
  secret: 'top secret',
  cookie: {
    maxAge: 3600 * 1000,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,

  store: new KnexSessionStore(
    {
      knex: require('../data/dbConfig'),
      tablename: 'session',
      sidfieldname: 'sid',
      createTable: true,
      clearInterval: 3600 * 1000,
    },
  ),
};

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionConfig));

server.use('/api/users', restricted, usersRouter);
server.use('/api/register', authRouter);
server.use('/api/login', loginRouter);

server.get('/', (req, res) => {
  res.status(200).json({ api: 'up and running' });
});

module.exports = server;
