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
      queryFilter += `AND ${k} LIKE '%${v}%'`;
    }
  }

  let queryString = `
    SELECT TOP 1000
    s1.setId AS id,
    s1.setGenericName AS genericName,
    Department.DeptName AS deptCode,
    Category.CategoryName AS categoryCode,
    s1.setCost AS unitCost,
    s1.setDateReceived AS dateReceived,
    s1.setSupplierName AS supplierName,
    s1.setPurchaseOrderNo AS purchaseOrderNo,
    s1.setInvoiceNo AS invoiceNo,
    s1.setItemSpecs AS itemSpecs,
    s1.setRemarks AS itemRemarks,
    s1.receivingReport,
    s1.condemned,
    s1.salvaged
    FROM Sets s1
    INNER JOIN Department ON Department.DeptCode=s1.setDeptCode
    INNER JOIN Category ON Category.CategoryCode=s1.setCategoryCode
    WHERE s1.deleted = 0
    ${queryFilter}
    ORDER BY SetId DESC

    SELECT
    a.genericName,
    Department.DeptName AS deptCode,
    Category.CategoryName AS categoryCode,
    a.unitCost,
    a.setNo AS id,
    a.dateReceived,
    a.supplierName,
    a.purchaseOrderNo,
    a.invoiceNo,
    a.brandName,
    a.brandModel,
    a.serialNo,
    a.itemSpecs,
    a.newAssetCode,
    a.itemCode,
    a.receivingReport,
    a.assetTagStatus,
    a.itemRemarks,
    a.oldAssetCode,
    a.physicalLocation,
    a.condemned,
    a.salvaged
    FROM Sets s2
    INNER JOIN Assets a ON s2.SetId=a.SetNo
    INNER JOIN Department ON Department.deptCode=a.deptCode
    INNER JOIN Category ON Category.categoryCode=a.categoryCode
    WHERE SetNo IS NOT NULL
    AND a.deleted = 0
    ${queryFilter}
    ORDER BY SetId DESC  
  `;

  try {
    let pool = await sql.connect(config.sql);
    const results = await pool.request().query(queryString);

    return results.recordsets;
  } catch (error) {
    return error;
  }
}

module.exports = {
  list,
}
