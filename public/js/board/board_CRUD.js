//게시판 생성
async function boardCreate(){
    const boardForm = document.forms["board-form"];
    if ( boardForm.title.value === "" ) return alert('제목을 확인해주세요.');
    if ( boardForm.content.value === "" ) return alert('내용을 확인해주세요.');
    if ( boardForm.eventDate.value === "" ) return alert('흥보시간 확인해주세요.');
    if ( boardForm.category.value === "" ) return alert('카테고리를 확인해주세요.');
    
    try {
        const data = {
            title:boardForm.title.value,
            content:boardForm.content.value,
            event_time:boardForm.eventDate.value,
            category:boardForm.category.value
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
async function boardEdit(data) {

    try {
        const data = {...data}
        const res = await axios({
            method:"post",
            url:"/post/edit",
            data,
        })

        if(res.data.result){
            return true;
        } else{
            return false;
        }

    } catch(error) {

        alert("잠시후 다시 시도해주세요.");
        console.log(error);

    }
}
//게시판 삭제
  async function boardDelete (id) {

    try {

        const deleteRes = await axios({
            method:"DELETE",
            url:"/post/delete",
            data: { id }
        })

        if (deleteRes.data.result) {
            return true;
        } else{
            return false;
        }

    } catch(error){

        return false
    }
    
}

//게시판 조회

async function boardFindOne(id){

    try {
        const res = await axios({
            method: "POST",
            url:"/post/findone",
            data: {
                id
            }
        })
        if (res.data.result){
            return res.data;
        } else{
            return {result:false};
        }

    } catch (e) {
        return {result:false};
    }
}





async function boradFindAll(offset){
    console.log("offset 확인",offset);

    try { 
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
    } catch (e) {
        return [];
    }
 
}

async function boradFindAll_pagination(page_id){
    console.log("page_id",page_id)
    if (page_id === undefined || page_id == null) 
        return console.log('page_id이 없음');
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


const bookMark_FindOne = async (id) => {

    const data = { board_id : id }
    try {
        const createBookMarkres = await axios({
            method:"post",
            url:"/post/findonebookmark",
            data,
        })  
        if (createBookMarkres.data.result) {
            return true
        } else {
            return false
        }

    } catch (e) {
        return false
    }

    
}

const bookMark_create = async (id,view) => {
    const data = { board_id : id ,view : view}
    try {   
        const createBookMarkres = await axios({
            method:"post",
            url:"post/newbookmark",
            data,
        })  
        if (createBookMarkres) {
            return true
        } else {
            return false
        }
    } catch (e) {
        return false
    }
}
 
const bookMark_delete = async (id,view) => {
    const data = { board_id : id , view : view }
    try {   
        const deleteBookMarkres = await axios({
            method:"post",
            url:"post/deletebookmark",
            data,
        })

        if (deleteBookMarkres) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}


async function findall_profile_bookmark_board(){
    const res = await axios({
        method: "POST",
        url:"post/findall/profile_pagination_board",
        data: {
        }
    })
    if (res.data.result){
        return res.data.board;
    } else{
        console.log('res',res);
        return [];
    }
}
