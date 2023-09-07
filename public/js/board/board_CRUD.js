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
async function boradFindAll(){
    const res = await axios({
        method: "POST",
        url:"/post/findall",
        data: {
            id: 5
        }
    })
    
    if(res.data.result){
        const wrap = document.querySelector("#wrap");
        let boxhtml = ``;
        
        for (let i=0; i<res.data.board.length; i++){
            list.push(res.data.board[i]);
    
            const data = {
                bord_category : res.data.board[i] && res.data.board[i].bord_category ? res.data.board[i].bord_category : '',
                title :  res.data.board[i] && res.data.board[i].title ? res.data.board[i].title : '',
                views : res.data.board[i] && res.data.board[i].views ? res.data.board[i].views : 0,
                createAt : res.data.board[i] && res.data.board[i].createdAt.split('T')[0]? res.data.board[i].createdAt.split('T')[0] : '',
            }
            
            if(i%2==0){
                boxhtml += `
            <div class="imgFlex1" onclick="loadDetailModal(${i})">
                <div class="roomImg"></div>
                <div class="boardInfo">
                    <div class="boxBordCategory">${data.bord_category}</div>
                    <div class="boxTitle">${data.title}</div>
                    <div class="boxCreateAt">${data.createAt}</div>
                    <div class="boxViews">${data.views}</div>      
                </div>
            </div>
            `;  
            } else{
                boxhtml += `
            <div class="imgFlex2" onclick="loadDetailModal(${i})">
                <div class="roomImg"></div>
                <div class="boardInfo">
                    <div class="boxBordCategory">${data.bord_category}</div>
                    <div class="boxTitle">${data.title}</div>
                    <div class="boxCreateAt">${data.createAt}</div>
                    <div class="boxViews">${data.views}</div>      
                </div>
            </div>
            `;  
            }
        }
        wrap.innerHTML += boxhtml;
    }else{
        console.log('res',res);
    }
    
}
