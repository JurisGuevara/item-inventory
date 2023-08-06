'use strict';
const config = require('../config');
const sql = require('mssql');

const set = async (id) => {

  const queryStringSet = `
    SELECT
    setId,
    setGenericName,
    setDeptCode,
    setCategoryCode,
    setCost,
    setDateReceived,
    setSupplierName,
    setPurchaseOrderNo,
    setInvoiceNo,
    setItemSpecs,
    setRemarks,
    receivingReport,
    condemned,
    salvaged
    FROM Sets
    WHERE SetId = @id
    AND Deleted = 0
  `;

  const queryStringItemList = `
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
    itemCode,
    receivingReport,
    condemned,
    salvaged
    FROM Assets
    WHERE SetNo = @id
    AND Deleted = 0
  `;

  const getItemHistory = `
    SELECT
    Logs.Id as historyId,
    Logs.UserCode as authorCode,
    Users.FULLNAME as authorName,
    Activity.ActDesc as activity,
    d1.DeptName as deptFrom,
    d2.DeptName as deptTo,
    Logs.ServerLog as date,
    Logs.ServerLog as time
    FROM Logs
    LEFT JOIN Users ON Users.CODE COLLATE Latin1_General_CS_AS=Logs.UserCode
    LEFT JOIN Activity ON Activity.ActCode=Logs.Activity
    LEFT JOIN Department d1 ON d1.DeptCode=Logs.DeptFrom
    LEFT JOIN Department d2 ON d2.DeptCode=Logs.DeptTo
    WHERE ItemId=@itemId
    AND DeptFrom != DeptTo
  `;

  try {
    let pool = await sql.connect(config.sql);
    const setResults = await pool
    .request()
    .input("id", sql.Int, id)
    .query(queryStringSet);

    const itemListResults = await pool
    .request()
    .input("id", sql.Int, id)
    .query(queryStringItemList);

    const itemListRecSet = await itemListResults.recordset;
    const itemListLength = await itemListResults.rowsAffected[0];
    let itemList = [];

    for (let i = 0; i < itemListLength; i++) {
      const item = itemListRecSet[i]
      item.itemHistory = [];
      const history = await pool
      .request()
      .input("ItemId", sql.Int, item.itemId)
      .query(getItemHistory);

      const historyRecord = await history.recordset;
      const historyLength = await history.rowsAffected[0];

      for (let j = 0; j < historyLength; j++) {
        item.itemHistory[j] = await historyRecord[j];
      }

      itemList[i] = await item;
    }

    return { set: setResults.recordset, items: itemList }

  } catch (error) {
    return error;
  }
}

const update = async (user, set, items) => {
  const userCode = user;
  const putSet = set;
  const putItems = items;

  const setQueryString = `
    UPDATE Sets
    SET
    SetGenericName = @setGenericName,
    SetDeptCode = @setDeptCode,
    SetCategoryCode = @setCategoryCode,
    SetCost = @setCost,
    SetDateReceived = @setDateReceived,
    SetSupplierName = @setSupplierName,
    SetPurchaseOrderNo = @setPurchaseOrderNo,
    SetInvoiceNo = @setInvoiceNo,
    SetItemSpecs = @setItemSpecs,
    SetRemarks = @setRemarks,
    Condemned = @condemned,
    Salvaged = @salvaged,
    ReceivingReport = @receivingReport
    WHERE SetId = @setId
  `;

  const itemQueryString = `
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
      const setResults  = await transaction
      .request()
      .input("SetGenericName", sql.VarChar, putSet.setGenericName)
      .input("SetDeptCode", sql.VarChar, putSet.setDeptCode)
      .input("SetCategoryCode", sql.VarChar, putSet.setCategoryCode)
      .input("SetCost", sql.Float, putSet.setCost)
      .input("SetDateReceived", sql.Date, putSet.setDateReceived)
      .input("SetSupplierName", sql.VarChar, putSet.setSupplierName)
      .input("SetPurchaseOrderNo", sql.VarChar, putSet.setPurchaseOrderNo)
      .input("SetInvoiceNo", sql.VarChar, putSet.setInvoiceNo)
      .input("SetItemSpecs", sql.VarChar, putSet.setItemSpecs)
      .input("SetRemarks", sql.VarChar, putSet.setRemarks)
      .input("Condemned", sql.Int, putSet.condemned)
      .input("Salvaged", sql.Int, putSet.salvaged)
      .input("ReceivingReport", sql.VarChar, putSet.receivingReport)
      .input("SetId", sql.Int, putSet.setId)
      .query(setQueryString);

      for (const item of putItems) {
        const oldDept = await transaction.request()
        .query(`SELECT DeptCode as deptCode FROM Assets WHERE ItemId = ${item.itemId}`);

        await transaction
        .request()
        .input("GenericName", sql.VarChar, item.genericName)
        .input("DeptCode", sql.VarChar, item.deptCode)
        .input("CategoryCode", sql.VarChar, item.categoryCode)
        .input("UnitCost", sql.Float, item.unitCost)
        .input("SetNo", sql.Int, item.setNo)
        .input("DateReceived", sql.Date, item.dateReceived)
        .input("SupplierName", sql.VarChar, item.supplierName)
        .input("PurchaseOrderNo", sql.VarChar, item.purchaseOrderNo)
        .input("InvoiceNo", sql.VarChar, item.invoiceNo)
        .input("BrandName", sql.VarChar, item.brandName)
        .input("BrandModel", sql.VarChar, item.brandModel)
        .input("SerialNo", sql.VarChar, item.serialNo)
        .input("ItemSpecs", sql.VarChar, item.itemSpecs)
        .input("NewAssetCode", sql.VarChar, item.newAssetCode)
        .input("AssetTagStatus", sql.Int, item.assetTagStatus)
        .input("ItemRemarks", sql.VarChar, item.itemRemarks)
        .input("OldAssetCode", sql.VarChar, item.oldAssetCode)
        .input("PhysicalLocation", sql.VarChar, item.physicalLocation)
        .input("Condemned", sql.Int, item.condemned)
        .input("Salvaged", sql.Int, item.salvaged)
        .input("ItemCode", sql.VarChar, item.itemCode)
        .input("ReceivingReport", sql.VarChar, item.receivingReport)
        .input("ItemId", sql.Int, item.itemId)
        .query(itemQueryString);

        const oldDeptCode = await oldDept.recordset[0].deptCode;
        const newDeptCode = await item.deptCode;

        await transaction.request()
        .input("UserCode", sql.VarChar, userCode)
        .input("ItemId", sql.Int, item.itemId)
        .input("Activity", sql.VarChar, 'U')
        .input("DeptFrom", sql.VarChar, oldDeptCode)
        .input("DeptTo", sql.VarChar, newDeptCode)
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
  set,
  update,
}
