var board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    var currentPlayer = 'X';
    var difficulty = 'easy';
    var difficultyLocked = {
        easy: false,
        medium: false,
        hard: false,
        impossible: false
    };

function makeMove(row, col) {
    if (board[row][col] == '') {
        board[row][col] = currentPlayer;
        document.getElementById('tic-tac-toe-board').children[row].children[col].innerHTML = currentPlayer;

        var winner = checkWin();
        if (winner) {
            setTimeout(function() {
                alert(winner + ' wins!');
                resetBoard();
            }, 100);
            return;
        } else if (isBoardFull()) {
            setTimeout(function() {
                alert('Draw!');
                resetBoard();
            }, 100);
            return;
        }

        if (!difficultyLocked[difficulty]) {
            difficultyLocked[difficulty] = true; // Lock the difficulty once a move is made
            hideDifficultyButtons(); // Hide difficulty buttons
        }

        if (currentPlayer == 'X') {
            currentPlayer = 'O';
            document.getElementById('tic-tac-toe-board').style.pointerEvents = 'none';  // Disable board
            setTimeout(makeAIMove, 100);  // AI's turn
        } else {
            currentPlayer = 'X';
            document.getElementById('tic-tac-toe-board').style.pointerEvents = 'auto';  // Enable board
        }
    }
}

function hideDifficultyButtons() {
    var buttons = document.getElementsByClassName('difficulty-buttons')[0];
    buttons.style.display = 'none';
}



function minimax(board, depth, isMaximizingPlayer) {
    var winner = checkWin();
    if (winner === 'X') {
        return -1;
    } else if (winner === 'O') {
        return 1;
    } else if (isBoardFull()) {
        return 0;
    }

    if (isMaximizingPlayer) {
        var bestScore = -Infinity;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = 'O';
                    var score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        var bestScore = Infinity;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = 'X';
                    var score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function makeBestMove() {
    var bestScore = -Infinity;
    var move;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                board[i][j] = 'O';
                var score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }
    makeMove(move.i, move.j);
}


function setDifficulty(diff) {
    difficulty = diff;
    document.getElementById('difficulty-display').innerText = 'Difficulty: ' + difficulty;
}

function resetBoard() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    var cells = document.getElementsByClassName('cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
    }
    
    // Unlock all difficulty levels
    difficultyLocked = {
        easy: false,
        medium: false,
        hard: false,
        impossible: false
    };

    showDifficultyButtons(); // Show difficulty buttons
}

function showDifficultyButtons() {
    var buttons = document.getElementsByClassName('difficulty-buttons')[0];
    buttons.style.display = 'block';
}



function makeAIMove() {
    switch (difficulty) {
        case 'easy':
            makeRandomMove();
            break;
        case 'medium':
            if (!makeWinningMove() && !makeBlockingMove()) {
                makeRandomMove();
            }
            break;
        case 'hard':
            if (!makeWinningMove() && !makeBlockingMove() && !makeSmartMove()) {
                makeRandomMove();
            }
            break;
        case 'impossible':
            makeBestMove();
            break;
        default:
            makeRandomMove();
            break;
    }
    document.getElementById('tic-tac-toe-board').style.pointerEvents = 'auto';  // Enable board
}

function makeWinningMove() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                board[i][j] = currentPlayer;
                if (checkWin() == currentPlayer) {
                    board[i][j] = '';
                    makeMove(i, j);
                    return true;
                }
                board[i][j] = '';
            }
        }
    }
    return false;
}

function makeBlockingMove() {
    var opponent = currentPlayer == 'X' ? 'O' : 'X';
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                board[i][j] = opponent;
                if (checkWin() == opponent) {
                    board[i][j] = '';
                    makeMove(i, j);
                    return true;
                }
                board[i][j] = '';
            }
        }
    }
    return false;
}

function makeSmartMove() {
    // Try to take the center if it's available
    if (board[1][1] == '') {
        makeMove(1, 1);
        return true;
    }

    // Try to take a corner if it's available
    var corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
    for (var i = 0; i < corners.length; i++) {
        if (board[corners[i][0]][corners[i][1]] == '') {
            makeMove(corners[i][0], corners[i][1]);
            return true;
        }
    }

    return false;
}

function makeRandomMove() {
    var availableCells = [];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                availableCells.push([i, j]);
            }
        }
    }
    var move = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(move[0], move[1]);
}

function checkWin() {
    var lines = [
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]]
    ];

    for (var i = 0; i < lines.length; i++) {
        if (lines[i][0] == lines[i][1] && lines[i][1] == lines[i][2] && lines[i][0] != '') {
            return lines[i][0];
        }
    }
    return false;
}

function isBoardFull() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                return false;
            }
        }
    }
    return true;
}
 function setDifficulty(diff) {
            if (!difficultyLocked[diff]) {
                difficulty = diff;
                document.getElementById('difficulty-display').innerText = 'Difficulty: ' + difficulty;
            }
        }

