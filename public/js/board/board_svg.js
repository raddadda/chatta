
async function bookMarkToggle (id,book_mark) {
    console.log('id', id, 'book_mark', book_mark);
    const bookmarkDom = document.querySelector('#boardDetailModal > .board-detail-contents >  .bd-info > .bd-book_mark > svg > g');
    console.log(bookmarkDom.style.fill);
    if (bookmarkDom.style.fill  === 'rgb(245, 205, 0)') {
        try {
            const data = {
                book_chk : book_mark,
                id
            }
            console.log("book_mark",book_mark);
            const res = await axios({
                method:"post",
                url:"post/deletebookmark",
                data,
            })
            console.log(" book_chk : book_mark",data);
            if(res.data.result){
                alert("북마크가 취소 되었습니다.");
            }else{
                alert("북마크 취소를 다시 시도해주세요.");
            }
            
            console.log("result",res.result);
        } catch (error) {
            alert("북마크 취소를 잠시 후에 시도해주세요.");
            console.log(error);
        }
        bookmarkDom.style.fill = '#eee';
    } else {
        try {
            const data = {
                book_chk : book_mark,
                id
            }
            console.log("book_mark",book_mark);
            
            
            const res = await axios({
                method:"post",
                url:"post/newbookmark",
                data,
            })
                
         
            console.log(" book_chk : book_mark",data);
            console.log("result",res.data.result);
            if(res.data.result){
                
                
                alert("북마크가 등록 되었습니다.");
             
            }else{
                alert("북마크 등록을 다시 시도해주세요.");
            }
            
            
        } catch (error) {
            alert("북마크 등록을 잠시 후에 시도해주세요.");
            console.log(error);
        }
        bookmarkDom.style.fill = '#f5cd00';
    }
    


    
}