'use strict';

const express = require('express');
const itemListController = require('../controllers/itemListController');
const router = express.Router();
const validateToken = require('../helpers/validateToken');

router.get('/itemlist', validateToken.validate, itemListController.getList);
router.get('/itemlist/:id', validateToken.validate, itemListController.getItem);
router.put('/itemlist', validateToken.validate, itemListController.editItem);
router.delete('/itemlist/:id', validateToken.validate, itemListController.deleteItem);

module.exports = {
  routes: router
}