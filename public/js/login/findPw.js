async function findPw() {
    try {
        const resultBox = document.querySelector('.result')
        const form = document.forms['findPw-form']
        const data = {
            login_id: form.id.value,
            name: form.name.value,
        }
        const result = await axios({
            method: "post",
            url: "/findpw",
            data,
        })
        if (result.data.result) {
            alert(`${result.data.message}`)
            document.location.href = '/'
        } else {
            resultBox.textContent = `${result.data.message}`
            resultBox.classList.add('show');
        }
    } catch (error) {
        console.log(error);
    }
}

function cancel() {
    window.location.href='/'
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        (async()=>{
            await findPw();
        })()
    }
});