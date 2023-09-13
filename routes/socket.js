const constant = require('../common/constant');
const Csocket = require('../controller/Csocket');

module.exports = (io) => {
    const nameSpace = constant.nameSpace;
    nameSpace.forEach((e) => {
        const nameIo = io.of(e.name);
        nameIo.on('connection',(socket) => {
            Csocket.systemSocket(nameIo,socket);
            e.func(nameIo,socket);
        })
    })
};
// controller에 정의 되어있는 nameSpace 배열을 가져와서
// 각 nameSpace로 서버를 여는데, 어떤 서버가 열렸는지 확인을 위해 name도 같이 전송
