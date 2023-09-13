async function post_bookmark(id){

    try {
        const findOneData = await bookMark_FindOne(id);

        return findOneData

    } catch(e) {

        return false;
     
    }
}

async function bookMarkToggle (index) {

    const bookmarkDom = document.querySelector('#boardDetailModal > .board-detail-contents >  .bd-info > .bd-book_mark > svg > g');

    if (list[index].book_mark === true) { // 북마크 삭제 할 때

        const result =  await bookMark_delete(list[index].id,list[index].views);

        if (result) {
            list[index].book_mark = false;
            list[index].views -=1;
            bookmarkDom.style.fill = '#eee';
        } else {

            alert('잠시 후에 사용해 주세요.');
        } 

    } else if (list[index].book_mark === false) { // 북마크 생성할 때

        const result =  await bookMark_create(list[index].id,list[index].views);

        if (result) {
            list[index].book_mark = true;
            list[index].views +=1;
            bookmarkDom.style.fill = '#f5cd00';
        } else {

            alert('잠시 후에 사용해 주세요.');
        } 
    }
}