'use strict'

const router = require('express').Router();
const ctrl = require('../controllers/remove-controller');

router.get('/remove', ctrl.getContract);
router.delete('/remove/:equipment/:type/:key', ctrl.remove);

module.exports = router;
