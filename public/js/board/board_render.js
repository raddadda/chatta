

function list_item (index, data) {
    
    return `<div class="board-card" onclick="loadDetailModal(${index})">
            <div class="roomImg">
                <div class="img-box"></div>
            </div>
            <div class="boardInfo">
                <div class="boxBordCategory">${data.category}</div>
                <div class="boxTitle">${data.title}</div>
                <div class="boxCreateAt">${data.createAt}</div>
                <div class="boxViews"><img src="https://kdt9-justin.s3.ap-northeast-2.amazonaws.com/viewicon.png" >&nbsp; ${data.views}</div>      
            </div>
        </div>
    `; 
}


function getBookMarkSvg (book_mark) {

    return ` <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280.000000 1222.000000"
        preserveAspectRatio="xMidYMid meet">
        <metadata>
        Created by potrace 1.15, written by Peter Selinger 2001-2017
        </metadata>
        <g transform="translate(0.000000,1222.000000) scale(0.100000,-0.100000)" stroke="none" ${book_mark ?  "fill = #f5cd00": "fill = #eee" }>
        <path d="M6273 12205 c-115 -32 -205 -96 -266 -187 -19 -29 -304 -602 -635
        -1273 -330 -671 -719 -1461 -864 -1755 l-264 -535 -220 -32 c-3672 -539 -3667
        -538 -3722 -557 -100 -35 -199 -123 -248 -219 -76 -148 -69 -309 18 -454 23
        -37 448 -457 1450 -1430 1270 -1233 1418 -1380 1413 -1403 -2 -14 -39 -223
        -80 -465 -42 -242 -111 -645 -155 -895 -43 -250 -124 -718 -180 -1040 -56
        -322 -135 -778 -176 -1015 -90 -512 -92 -552 -30 -680 102 -216 358 -320 574
        -233 31 13 836 432 1788 931 l1731 906 804 -420 c442 -231 1223 -640 1734
        -907 512 -268 953 -495 980 -504 63 -22 202 -23 268 -3 111 33 228 129 277
        225 29 57 50 146 50 212 0 32 -41 292 -90 578 -138 795 -261 1506 -371 2145
        -56 319 -124 716 -153 882 l-52 303 1422 1392 c965 944 1432 1408 1453 1442
        43 71 62 130 68 211 16 208 -126 413 -324 468 -32 9 -379 61 -770 117 -392 55
        -1034 145 -1425 200 -392 56 -868 123 -1058 150 -190 26 -419 58 -510 71 -91
        12 -170 27 -177 33 -6 6 -399 799 -873 1761 -473 963 -877 1774 -898 1804 -44
        65 -131 131 -210 161 -74 29 -207 36 -279 15z"/>
        </g>
    </svg>
    `
}

async function loadDetailModal (index) {
    // console.log("list[index]",list[index].views++);
    list[index].book_mark = await post_bookmark(list[index].id);

    const data = {
        id : list[index] && list[index].id ? list[index].id : 0,
        poster_check : list[index] && list[index].poster_check ? list[index].poster_check : false,
        category : list[index] && list[index].category ? list[index].category : '',
        content: list[index] && list[index].content ? list[index].content : '',
        title :  list[index] && list[index].title ? list[index].title : '',
        views : list[index] && list[index].views ? list[index].views : 0,
        event_time : list[index] && list[index].event_time ? list[index].event_time.split('T')[0] : '',
        book_mark : list[index] && list[index].book_mark ? list[index].book_mark : false
    }

    let modal = document.getElementById('boardDetailModal');
    modal.style.display = 'block'
    modal.innerHTML = `
        <div class="board-modal-close" onclick="modalCloase()">
            <img src= "https://kdt9-justin.s3.ap-northeast-2.amazonaws.com/close.png"
                alt="close_img"
            />
        </div>
        <div class="bd-image"></div>
        <div class="board-detail-contents">
            <div class="bd-info">
                <div class="bd-info_category"> ${data.category}</div>
                <h2 class="bd-info_title">${data.title}</h2>
                <div class="bd-book_mark" onclick= "bookMarkToggle(${index})">
                    ${getBookMarkSvg(data.book_mark)}
                </div>
            </div>
            <div id="eventDetailSubInfo" class="bd-sub-content">
                <div class="txt-box">
                    <h6>내용</h6>
                    <p>${data.content}</p>
                </div>
                <div class="txt-box">
                    <h6>흥보 시간</h6>
                    <p>${data.event_time}</p>
                </div>

                <div class="txt-box">
                    <h6>채팅방</h6>
                    <p><button onclick='chatRoomJoin(${data.id})'>입장하기</button><p>
                </div>
                ${data.poster_check === true ? 
                    `<div class="button-box">
                        <button type="button" onclick = "boardModified(${data.id})">수정하기</button>
                        <button type="button" onclick = "boardDelete1(${data.id})">삭제하기</button>
                    </div>`
                    : 
                    ''
                }
            </div>
           
        </div>
    `
}