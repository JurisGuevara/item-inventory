'use strict';
const loginQuery = require('../queries/loginQuery');
const md5 = require('md5');

const login = async (req, res, next) => {
  const body = req.body;
  let code;
  let password;
  let mdPassword;

  if(Object.hasOwn(body, 'username') && Object.hasOwn(body, 'password')) {
    code = body.username;
    password = body.password;
    mdPassword = md5(password);
  } else {
    return;
  }

  try {
    const userCode = await loginQuery.userAccess(code);

    if(userCode.length === 1) {
      const authorize = await loginQuery.verifyAccess(code, mdPassword)

      if(authorize.length === 1) {
        const aRights = await userCode[0].Rights

        const token = await loginQuery.createToken({
          code: code,
          rights: aRights,
        });
        res.status(200).json({ token });
      } else {
        res.status(400).json('');
      }
    } else {
      res.status(400).json('');
    }
  } catch (error) {
    res.status(400).json('');
  }

}

module.exports = {
  login,
}