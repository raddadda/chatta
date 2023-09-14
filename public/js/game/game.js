let socketInfoList;
let player_info;
let suffle;
let choose_flag = false;
let role;
let turn;


function firstPlayer(){
    const rand = Math.floor(Math.random() * 2);
    return rand;
}

const currentPlayerdiv = document.getElementById('current-player')
const blackCircle = currentPlayerdiv.querySelector('.black-circle')
const whiteCircle = currentPlayerdiv.querySelector('.white-circle')
const currentBlackPlayerInfo = document.getElementById('current-black-player-info')
const currentWhitePlayerInfo = document.getElementById('current-white-player-info')
const board = document.getElementById('board');
const cells = [];
let currentPlayer = 'black';

// 보드 생성
for (let i = 0; i < 18; i++) {
    cells[i] = [];
    for (let j = 0; j < 18; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        board.appendChild(cell);
        cells[i][j] = cell;

        cell.addEventListener('click', () => {
            if (cell.classList.contains('black') || cell.classList.contains('white')) {
                return;
            }
            if(role[turn] === nickname){
                socket.emit('ejs_choose',nickname,room_id,cell.dataset);
                cell.classList.add(currentPlayer);
                turn = (turn + 1) % 2
            } else {
                if(choose_flag){
                    cell.classList.add(currentPlayer);
                    turn = (turn + 1) % 2
                } else {
                    return;
                }
            }

            if (checkWin(parseInt(cell.dataset.row), parseInt(cell.dataset.col))) {
                alert(`${currentPlayer.toUpperCase()} 플레이어가 승리했습니다!`);
                resetGame();
            } else {
                currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
                blackCircle.hidden = blackCircle.hidden === true ? false : true;
                currentBlackPlayerInfo.hidden = currentBlackPlayerInfo.hidden === true ? false : true;
                whiteCircle.hidden = blackCircle.hidden === true ? false : true;
                currentWhitePlayerInfo.hidden = currentWhitePlayerInfo.hidden === true ? false : true;
            }
        });
    }
}

function simulateClick(row, col) {
    const cell = cells[row][col];
    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
    });
    cell.dispatchEvent(clickEvent);
}

// 승리 확인 함수 (5개 연속인지 확인)
function checkWin(row, col) {
    // 가로 확인
    let count = 1;
    for (let i = col + 1; i < 18 && cells[row][i].classList.contains(currentPlayer); i++) count++;
    for (let i = col - 1; i >= 0 && cells[row][i].classList.contains(currentPlayer); i--) count++;
    if (count >= 5) return true;

    // 세로 확인
    count = 1;
    for (let i = row + 1; i < 18 && cells[i][col].classList.contains(currentPlayer); i++) count++;
    for (let i = row - 1; i >= 0 && cells[i][col].classList.contains(currentPlayer); i--) count++;
    if (count >= 5) return true;

    // 대각선 확인 (오른쪽 위에서 왼쪽 아래로)
    count = 1;
    for (let i = row - 1, j = col + 1; i >= 0 && j < 18 && cells[i][j].classList.contains(currentPlayer); i--, j++) count++;
    for (let i = row + 1, j = col - 1; i < 18 && j >= 0 && cells[i][j].classList.contains(currentPlayer); i++, j--) count++;
    if (count >= 5) return true;

    // 대각선 확인 (왼쪽 위에서 오른쪽 아래로)
    count = 1;
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0 && cells[i][j].classList.contains(currentPlayer); i--, j--) count++;
    for (let i = row + 1, j = col + 1; i < 18 && j < 18 && cells[i][j].classList.contains(currentPlayer); i++, j++) count++;
    if (count >= 5) return true;

    return false;
}

// 게임 초기화
function resetGame() {
    for (let i = 0; i < 18; i++) {
        for (let j = 0; j < 18; j++) {
            cells[i][j].classList.remove('black', 'white');
        }
    }
    currentPlayer = 'black';
    currentBlackPlayerInfo.textContent = ''
    currentWhitePlayerInfo.textContent = ''
}