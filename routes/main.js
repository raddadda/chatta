const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain.js');
const clogin = require('../controller/Clogin.js');
const cprofile = require('../controller/Cprofile.js');

router.get('/', controller.main);
router.get('/profile', cprofile.profile);
router.get('/new', controller.newMain);

<<<<<<< HEAD

router.post('/signup', clogin.signUp)
router.post('/signIn', clogin.signIn)
router.post('/board', controller.boardPost)
router.post('/bookmark', controller.bookmarkPost)
router.post('/deleteUser', controller.deleteUser)
router.post('/deleteBoard', controller.deleteBoard)
router.post('/profile/edit', cprofile.editProfile)
router.post('/deleteUser', cprofile.deleteProfile)

=======
router.get('/new/:userid',controller.newMain);

router.post('/signup',clogin.signUp)
router.post('/signIn',clogin.signIn)

router.post('/board',controller.boardPost)
router.post('/bookmark',controller.bookmarkPost)
router.post('/friendlist',controller.friendListPost)
router.post('/chatroom',controller.chatRoomPost)
router.post('/chatroomjoin',controller.chatRoomJoinPost)
router.post('/chatmessage',controller.chatMessagePost)


router.post('/delete/user',controller.deleteUser)
router.post('/delete/board',controller.deleteBoard)
router.post('/delete/friend',controller.deleteFriend)
router.post('/delete/chatroom',controller.deleteChatRoom)
router.post('/delete/chatroomjoin',controller.deleteChatRoomJoin)
router.post('/delete/chatmessage',controller.deleteChatMessage)
>>>>>>> ea8abdb8d33b78168fa03634e06f82716d007db4

module.exports = router;