'use strict'

const router = require('express').Router();
const ctrl = require('../controllers/transaction-controller');

router.get('/apis/transaction', ctrl.getAllFromUser);
router.get('/apis/transaction/:id', ctrl.getById);
router.post('/apis/transaction', ctrl.create);
router.put('/apis/transaction/:id', ctrl.update);
router.delete('/apis/transaction/:id', ctrl.remove);

module.exports = router;
