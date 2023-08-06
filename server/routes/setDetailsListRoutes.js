'use strict';

const express = require('express');
const setListController = require('../controllers/setDetailsListController');
const router = express.Router();
const validateToken = require('../helpers/validateToken');

router.get('/setdetailslist', validateToken.validate, setListController.getSetList);
router.get('/setdetailslist/:id', validateToken.validate, setListController.getSet);
router.put('/setdetailslist', validateToken.validate, setListController.editSet);

module.exports = {
  routes: router
}