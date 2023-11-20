let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

let currentPlayer = 'X';
let gameOver = false;

function evaluate(state) {
    //returns a score based on state: AI (positive), human(negative) and draw (zero)

    if (checkWin()) {
        return currentPlayer === 'O' ? 1 : -1;
    } else if (checkDraw()) {
        return 0;
    } else {
        return 0;
    }
}

function handleCellClick(event) {
    if (gameOver) return;

    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (board[row][col] === null) {
        board[row][col] = currentPlayer;
        cell.textContent = currentPlayer;

        if (checkWin()) {
            document.getElementById('message').textContent = `Player ${currentPlayer} wins!`;
            gameOver = true;
        } else if (checkDraw()) {
            document.getElementById('message').textContent = 'It\'s a draw!';
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('message').textContent = `Player ${currentPlayer}'s turn`;

            if (currentPlayer === 'O') {
                setTimeout(() => computerMove(), 500); // 100ms maybe?
            }
        }
    }
}

function computerMove() {
    if (gameOver) return;

    console.log("Calculating AI move...");
    
    const move = minimax(board, currentPlayer === 'X' ? 'O' : 'X',emptyCells().length);
    const row = move[0];
    const col = move[1];

    console.log("AI move:", row, col);
    
    board[row][col] = currentPlayer;
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.textContent = currentPlayer;

    if (checkWin()) {
        document.getElementById('message').textContent = `Player ${currentPlayer} wins!`;
        gameOver = true;
    } else if (checkDraw()) {
        document.getElementById('message').textContent = 'It\'s a draw!';
        gameOver = true;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('message').textContent = `Player ${currentPlayer}'s turn`;
    }
}

/** MINIMAX ALGORITHM */
function minimax(state, player, depth) {
    if (checkWin()) {
        return [null, null, player === 'O' ? 1 : -1];
    }

    const availableMoves = emptyCells();

    if (availableMoves.length === 0) {
        //no available moves left, then it is a draw
        return [null, null, 0];
    }

    const best = player === 'O' ? [-1, -1, -Infinity] : [-1, -1, Infinity];

    

    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        move.row = availableMoves[i][0];
        move.col = availableMoves[i][1];

        state[move.row][move.col] = player;
        const score = minimax(state, player === 'O' ? 'X' : 'O', depth + 1)[2];
        state[move.row][move.col] = null;

        if ((player === 'O' && score > best[2]) || (player === 'X' && score < best[2])) {
            best[0] = move.row;
            best[1] = move.col;
            best[2] = score;
        }
    }

    return best;
}


function emptyCells() {
    const emptyCellsArray = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === null) {
                emptyCellsArray.push([row, col]);
            }
        }
    }
    return emptyCellsArray;
}

function checkWin() {
    //check winning rows
    for (let row = 0; row < 3; row++) {
        if (board[row][0] === currentPlayer && board[row][1] === currentPlayer && board[row][2] === currentPlayer) {
            return true;
        }
    }

    //check winning columns
    for (let col = 0; col < 3; col++) {
        if (board[0][col] === currentPlayer && board[1][col] === currentPlayer && board[2][col] === currentPlayer) {
            return true;
        }
    }

    //check winning diagonals
    if (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) {
        return true;
    }
    if (board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer) {
        return true;
    }

    return false;
}

function checkDraw() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === null) {
                return false; //there exists an empty cell, hence game is not a draw
            }
        }
    }
    return true; //since all cells are filled, game is a draw
}


function resetBoard() {
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    currentPlayer = 'X';
    gameOver = false;

    document.getElementById('message').textContent = "Player X's turn";

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
    });
}
