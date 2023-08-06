'use strict';
const addSetQuery = require('../queries/addSetQuery');

const addset = async (req, res, next) => {
  const body = req.body;
  const user = req.user;

  let postSet;
  let postItems;
  let userCode;
  let userRights;

  // validate request
  if(Object.hasOwn(user, 'rights') && Object.hasOwn(user, 'code') && Object.hasOwn(body, 'postSet') && Object.hasOwn(body, 'postItems')) {
    postSet = body.postSet;
    postItems = body.postItems;
    userCode = user.code;
    userRights = user.rights;
  } else {
    return;
  }

  const vBody = { postSet, postItems, userCode, userRights };

  try {

    const data = await addSetQuery.insertSet(vBody);
    if (data) {
      res.status(200).json('');
    } else {
      res.status(400).json('');
    }

  } catch (error) {
    res.status(400).json('');
  }
}

module.exports = {
  addset,
}