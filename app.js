'use strict';

const sql = require('./lib/sql');

module.exports = app => {
  if (app.config.sql.app) sql(app);
};
