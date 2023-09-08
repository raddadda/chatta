const socket1 = io();
const socket2 = io();
// 네임 스페이스 '/'의 경우에는 생략가능 (링크 개념이라)
// 이렇게 소켓을 여러개 가져와 쓸 수도 있는 것 같다
console.log("socket1", socket1);
console.log("socket2", socket2);
socket1.emit('userLog')