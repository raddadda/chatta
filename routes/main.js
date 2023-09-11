const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain.js');
const cauth = require('../controller/Cauth.js')
const clogin = require('../controller/Clogin.js');
const cboard = require('../controller/Cboard.js');
const ckakao = require('../controller/Ckakao.js');
const cprofile = require('../controller/Cprofile.js');
const cprofileEdit = require('../controller/CprofileEdit.js');
const cchat = require('../controller/Cchat.js');

router.get('/', controller.main);
router.get('/login',controller.loginMain);
router.get('/new', controller.newMain);
router.get('/profile', cprofile.profile);
router.get('/profile/edit', cprofileEdit.profileUpdate);
router.get('/profile/edit/pw', cprofileEdit.pwUpdate)
router.get('/profile/edit/delete', cprofileEdit.profileDelete)
router.get('/findpw', cprofileEdit.findPw)

router.get('/mychat',controller.myChatMain);
router.get('/chat_room',cchat.chatRoomMain);
router.post('/load/roomlist',cchat.myChatRoomList);

router.get('/signup/kakao',ckakao.signUpKakao)
router.get('/oauth/kakao',ckakao.authKakao);
router.get('/kakao/leave',ckakao.logoutKakao);

router.post('/mail', cprofileEdit.findPwPost)
//router.get('/new/:userid',controller.newMain);

//boardlist
router.get('/post',cboard.boardList);
//boardCreate 생성
router.get('/post/new',cboard.create_board);
router.post('/post/new',cboard.create_board_post);
//boardEdit 생성
router.get('/post/edit',cboard.edit_board);
router.post('/post/edit',cboard.edit_board_post);
//boardDelete 삭제
router.delete('/post/delete', cboard.delete_board);
//board 조회
router.post('/post/findone',cboard.boarduser_findone);
router.post('/post/findall',cboard.boarduser_findall);
router.post('/post/findall/pagination', cboard.boarduser_findall_pagenation);

router.post('/chat/join',cchat.chatRoomJoin)


//router.post('/signup',clogin.signUp)


router.post('/profile/edit', cprofileEdit.profileUpdatePost)
router.post('/profile/edit/pw', cprofileEdit.pwUpdatePost)
router.post('/profile/edit/delete', cprofileEdit.profileDeletePost)
router.post('/findpw', cprofileEdit.findInfoPost )
router.post('/mail', cprofileEdit.findPwPost)


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

//회원가입(로그인과 분리)
router.get('/register',clogin.register)
router.post('/register',clogin.signUp)

//로그인
router.post('/login',clogin.signIn)
router.post('/logout',clogin.userLogOut)

module.exports = router;