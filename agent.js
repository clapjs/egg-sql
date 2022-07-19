'use strict';

const sql = require('./lib/sql');

module.exports = agent => {
  if (agent.config.sql.agent) sql(agent);
};
