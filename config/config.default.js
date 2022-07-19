'use strict';

/**
 * egg-sql default config
 * @member Config#sql
 * @property {String} SOME_KEY - some description
 */
exports.sql = {
    // Single Database
    // client: {
    //   host: 'host',
    //   port: 'port',
    //   user: 'user',
    //   password: 'password',
    //   database: 'database',
    // },

    // Multi Databases
    // clients: {
    //   db1: {
    //     host: 'host',
    //     port: 'port',
    //     user: 'user',
    //     password: 'password',
    //     database: 'database',
    //   },
    //   db2: {
    //     host: 'host',
    //     port: 'port',
    //     user: 'user',
    //     password: 'password',
    //     database: 'database',
    //   },
    // },
    app: true,
    agent: false,
};
