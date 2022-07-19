'use strict';

const assert = require('assert');
const mssql = require('mssql');
const mysql = require('mysql');
const oracledb = require('oracledb');

module.exports = app => {
    app.addSingleton('db', createClient);
};

let count = 0;

async function createClient(config, app) {
    // test config
    assert(config.type, `[egg-sql] 'type: ${config.type}' are required on config`);
    const db={type:config.type};
    if(config.type==='mssql'){
        assert(config.server && config.port && config.user && config.database, `[egg-sql] 'server: ${config.server}', 'port: ${config.port}', 'user: ${config.user}', 'database: ${config.database}' are required on config`);
        app.coreLogger.info('[egg-sql:mssql] connecting %s@%s:%s/%s', config.user, config.server, config.port, config.database);
        const pool = new mssql.ConnectionPool(config);
        db.client = new mssql.Request(await pool.connect());
        db.query=async(sql)=>{
            console.log(sql);
            return await db.client.query(sql).then(res=>res.recordsets[0])
        }
        // 做启动应用前的检查
        app.beforeStart(async ()=> {
            const rows = await db.query('select getdate() as currentTime;');
            const index = count++;
            app.coreLogger.info(`[egg-sql:mssql] instance[${index}] status OK, mssql currentTime: ${rows[0].currentTime}`);
        });
    }
    else if(config.type==='mysql'){
        assert(config.host && config.port && config.user && config.database, `[egg-sql:mysql] 'host: ${config.host}', 'port: ${config.port}', 'user: ${config.user}', 'database: ${config.database}' are required on config`);
        app.coreLogger.info('[egg-sql:mysql] connecting %s@%s:%s/%s', config.user, config.host, config.port, config.database);
        const pool = await mysql.createPool(config);
        db.client = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                resolve(conn)
            })
        })
        db.query= async (sql)=>{
            console.log(sql);
            return await new Promise((resolve, reject) => {
                pool.getConnection((err, connection) => {
                    connection.query(sql, (error, results)=> {
                        resolve(results)
                    })
            })
          })
        }
        app.beforeStart(async()=> {
            const rows = await db.query('select now() as currentTime;');
            const index = count++;
            app.coreLogger.info(`[egg-sql:mysql] instance[${index}] status OK, rds currentTime: ${rows[0].currentTime}`);
        });
    }
    else if(config.type==='oracle'){
        assert(config.user && config.password && config.connectString, `[egg-sql:oracle] '${config.connectString}', 'user: ${config.user}' are required on config`);
        app.coreLogger.info('[egg-sql:oracle] connecting %s', config.connectString);
        const pool = await oracledb.createPool(config);
        db.client = await pool.getConnection();
        db.query=async(sql)=>{
            console.log(sql);
            return await db.client.execute(sql).then(res=>{
                const results=[];
                for(let row of res.rows){
                    let result={};
                    for(let index in res.metaData){
                        result[res.metaData[index].name]=row[index]
                    }
                    results.push(result)
                }
                return results
            })
        }
        app.beforeStart(async()=> {
            const rows = await db.query("select to_char(sysdate,'yyyy-MM-dd HH24:mi:ss') as currentTime from dual");
            const index = count++;
            app.coreLogger.info(`[egg-sql:oracle] instance[${index}] status OK, currentTime: ${rows[0].currentTime}`);
        });
    }
    return db;
}
