require('dotenv').config();
const express = require('express');
const knex = require('knex');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./misc/errorHandler');
const { NODE_ENV, DATABASE_URL } = require('./config');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

// =================== //
// Initial setup       //
// =================== //

const app = express();
const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

const morganOutput = NODE_ENV === 'production' ? 'tiny' : 'common';

// =================== //
// Middleware          //
// =================== //

app.use(morgan(morganOutput));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.set('db', db);

// =================== //
// Routes              //
// =================== //

app.use('/api/auth/', authRouter);
app.use('/api/users/', usersRouter);

// =================== //
// Error Handling      //
// =================== //

// Catch-all 404 handler
app.use((req, res, next) => {
  const err = new Error('Path not found');
  err.status = 404;
  next(err);
});
app.use(errorHandler);

module.exports = app;
