const yearDropdown = document.getElementById('birth-year');
const monthDropdown = document.getElementById('birth-month');
const dayDropdown = document.getElementById('birth-day');
///////////////birth form////////////////////

for (let year = new Date().getFullYear(); year >= 1900; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    yearDropdown.appendChild(option);
}


for (let month = 1; month <= 12; month++) {
    const option = document.createElement('option');
    option.value = month;
    option.text = month;
    monthDropdown.appendChild(option);
}

for (let day = 1; day <= 31; day++) {
    const option = document.createElement('option');
    option.value = day;
    option.text = day;
    dayDropdown.appendChild(option);
}
//////////////////////////////////////////////////////////

async function findId() {
    const resultBox = document.querySelector('.result')
    const resultBox2 = document.querySelector('.result2')
    const box = document.querySelector('#form')
    const resultText = document.querySelector('.resultText')
    const tx = document.querySelector('#tx')
    const form = document.forms['findId-form']
    const data = {
        name: form.name.value,
        birth : `${form.year.value}-${form.month.value}-${form.day.value}`
    }
    const result = await axios({
        method: "post",
        url: "/findid",
        data,
    })
    if (result.data.result) {
        resultBox2.classList.add('show');
        resultBox2.innerHTML = `${result.data.name}님의 아이디는 <h2>${result.data.message}</h2> 입니다.`
        tx.textContent = '회원님의 아이디 찾기 결과입니다.'
        box.hidden = true;
        resultText.hidden = false;
    } 
    if (!result.data.result) {
        resultBox.textContent = `${result.data.message}`
        resultBox.classList.add('show');
    }
}
function cancel() {
    window.location.href='/'
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        findId();
    }
});