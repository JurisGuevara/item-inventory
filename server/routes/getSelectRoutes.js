'use strict';

const express = require('express');
const getSelectController = require('../controllers/getSelectController');
const router = express.Router();
const validateToken = require('../helpers/validateToken');

router.get('/getDept', validateToken.validate, getSelectController.getDept);
router.get('/getCategory', validateToken.validate, getSelectController.getCategory);
router.get('/getSetNo', validateToken.validate, getSelectController.getSetNo);

module.exports = {
  routes: router
}