const sql = require('mssql');
var config = require('../config/dbconfig');

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', error => {
  console.log(error);
})

async function selectRecords(queryString) {
  await poolConnect;
  try {
    // const request = new sql.Request();
    // request.stream = true
    let queryResult = await pool.request().query(queryString);
    return queryResult.recordsets;
  }
  catch (err) {
    console.log(err);
    return err;
  }
}

async function selectSpecificRecords(queryString, inputValue) {
  await poolConnect;
  try {
    // let queryResult = await pool.request()
    //   .input('input_parameter', sql.Int, inputValue)
    //   .query(queryString);
    // return queryResult.recordsets;
    // let queryResult = await pool.request()
    //   .input('input_parameter', sql.DateTime, inputValue)
    //   .query(queryString);
    // return queryResult.recordsets;
    let queryResult = await pool.request()
      .input('input_parameter', sql.NVarChar, inputValue)
      .query(queryString);
    return queryResult.recordsets;
  }
  catch (err) {
    console.log(err);
    return err;
  }
}

async function insertBulkRecords() {
  await poolConnect;
  try {
    const table = new sql.Table('table_name');
    table.create = true;
    table.columns.add('id', sql.Int, { nullable: false, primary: true });
    table.columns.add('name', sql.VarChar(128), { nullable: false });
    table.rows.add(1, 'Alice');
    table.rows.add(2, 'Bob');
    table.rows.add(3, 'Carol');

    const request = new sql.Request();
    return request.bulk(table)
  }
  catch (err) {
    console.log(err);
    return err;
  }
}

async function insertOneRecord() {
  await poolConnect;
  try {
    const queryResult = await pool.request()
      .input('myval', sql.VarChar, 'value')
      .query('insert into testtable (somecolumn) values (@myval)');
    return queryResult;
  }
  catch (err) {
    console.log(err);
    return err;
  }
}

async function updateOneRecord() {
  await poolConnect;
  try {
    const queryResult = await pool.request()
      .input('myval', sql.VarChar, 'value')
      .input('cond', sql.VarChar, 'value')
      .query('update testtable set somecolumn = @myval where Id = @cond');
    return queryResult;
  }
  catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = {
  selectRecords: selectRecords,
  selectSpecificRecords: selectSpecificRecords,
  insertBulkRecords: insertBulkRecords,
  insertOneRecord: insertOneRecord,
  updateOneRecord: updateOneRecord
}