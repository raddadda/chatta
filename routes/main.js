const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain.js');
const clogin = require('../controller/Clogin.js');
const cprofile = require('../controller/Cprofile.js');

router.get('/', controller.main);
router.get('/profile', cprofile.profile);
router.get('/new', controller.newMain);


router.post('/signup', clogin.signUp)
router.post('/signIn', clogin.signIn)
router.post('/board', controller.boardPost)
router.post('/bookmark', controller.bookmarkPost)
router.post('/deleteUser', controller.deleteUser)
router.post('/deleteBoard', controller.deleteBoard)
router.post('/profile/edit', cprofile.editProfile)
router.post('/deleteUser', cprofile.deleteProfile)


module.exports = router;