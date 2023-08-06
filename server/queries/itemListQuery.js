'use strict';
const config = require('../config');
const sql = require('mssql');

const list = async (query) => {

  let queryObj = query;
  let queryFilter = ``;

  if(Object.hasOwn(query, 'dateFrom')) {
    queryFilter += `AND DateReceived >= '${query.dateFrom}'`;
    delete queryObj.dateFrom;
  }

  if(Object.hasOwn(query, 'dateTo')) {
    queryFilter += `AND DateReceived <= '${query.dateTo}'`;
    delete queryObj.dateTo;
  }

  const queryLen = Object.keys(queryObj).length;

  if(queryLen > 0) {
    const queryObj = Object.entries(query);

    for (const [k, v] of queryObj) {
      queryFilter += `AND Assets.${k} LIKE '%${v}%'`;
    }
  }

  let queryString = `
    SELECT TOP 1000
    Assets.ItemId as itemId,
    Assets.GenericName as genericName,
    Department.DeptName as deptCode,
    Category.CategoryName as categoryCode,
    Assets.UnitCost as unitCost,
    Assets.SetNo as setNo,
    Assets.DateReceived as dateReceived,
    Assets.SupplierName as supplierName,
    Assets.PurchaseOrderNo as purchaseOrderNo,
    Assets.InvoiceNo as invoiceNo,
    Assets.BrandName as brandName,
    Assets.BrandModel as brandModel,
    Assets.SerialNo as serialNo,
    Assets.ItemSpecs as itemSpecs,
    Assets.NewAssetCode as newAssetCode,
    Assets.ItemCode as itemCode,
    Assets.ReceivingReport as receivingReport,
    Assets.AssetTagStatus as assetTagStatus,
    Assets.ItemRemarks as itemRemarks,
    Assets.OldAssetCode as oldAssetCode,
    Assets.PhysicalLocation as physicalLocation,
    Assets.Condemned as condemned,
    Assets.Salvaged as salvaged
    FROM Assets
    INNER JOIN Department ON Department.DeptCode=Assets.DeptCode
    INNER JOIN Category ON Category.CategoryCode=Assets.CategoryCode
    WHERE Deleted = 0
    ${queryFilter}
    ORDER BY ItemId DESC
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
