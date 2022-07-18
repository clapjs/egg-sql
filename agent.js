'use strict';

const sql = require('./lib/sql');

module.exports = agent => {
  if (agent.config.clearSql.agent) sql(agent);
};
