'use strict';
const config = require('../config');
const sql = require('mssql');

const list = async (query) => {

  let queryObj = query;
  let queryFilter = ``;

  if(Object.hasOwn(query, 'dateFrom')) {
    queryFilter += `AND setDateReceived >= '${query.dateFrom}'`;
    delete queryObj.dateFrom;
  }

  if(Object.hasOwn(query, 'dateTo')) {
    queryFilter += `AND setDateReceived <= '${query.dateTo}'`;
    delete queryObj.dateTo;
  }

  const queryLen = Object.keys(queryObj).length;

  if(queryLen > 0) {
    const queryObj = Object.entries(query);

    for (const [k, v] of queryObj) {
      queryFilter += `AND Sets.${k} LIKE '%${v}%'`;
    }
  }

  let queryString = `
    SELECT TOP 1000
    Sets.setId as setId,
    Sets.setGenericName as setGenericName,
    Department.DeptName as setDeptCode,
    Category.CategoryName as setCategoryCode,
    Sets.setCost as setCost,
    Sets.setDateReceived as setDateReceived,
    Sets.setSupplierName as setSupplierName,
    Sets.setPurchaseOrderNo as setPurchaseOrderNo,
    Sets.setInvoiceNo as setInvoiceNo,
    Sets.setItemSpecs as setItemSpecs,
    Sets.setRemarks as setRemarks,
    Sets.ReceivingReport as receivingReport,
    Sets.condemned as condemned,
    Sets.salvaged as salvaged
    FROM Sets
    INNER JOIN Department ON Department.DeptCode=Sets.SetDeptCode
    INNER JOIN Category ON Category.CategoryCode=Sets.SetCategoryCode
    WHERE Deleted = 0
    ${queryFilter}
    ORDER BY SetId DESC
  `;

  try {
    let pool = await sql.connect(config.sql);
    const results = await pool.request().query(queryString);
    return results.recordset;
  } catch (error) {
    return error;
  }
}

module.exports = {
  list,
}
