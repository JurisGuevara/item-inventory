'use strict';
const getSelectQuery = require('../queries/getSelectQuery');

const getDept = async (req, res, next) => {

  const user = req.user;

  let userCode;
  let userRights;

  // validate request
  if(Object.hasOwn(user, 'rights') && Object.hasOwn(user, 'code')) {
    userRights = user.rights;
    userCode = user.code;
  } else {
    return;
  }

  try {

    const data = await getSelectQuery.deptList();

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json('');
    }

  } catch (error) {
    res.status(400).json('');
  }
}

const getCategory = async (req, res, next) => {

  const user = req.user;

  let userCode;
  let userRights;

  // validate request
  if(Object.hasOwn(user, 'rights') && Object.hasOwn(user, 'code')) {
    userRights = user.rights;
    userCode = user.code;
  } else {
    return;
  }

  try {

    const data = await getSelectQuery.categoryList();

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json('');
    }

  } catch (error) {
    res.status(400).json('');
  }
}

const getSetNo = async (req, res, next) => {

  const user = req.user;

  let userCode;
  let userRights;

  // validate request
  if(Object.hasOwn(user, 'rights') && Object.hasOwn(user, 'code')) {
    userRights = user.rights;
    userCode = user.code;
  } else {
    return;
  }

  try {

    const data = await getSelectQuery.setNoList();

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json('');
    }

  } catch (error) {
    res.status(400).json('');
  }
}

module.exports = {
  getDept,
  getCategory,
  getSetNo,
}