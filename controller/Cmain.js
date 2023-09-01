const main = (req,res)=>{
    res.render('index');
}

const newMain = (req,res)=>{
    res.render('new');
}

module.exports = {
    main,
    newMain,
}