//게시판 생성
async function boardCreate(){
    const boardForm = document.forms["board-form"];
    if ( boardForm.title.value === "" ) return alert('제목을 확인해주세요.');
    if ( boardForm.content.value === "" ) return alert('내용을 확인해주세요.');
    if ( boardForm.eventDate.value === "" ) return alert('흥보시간 확인해주세요.');
    if ( boardForm.category.value === "" ) return alert('카텔고리를 확인해주세요.');
    
    try {
        const data = {
            title:boardForm.title.value,
            content:boardForm.content.value,
            event_time:boardForm.eventDate.value,
            bord_category:boardForm.category.value
        }
        const res = await axios({
            method:"post",
            url:"/post/new",
            data,
        })
        if(res.data.result){
            alert("등록 되었습니다.");
            window.location.href = "/";
        }else{
            alert("다시 시도해주세요.");
        }
        
        console.log("result",res.result);
    } catch (error) {
        alert("잠시 후에 시도해주세요.");
        console.log(error);
    }
}

//게시판 수정
async function boardEdit() {

    const boardForm = document.forms["board-form"];
    try {
        const data = {
            id : 5,
            title:boardForm.title.value,
            content:boardForm.content.value,
            event_time:boardForm.eventDate.value,
            bord_category:boardForm.category.value
        }
        const res = await axios({
            method:"post",
            url:"/post/edit",
            data,
        })
        if(res.data.result){
            alert("수정이 완료되었습니다.");
            window.location.reload();
        }else{
            alert("다시 시도해주세요.");
        }
    } catch(error) {
        alert("잠시후 다시 시도해주세요.");
        console.log(error);
    }
}
//게시판 삭제
  async function boardDelete () {

    if(!confirm('정말로 삭제하시겠습니까?')) return;
    try{
        const deleteRes = await axios({
        method:"DELETE",
        url:"/post/delete",
        data: {
            id: 5
        }
    })
        if (deleteRes.result) {
            alert('삭제가 완료되었습니다.')
        }else{
            alert("다시 시도해주세요.");
        }
    }catch(error){
        alert("다시 시도해주세요.");
    }
    
}

//게시판 조회
async function boradFindAll(offset){
    console.log("offset 확인",offset);
    const res = await axios({
        method: "POST",
        url:"/post/findall",
        data: {
            offset:offset
        }
    })
    
    if (res.data.result){
        return res.data.board;
    } else{
        console.log('res',res);
        return [];
    }
}

async function boradFindAll_pagination(page_id){

    if (page_id === undefined || page_id === null) return console.log('page_id이 없음');
    const res = await axios({
        method: "POST",
        url:"/post/findall/pagination",
        data: {
            page_id
        }
    })
    
    if (res.data.result){
        return res.data.board;
    } else{
        console.log('res',res);
        return [];
    }
}
