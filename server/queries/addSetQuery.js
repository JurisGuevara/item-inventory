"use strict";
const config = require("../config");
const sql = require("mssql");

const insertSet = async (body) => {
  const setData = body.postSet;
  const itemsData = body.postItems;
  const userCode = body.userCode;

  const insertSetString = `
    INSERT INTO Sets (
      SetGenericName,
      SetDeptCode,
      SetCategoryCode,
      SetCost,
      SetDateReceived,
      SetSupplierName,
      SetPurchaseOrderNo,
      SetInvoiceNo,
      SetItemSpecs,
      SetRemarks,
      ReceivingReport
    ) VALUES (
      @setGenericName,
      @setDeptCode,
      @setCategoryCode,
      @setCost,
      @setDateReceived,
      @setSupplierName,
      @setPurchaseOrderNo,
      @setInvoiceNo,
      @setItemSpecs,
      @setRemarks,
      @receivingReport
    )
  `;

  const insertItemString = `
    INSERT INTO Assets (
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
    ) VALUES (
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
    )
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
      const setResult = await transaction.request()
      .input("SetGenericName", sql.VarChar, setData.setGenericName)
      .input("SetDeptCode", sql.VarChar, setData.setDeptCode)
      .input("SetCategoryCode", sql.VarChar, setData.setCategoryCode)
      .input("SetCost", sql.Float, setData.setCost)
      .input("SetDateReceived", sql.Date, setData.setDateReceived)
      .input("SetSupplierName", sql.VarChar, setData.setSupplierName)
      .input("SetPurchaseOrderNo", sql.VarChar, setData.setPurchaseOrderNo)
      .input("SetInvoiceNo", sql.VarChar, setData.setInvoiceNo)
      .input("SetItemSpecs", sql.VarChar, setData.setItemSpecs)
      .input("SetRemarks", sql.VarChar, setData.setRemarks)
      .input("ReceivingReport", sql.VarChar, setData.receivingReport)
      .query(insertSetString);

      const newPrimKey = await transaction.request()
      .query`SELECT TOP 1 SETID as setId FROM Sets ORDER BY SETID DESC`;

      for (const item of itemsData) {
        await transaction.request()
        .input("GenericName", sql.VarChar, item.genericName)
        .input("DeptCode", sql.VarChar, setData.setDeptCode)
        .input("CategoryCode", sql.VarChar, setData.setCategoryCode)
        .input("UnitCost", sql.Float, item.unitCost)
        .input("SetNo", sql.Int, newPrimKey.recordset[0].setId)
        .input("DateReceived", sql.Date, setData.setDateReceived)
        .input("SupplierName", sql.VarChar, setData.setSupplierName)
        .input("PurchaseOrderNo", sql.VarChar, setData.setPurchaseOrderNo)
        .input("InvoiceNo", sql.VarChar, setData.setInvoiceNo)
        .input("BrandName", sql.VarChar, item.brandName)
        .input("BrandModel", sql.VarChar, item.brandModel)
        .input("SerialNo", sql.VarChar, item.serialNo)
        .input("ItemSpecs", sql.VarChar, item.itemSpecs)
        .input("NewAssetCode", sql.VarChar, item.newAssetCode)
        .input("AssetTagStatus", sql.Int, item.assetTagStatus)
        .input("ItemRemarks", sql.VarChar, item.itemRemarks)
        .input("OldAssetCode", sql.VarChar, item.oldAssetCode)
        .input("PhysicalLocation", sql.VarChar, item.physicalLocation)
        .input("ItemCode", sql.VarChar, setData.itemCode)
        .input("ReceivingReport", sql.VarChar, setData.receivingReport)
        .query(insertItemString);

        const newItemId = await transaction.request()
        .query`SELECT TOP 1 ItemId as itemId FROM Assets ORDER BY ItemId DESC`;
        const itemRowObj = await newItemId.recordset;

        const logsRows = await transaction.request()
        .input("UserCode", sql.VarChar, userCode)
        .input("ItemId", sql.Int, itemRowObj[0].itemId)
        .input("Activity", sql.VarChar, 'C')
        .input("DeptFrom", sql.VarChar, null)
        .input("DeptTo", sql.VarChar, setData.setDeptCode)
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
};

module.exports = {
  insertSet,
};
