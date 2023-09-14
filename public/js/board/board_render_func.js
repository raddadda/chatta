

function modalCloase () {
    document.getElementById('boardDetailModal').style.display = 'none';
}

function boardModified (id) {
    if(!confirm('수정페이지로 넘어가겠습니까?')) return;
    window.location.href = `/post/edit/${id}`
}

async function boardDelete1 (id) {

    if (!confirm('정말로 삭제하시겠습니까?')) return;
    try {
        const deleteRes = await boardDelete(id);
        if (deleteRes) {
            alert('삭제가 되었습니다.');
            window.location.reload();
        } else {
           return alert('다시 시도해 주세요.');
        }
    } catch (e) {
        alert('잠시 후에 시도해주세요.');
    }
}