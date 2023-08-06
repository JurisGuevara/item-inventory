'use strict';
const config = require('../config');
const sql = require('mssql');

const item = async (id) => {
  const getOneItem = `
    SELECT
    itemId,
    genericName,
    deptCode,
    categoryCode,
    unitCost,
    setNo,
    dateReceived,
    supplierName,
    purchaseOrderNo,
    invoiceNo,
    brandName,
    brandModel,
    serialNo,
    itemSpecs,
    newAssetCode,
    assetTagStatus,
    itemRemarks,
    oldAssetCode,
    physicalLocation,
    condemned,
    salvaged,
    itemCode,
    receivingReport
    FROM Assets
    WHERE itemId = @id
    AND Deleted = 0
  `;

  const getItemHistory = `
    SELECT
    c1.Id as historyId,
    c1.UserCode as authorCode,
    e1.FULLNAME as authorName,
    a1.ActDesc as activity,
    d1.DeptName as deptFrom,
    d2.DeptName as deptTo,
    c1.ServerLog as tStamp
    FROM Logs c1
    LEFT JOIN Users e1 ON e1.CODE COLLATE Latin1_General_CS_AS=c1.UserCode
    LEFT JOIN Activity a1 ON a1.ActCode=c1.Activity
    LEFT JOIN Department d1 ON d1.DeptCode=c1.DeptFrom
    LEFT JOIN Department d2 ON d2.DeptCode=c1.DeptTo
    WHERE ItemId=@itemId
    AND DeptFrom != DeptTo
  `;

  try {
    let pool = await sql.connect(config.sql);
    const itemResult = await pool
    .request()
    .input("id", sql.Int, id)
    .query(getOneItem);

    const historyResult = await pool
    .request()
    .input("ItemId", sql.Int, id)
    .query(getItemHistory);

    return { item: itemResult.recordset, itemHistory: historyResult.recordset };
  } catch (error) {
    return error;
  }
}

const update = async (user, body) => {
  const userCode = user;
  const putBody = body;

  const updateItem = `
    UPDATE Assets
    SET
    GenericName = @genericName,
    DeptCode = @deptCode,
    CategoryCode = @categoryCode,
    UnitCost = @unitCost,
    SetNo = @setNo,
    DateReceived = @dateReceived,
    SupplierName = @supplierName,
    PurchaseOrderNo = @purchaseOrderNo,
    InvoiceNo = @invoiceNo,
    BrandName = @brandName,
    BrandModel = @brandModel,
    SerialNo = @serialNo,
    ItemSpecs = @itemSpecs,
    NewAssetCode = @newAssetCode,
    AssetTagStatus = @assetTagStatus,
    ItemRemarks = @itemRemarks,
    OldAssetCode = @oldAssetCode,
    PhysicalLocation = @physicalLocation,
    Condemned = @condemned,
    Salvaged = @salvaged,
    ItemCode = @itemCode,
    ReceivingReport = @receivingReport
    WHERE ItemId = @itemId
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
      const oldDept = await transaction.request()
      .query(`SELECT DeptCode as deptCode FROM Assets WHERE ItemId = ${putBody.itemId}`);

      await transaction.request()
      .input("GenericName", sql.VarChar, putBody.genericName)
      .input("DeptCode", sql.VarChar, putBody.deptCode)
      .input("CategoryCode", sql.VarChar, putBody.categoryCode)
      .input("UnitCost", sql.Float, putBody.unitCost)
      .input("SetNo", sql.Int, putBody.setNo)
      .input("DateReceived", sql.Date, putBody.dateReceived)
      .input("SupplierName", sql.VarChar, putBody.supplierName)
      .input("PurchaseOrderNo", sql.VarChar, putBody.purchaseOrderNo)
      .input("InvoiceNo", sql.VarChar, putBody.invoiceNo)
      .input("BrandName", sql.VarChar, putBody.brandName)
      .input("BrandModel", sql.VarChar, putBody.brandModel)
      .input("SerialNo", sql.VarChar, putBody.serialNo)
      .input("ItemSpecs", sql.VarChar, putBody.itemSpecs)
      .input("NewAssetCode", sql.VarChar, putBody.newAssetCode)
      .input("AssetTagStatus", sql.Int, putBody.assetTagStatus)
      .input("ItemRemarks", sql.VarChar, putBody.itemRemarks)
      .input("OldAssetCode", sql.VarChar, putBody.oldAssetCode)
      .input("PhysicalLocation", sql.VarChar, putBody.physicalLocation)
      .input("Condemned", sql.Int, putBody.condemned)
      .input("Salvaged", sql.Int, putBody.salvaged)
      .input("ItemCode", sql.VarChar, putBody.itemCode)
      .input("ReceivingReport", sql.VarChar, putBody.receivingReport)
      .input("ItemId", sql.Int, putBody.itemId)
      .query(updateItem);

      const oldDeptCode = await oldDept.recordset[0].deptCode;
      const newDeptCode = await putBody.deptCode;

      await transaction.request()
      .input("UserCode", sql.VarChar, userCode)
      .input("ItemId", sql.Int, putBody.itemId)
      .input("Activity", sql.VarChar, 'U')
      .input("DeptFrom", sql.VarChar, oldDeptCode)
      .input("DeptTo", sql.VarChar, newDeptCode)
      .query(logString);

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

const deleteItem = async (id) => {
  const deleteOneItem = `
    UPDATE Assets
    SET
    Deleted = 'True'
    WHERE itemId = @id
  `;

  try {
    let pool = await sql.connect(config.sql);
    const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(deleteOneItem);

    return { item: result.recordset };
  } catch (error) {
    return error;
  }
}

module.exports = {
  item,
  update,
  deleteItem,
}
