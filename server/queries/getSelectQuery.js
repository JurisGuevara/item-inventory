'use strict';
const config = require('../config');
const sql = require('mssql');

const deptList = async () => {

  try {
    let pool = await sql.connect(config.sql);

    const list = await pool.request()
    .query`
      SELECT
      DeptCode as value,
      DeptName as label
      FROM Department
      ORDER BY DeptName
    `;

    return list.recordset;
  } catch (error) {
    return error;
  }

}

const categoryList = async () => {

  try {
    let pool = await sql.connect(config.sql);

    const list = await pool.request()
    .query`
      SELECT
      CategoryCode as value,
      CategoryName as label
      FROM Category
    `;

    return list.recordset;
  } catch (error) {
    return error;
  }

}

const setNoList = async () => {

  try {
    let pool = await sql.connect(config.sql);

    const list = await pool.request()
    .query`
      SELECT
      SetId as value,
      SetId as label
      FROM Sets
      WHERE Deleted = 0
    `;

    return list.recordset;
  } catch (error) {
    return error;
  }

}

module.exports = {
  deptList,
  categoryList,
  setNoList,
}
