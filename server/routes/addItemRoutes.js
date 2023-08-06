'use strict';

const express = require('express');
const addItemController = require('../controllers/addItemController');
const router = express.Router();
const validateToken = require('../helpers/validateToken');

router.post('/additem', validateToken.validate, addItemController.addItem);

module.exports = {
  routes: router
}