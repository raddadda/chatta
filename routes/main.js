const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain.js');
const clogin = require('../controller/Clogin.js');

router.get('/',controller.main);

router.get('/new',controller.newMain);

router.post('/signup',clogin.signUp)
router.post('/signIn',clogin.signIn)
router.post('/board',controller.boardPost)
router.post('/bookmark',controller.bookmarkPost)
router.post('/deleteUser',controller.deleteUser)
router.post('/deleteBoard',controller.deleteBoard)

module.exports = router;