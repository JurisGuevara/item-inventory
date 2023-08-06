'use strict';
const addItemQuery = require('../queries/addItemQuery');

const addItem = async (req, res, next) => {
  const body = req.body;
  const user = req.user;

  let postBody;
  let userCode;
  let userRights;

  // validate request
  if(Object.hasOwn(user, 'rights') && Object.hasOwn(user, 'code') && Object.hasOwn(body, 'postObject')) {
    userRights = user.rights;
    userCode = user.code;
    postBody = body.postObject;
  } else {
    return;
  }

  try {

    const data = await addItemQuery.insertItem(postBody, userCode);

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
  addItem,
}