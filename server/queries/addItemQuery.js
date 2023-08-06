'use strict';
const config = require('../config');
const sql = require('mssql');

const insertItem = async (body, encoder) => {

  const postBody = await body;
  const userCode = await encoder;
  const repeatQuery = await body.itemQuantity;

  const queryString = `
    INSERT INTO Assets(
      GenericName,
      DeptCode,
      CategoryCode,
      UnitCost,
      SetNo,
      DateReceived,
      SupplierName,
      PurchaseOrderNo,
      InvoiceNo,
      BrandName,
      BrandModel,
      SerialNo,
      ItemSpecs,
      NewAssetCode,
      AssetTagStatus,
      ItemRemarks,
      OldAssetCode,
      PhysicalLocation,
      ItemCode,
      ReceivingReport
    ) SELECT
      @genericName,
      @deptCode,
      @categoryCode,
      @unitCost,
      @setNo,
      @dateReceived,
      @supplierName,
      @purchaseOrderNo,
      @invoiceNo,
      @brandName,
      @brandModel,
      @serialNo,
      @itemSpecs,
      @newAssetCode,
      @assetTagStatus,
      @itemRemarks,
      @oldAssetCode,
      @physicalLocation,
      @itemCode,
      @receivingReport
    FROM (SELECT row_number() OVER (ORDER BY object_id, column_id) seq
    FROM sys.columns) a
    WHERE a.seq <= @repeatQuery
  `;

  const logString = `
    INSERT INTO Logs(
      UserCode,
      ItemId,
      Activity,
      DeptFrom,
      DeptTo
    ) VALUES (
      @userCode,
      @itemId,
      @activity,
      @deptFrom,
      @deptTo
    )
  `;

  try {
    await sql.connect(config.sql);
    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
      const results = await transaction.request()
      .input("GenericName", sql.VarChar, postBody.genericName)
      .input("DeptCode", sql.VarChar, postBody.deptCode)
      .input("CategoryCode", sql.VarChar, postBody.categoryCode)
      .input("UnitCost", sql.Float, postBody.unitCost)
      .input("SetNo", sql.VarChar, postBody.setNo)
      .input("DateReceived", sql.Date, postBody.dateReceived)
      .input("SupplierName", sql.VarChar, postBody.supplierName)
      .input("PurchaseOrderNo", sql.VarChar, postBody.purchaseOrderNo)
      .input("InvoiceNo", sql.VarChar, postBody.invoiceNo)
      .input("BrandName", sql.VarChar, postBody.brandName)
      .input("BrandModel", sql.VarChar, postBody.brandModel)
      .input("SerialNo", sql.VarChar, postBody.serialNo)
      .input("ItemSpecs", sql.VarChar, postBody.itemSpecs)
      .input("NewAssetCode", sql.VarChar, postBody.newAssetCode)
      .input("AssetTagStatus", sql.Int, postBody.assetTagStatus)
      .input("ItemRemarks", sql.VarChar, postBody.itemRemarks)
      .input("OldAssetCode", sql.VarChar, postBody.oldAssetCode)
      .input("PhysicalLocation", sql.VarChar, postBody.physicalLocation)
      .input("ItemCode", sql.VarChar, postBody.itemCode)
      .input("ReceivingReport", sql.VarChar, postBody.receivingReport)
      .input("repeatQuery", sql.Int, repeatQuery)
      .query(queryString)

      const itemRows = await transaction.request()
      .query(`SELECT TOP ${results.rowsAffected[0]} Assets.ItemId as itemId FROM Assets ORDER BY ItemId DESC`);
      const itemRowsObj = await itemRows.recordset;

      for (const item of itemRowsObj) {
        const logsRows = await transaction.request()
        .input("UserCode", sql.VarChar, userCode)
        .input("ItemId", sql.Int, item.itemId)
        .input("Activity", sql.VarChar, 'C')
        .input("DeptFrom", sql.VarChar, null)
        .input("DeptTo", sql.VarChar, postBody.deptCode)
        .query(logString);
      }

      await transaction.commit();
      return true;

    } catch (error) {
      await transaction.rollback();
      return false;
    }
  } catch (error) {
    return false;
  }

}

module.exports = {
  insertItem,
}
