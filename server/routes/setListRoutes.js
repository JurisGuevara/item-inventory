'use strict';

const express = require('express');
const setListController = require('../controllers/setListController');
const router = express.Router();
const validateToken = require('../helpers/validateToken');

router.get('/setlist', validateToken.validate, setListController.getSetList);
router.get('/setlist/:id', validateToken.validate, setListController.getSet);
router.put('/setlist', validateToken.validate, setListController.editSet);

module.exports = {
  routes: router
}