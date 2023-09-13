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
const cimage = require('../controller/Cimage.js');

/////////////////////////////메인 페이지////////////////////////////

///////////get//////////////

router.get('/', controller.main);
// 메인 페이지 열기



/////////////////////////////로그인 페이지////////////////////////////

///////////get//////////////

router.get('/login', controller.loginMain);
// 로그인 페이지 열기

router.get('/oauth/kakao', ckakao.authKakao);
// 카카오 로그인 페이지 열기

router.get('/kakao/leave', ckakao.logoutKakao);
// 카카오 로그아웃 페이지 열기 (사실상 로그아웃 실행)



///////////post//////////////

router.post('/login', clogin.signIn)
// 데이터 베이스 정보를 확인해 로그인 처리하는 함수

router.post('/logout', clogin.userLogOut)
// 쿠키 정보를 지워서 로그아웃 처리하는 함수



/////////////////////////////회원가입 페이지////////////////////////////

///////////get//////////////

router.get('/register', clogin.register)
// 회원가입 페이지 열기

router.get('/signup/kakao', ckakao.signUpKakao)
// 카카오 회원가입 페이지 열기



///////////post//////////////

router.post('/register', clogin.signUp)
// 회원가입 정보를 데이터베이스에 추가하는 함수



/////////////////////////////프로필 페이지////////////////////////////

///////////get//////////////

router.get('/profile', cprofile.profile);
// 프로필 페이지 열기

router.get('/profile/edit', cprofileEdit.profileUpdate);
// 프로필 수정 페이지 열기

router.get('/profile/edit/pw', cprofileEdit.pwUpdate);
// 비밀번호 변경 페이지 열기

router.get('/findpw', cprofileEdit.findPw)
// 비밀번호 찾기 페이지 열기

router.get('/profile/edit/delete', cprofileEdit.profileDelete)
// 프로필 삭제 페이지 열기




///////////post//////////////

router.post('/mail', cprofileEdit.findPwPost)
// 비밀번호 찾기 메시지를 보내는 함수 (왜 필요한지 확인)

router.post('/profile/edit', cprofileEdit.profileUpdatePost)

router.post('/profile/edit/pw', cprofileEdit.pwUpdatePost)

router.post('/profile/edit/delete', cprofileEdit.profileDeletePost)

router.post('/profile/edit/upload', cprofileEdit.uploadProfileImage, cprofileEdit.handleUploadedProfileImage);

router.post('/findpw', cprofileEdit.findInfoPost)




/////////////////////////////게시판 페이지////////////////////////////

///////////get//////////////

router.get('/post/new',cboard.create_board);
// 게시판 작성 페이지 열기

router.get('/post/edit/:id',cboard.edit_board);
// 게시판 수정 페이지 열기



///////////post//////////////

router.post('/post/new',cboard.create_board_post);
// 게시판 정보를 받아서 데이터베이스에 게시판과 채팅방 정보 추가

router.post('/post/edit',cboard.edit_board_post);
// 수정된 게시판 정보를 데이터베이스에 최신화하는 함수

router.post('/post/findone', cboard.boarduser_findone);
// 데이터베이스에서 게시판 하나 조회하는 함수

router.post('/post/findall', cboard.boarduser_findall);
// 데이터베이스에서 게시판 전체를 조회하는 함수

router.post('/post/findall/pagination', cboard.boarduser_findall_pagenation);
// 아몰랑

router.post('/post/findonebookmark', cboard.findone_board_bookmark);

router.post('/post/newbookmark',cboard.create_board_bookmark);

router.post('/post/deletebookmark',cboard.delete_board_bookmark);

router.post('/chat/join',cchat.chatRoomJoin);
// 내가 참여한 채팅방 목록에 추가하는 함수



///////////delete//////////////

router.delete('/post/delete', cboard.delete_board);
// 데이터베이스에서 게시판을 삭제하는 함수




/////////////////////////////채팅방 페이지////////////////////////////

///////////get//////////////

router.get('/mychat', controller.myChatMain);
// 내가 참여한 채팅방 목록 페이지 열기

router.get('/chat_room', cchat.chatRoomMain);
// 채팅방 페이지 열기



///////////post//////////////

router.post('/load/roomlist', cchat.myChatRoomList);
// 내가 참여한 채팅방 목록을 axios로 불러오는 함수

router.post('/member/load',cchat.memberLoad)
// 같은 채팅방에 참여하고 있는 멤버 정보를 불러오는 함수

router.post('/msg/load',cchat.msgLoad)
// 내가 참여해있는 채팅방의 메시지를 데이터베이스에서 불러오는 함수

router.post('/msg/send',cchat.msgSend)
// 내가 입력한 메시지를 데이터베이스에 추가하는 함수



/////////////////////////////기타 (모름)////////////////////////////
router.get('/s3/:filename', cimage.getS3ImageURL);



module.exports = router;