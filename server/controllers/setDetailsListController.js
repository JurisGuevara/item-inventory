'use strict';
const setListQuery = require('../queries/setDetailsListQuery');
const setQuery = require('../queries/setQuery');

const getSetList = async (req, res, next) => {
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

    const data = await setListQuery.list(query);
    res.status(200).json(data);

  } catch (error) {
    res.status(400).json('');
  }
}

const getSet = async (req, res, next) => {
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

    const data = await setQuery.set(id);

    if(data.length === 0) {
      return;
    } else {
      res.status(200).json(data);
    }

  } catch (error) {
    res.status(400).json('');
  }
}

const editSet = async (req, res, next) => {
  const user = req.user;
  const body = req.body;

  let userCode;
  let userRights;
  let putSet;
  let putItems;

  // validate request
  if(Object.hasOwn(user, 'rights') && Object.hasOwn(user, 'code') && Object.hasOwn(body, 'putSet') && Object.hasOwn(body, 'putItems')) {
    userCode = user.code;
    userRights = user.rights;
    putSet = req.body.putSet;
    putItems = req.body.putItems;
  } else {
    return;
  }

  try {

    const data = await setQuery.update(userCode, putSet, putItems);

    if(data) {
      res.status(200).json('');
    } else {
      res.status(400).json('');
    }

  } catch (error) {
    res.status(400).json('');
  }
}

module.exports = {
  getSetList,
  getSet,
  editSet,
}