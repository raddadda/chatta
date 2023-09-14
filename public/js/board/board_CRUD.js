let loading = false;

//게시판 생성
async function boardCreate(){
    try {
        if(loading) return;
        loading = true;
        const boardForm = document.forms["board-form"];
        if ( boardForm.title.value === "" ) return alert('제목을 확인해주세요.'),  loading = false;;
        if ( boardForm.content.value === "" ) return alert('내용을 확인해주세요.'),  loading = false;;
        if ( boardForm.eventDate.value === "" ) return alert('흥보시간 확인해주세요.'),  loading = false;;
        if ( boardForm.category.value === "" ) return alert('카테고리를 확인해주세요.'),  loading = false;;
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
            return
        } else{
            alert("다시 시도해주세요.");
            return;
        }
        loading = false;
    } catch (error) {
        alert("잠시 후에 시도해주세요.");
        loading = false;
        console.log(error);
    }
}

//게시판 수정
async function boardEdit(resdata) {
    try {
        if(loading) return;
        loading = true;
        const data = {...resdata}
        const res = await axios({
            method:"post",
            url:"/post/edit",
            data,
        })

        if(res.data.result){
            loading = false;
            return true;
        } else{
            loading = false;
            return false;
        }
    } catch(error) {
        loading = false;
        alert("잠시후 다시 시도해주세요.");
        loading =false;
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
        
    } catch(error) {
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
        if (res.data.result) {
            return res.data;
        } else {
            return { result: false };
        }
    } catch (e) {
        return { result: false };
    }
}


async function boradFindAll(offset){
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
            return [];
        }
    } catch (e) {
        return [];
    }
}

async function boradFindAll_pagination(page_id){
    try {
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
            return [];
        }
    } catch (error) {
        console.log(error)
    }
}


const bookMark_FindOne = async (id) => {
    try {
        const data = { board_id : id }
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
    } catch (error) {
        console.log(error)
        return false
    }
}

const bookMark_create = async (id,view) => {
    try {   
        const data = { board_id : id ,view : view }
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
    } catch (error) {
        console.log(error)
        return false
    }
}
 
const bookMark_delete = async (id,view) => {
    try {   
        const data = { board_id : id , view : view }
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
    } catch (error) {
        console.log(error)
        return false;
    }
}


async function findall_profile_bookmark_board(){
    try {
        const res = await axios({
            method: "POST",
            url:"post/findall/profile_pagination_board",
            data: {
            }
        })
        if (res.data.result){
            return res.data.board;
        } else{
            return [];
        }
    } catch (error) {
        console.log(error)
    }
}
