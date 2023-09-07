const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain.js');
const cauth = require('../controller/Cauth.js')
const clogin = require('../controller/Clogin.js');
const cboard = require('../controller/Cboard.js');

const cprofile = require('../controller/Cprofile.js');
const cprofileEdit = require('../controller/CprofileEdit.js')

router.get('/', controller.main);
router.get('/new', controller.newMain);
router.get('/profile', cprofile.profile);
router.get('/profile/edit', cprofileEdit.profileUpdate);
router.get('/profile/edit/pw', cprofileEdit.pwUpdate)
router.get('/profile/edit/delete', cprofileEdit.profileDelete)

router.get('/signup/kakao',clogin.signUpKakao)
router.get('/oauth/kakao',clogin.authKakao);
router.get('/kakao/leave',clogin.logoutKakao);

router.get('/chat',controller.chatMain);

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
router.post('/post/findone',cboard.boarduser_findone)
router.post('/post/findall',cboard.boarduser_findall)



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