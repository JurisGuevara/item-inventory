'use strict';
const itemListQuery = require('../queries/itemListQuery');
const itemQuery = require('../queries/itemQuery');

const getList = async (req, res, next) => {
  const user = req.user;
  const query = req.query;
  let userRights;

  // validate request
  if(Object.hasOwn(user, 'rights') && Object.hasOwn(user, 'code')) {
    userRights = user.rights;
  } else {
    return;
  }

  try {

    const data = await itemListQuery.list(query);
    res.status(200).json(data);

  } catch (error) {
    res.status(400).json('');
  }
}

const getItem = async (req, res, next) => {
  const user = req.user;

  let userRights;
  let id;

  // validate request
  if(Object.hasOwn(user, 'rights') && Object.hasOwn(user, 'code') && req.params.id) {
    userRights = user.rights;
    id = req.params.id;
  } else {
    return;
  }

  try {

    const data = await itemQuery.item(id);

    if(data.length === 0) {
      return;
    } else {
      res.status(200).json(data);
    }

  } catch (error) {
    res.status(400).json('');
  }
}

const editItem = async (req, res, next) => {

  const user = req.user;
  const body = req.body;

  let userCode;
  let userRights;
  let putBody;

  // validate request
  if(Object.hasOwn(user, 'rights') && Object.hasOwn(user, 'code') && Object.hasOwn(body, 'putBody')) {
    userCode = user.code;
    userRights = user.rights;
    putBody = req.body.putBody;
  } else {
    return;
  }

  try {

    const data = await itemQuery.update(userCode, putBody);

    if(data) {
      res.status(200).json('');
    } else {
      res.status(400).json('');
    }

  } catch (error) {
    res.status(400).json('');
  }
}

const deleteItem = async (req, res, next) => {

  const user = req.user;

  let userRights;
  let id;

  // validate request
  if(Object.hasOwn(user, 'rights') && Object.hasOwn(user, 'code') && req.params.id) {
    userRights = user.rights;
    id = req.params.id;
  } else {
    return;
  }

  if(!userRights.includes('D')) {
    return;
  }

  try {

    const data = await itemQuery.deleteItem(id);
    res.status(200).json('');

  } catch (error) {
    res.status(400).json('');
  }
}

module.exports = {
  getList,
  getItem,
  editItem,
  deleteItem,
}