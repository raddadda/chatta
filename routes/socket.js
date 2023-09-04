const constant = require('../common/constant');
const controller = require('../controller/Cmain');

module.exports = (io) => {
    const nameSpace = constant.nameSpace;
    nameSpace.forEach((name)=>{
        io.of(name).on('connection',(socket)=>{
            controller.connection(io, socket, name);
        })
    })
};
// controller에 정의 되어있는 nameSpace 배열을 가져와서
// 각 nameSpace로 서버를 여는데, 어떤 서버가 열렸는지 확인을 위해 name도 같이 전송
