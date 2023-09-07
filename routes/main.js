const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain.js');
const cauth = require('../controller/Cauth.js')
const clogin = require('../controller/Clogin.js');
const cboard = require('../controller/Cboard.js');
const ckakao = require('../controller/Ckakako.js');
const cprofile = require('../controller/Cprofile.js');
const cprofileEdit = require('../controller/CprofileEdit.js')

router.get('/', controller.main);
router.get('/new', controller.newMain);
router.get('/profile', cprofile.profile);
router.get('/profile/edit', cprofileEdit.profileUpdate);
router.get('/profile/edit/pw', cprofileEdit.pwUpdate)
router.get('/profile/edit/delete', cprofileEdit.profileDelete)

router.get('/signup/kakao',ckakao.signUpKakao)
router.get('/oauth/kakao',ckakao.authKakao);
router.get('/kakao/leave',ckakao.logoutKakao);

router.get('/chat',controller.chatMain);

//router.get('/new/:userid',controller.newMain);

router.get('/new',cboard.newMain);
router.post('/new/post',cboard.boardPost);
router.delete('/new/delete', cboard.boardDelete);
router.post('/new/edit/post',cboard.boarduser_findone)
router.post('/new/findall',cboard.boarduser_findall)

router.get('/new/edit',cboard.newEdit);
router.post('/new/edit',cboard.boardEdit);


router.post('/signup',clogin.signUp)
router.post('/signin',clogin.signIn)
router.post('/logout',clogin.userLogOut)

router.post('/profile/edit', cprofileEdit.profileUpdatePost)
router.post('/profile/edit/pw', cprofileEdit.pwUpdatePost)
router.post('/profile/edit/delete', cprofileEdit.profileDeletePost)


router.post('/bookmark',controller.bookmarkPost)
router.post('/friendlist',controller.friendListPost)
router.post('/chatroom',controller.chatRoomPost)
router.post('/chatroomjoin',controller.chatRoomJoinPost)
router.post('/chatmessage',controller.chatMessagePost)
router.post('/auth',cauth.authCheckPost);


router.post('/delete/user',controller.deleteUser)
router.post('/delete/board',controller.deleteBoard)
router.post('/delete/friend',controller.deleteFriend)
router.post('/delete/chatroom',controller.deleteChatRoom)
router.post('/delete/chatroomjoin',controller.deleteChatRoomJoin)
router.post('/delete/chatmessage',controller.deleteChatMessage)

module.exports = router;