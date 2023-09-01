const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain.js');

router.get('/',controller.main);

router.get('/new',controller.newMain);

module.exports = router;