'use strict';

const express = require('express');
const addSetController = require('../controllers/addSetController');
const router = express.Router();
const validateToken = require('../helpers/validateToken');

router.post('/addset', validateToken.validate, addSetController.addset);

module.exports = {
  routes: router
}