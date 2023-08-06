'use strict';

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const {SECRET_KEY} = process.env;

const validate = async (req, res, next) => {
  const bearerHeader = await req.headers.authorization;

  if(typeof bearerHeader !== 'undefined') {
    const bearerToken = await bearerHeader.split(' ');
    const token = await bearerToken[1]

    jwt.verify(token, SECRET_KEY, async (err, user) => {
      if(err){
        res.status(400).json('');
      } else {
        req.user = { code: user.user.code, rights: user.user.rights };
        next();
      }
    });
  } else {
    res.status(400).json('');
  }
}

module.exports = {
  validate,
}