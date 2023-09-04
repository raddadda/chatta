const main = (req,res)=>{
    res.render('index');
}

const newMain = (req,res)=>{
    res.render('new');
}

const connection = (io,socket,loc)=>{
    socket.on('userLog',()=>{
        console.log(`${loc}접속`)
    })
}


module.exports = {
    main,
    newMain,
    connection,
}