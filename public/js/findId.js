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

async function findPw() {
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
}
function cancel() {
    window.location.href='/'
}
