const inquirer = require('inquirer');

let this_turn;
let board;
let win = false;
const invalid = "This is not a valid entry. Use a number from 1 - 6."

setGame();

function setGame() {
    board = boardMaker(7, 6);
    setBoard(board);
    this_turn = "red";
    askQuestion();
}

function askQuestion() {
    console.log(board);
    inquirer
        .prompt([{
            name: 'move',
            message: `It's ${this_turn}'s turn: enter the column in which you'd like to play (1 - 6): `
        }])
        .then(res => {
            if (isNaN(parseInt(res.move)) || parseInt(res.move) < 1 || parseInt(res.move) > 6) {
                console.error(invalid);
                askQuestion()
            } else {
                makeMove(board, this_turn, res.move);
                win = checkWin(board, this_turn);
                if (win) {
                    console.log(`${this_turn} won!`);
                    console.log(board);
                }
                else {
                    switchTurn();
                    askQuestion();
                }
            }
            
        })
}

function checkWin(board, turn) {
    if (winByRow(board, turn) || winByCol(board, turn) /*  || winByLeftDiag(board, turn) || winByRightDiag(board, turn) */) {
        return true;
    }

    return false;
}

function winByRow(board, turn) {
    for (i = 0; i < board.length; i++) {
        for(j = 0; j < board[i].length; j++) {
            if (board[i][j] === turn && board[i][j+1] === board[i][j] && board[i][j+2] === board[i][j+1] && board[i][j+3] === board[i][j+2]) {
                return true;
            }
        }
    }
    return false;
}

function winByCol(board, turn) {
    for (j = 0; j < board[0].length; j++ ) {
        let check_array = []
        for (i = 0; i < board.length; i++) {
            check_array.push(board[i][j])        
        }
        if (winHelper(check_array, turn)) {
            return true;
        }
    }

    return false;
}

function winHelper(array, turn) {
    let i = 0;
    while (i < array.length - 3) {
        if (array[i] === turn && array[i+1] === array[i] && array[i+2] === array[i+1] && array[i+3] === array[i+2]) {
            return true;
        }
        i++
    }
    return false;

}

function switchTurn() {
    if (this_turn === "red") {
        this_turn = "black";
    } else {
        this_turn = "red";
    }
}

function makeMove(array, turn, move_col) {
    let parse_move = move_col - 1
    for (i = array.length - 1; i >= 0; i--) {
        if (!isNaN(parseInt(array[i][parse_move]))) {
            array[i][parse_move] = turn;
            return;
        }
    }
    
}

function boardMaker(col, row) {
    let arr = new Array(col)
    for (i = 0; i < arr.length; i++) {
        arr[i] = new Array(row);
    }

    return arr;
}

function setBoard (array) {
    let insert = 1;

    for(i = 0; i < array.length; i++) {
        let this_col = array[i]
        for (j = 0; j < this_col.length; j++) {
            this_col[j] = insert.toString()
            insert += 1
        }
    }

}

function getValue (array, target) {
    let resObj = {
        "x": null,
        "y": null,
        "value": null
    }
    for (i = 0; i < array.length; i++) {
        let this_col = array[i]
        for (j = 0; j < this_col.length; j++) {
            if (this_col[j] === target.toString()) {
                resObj["x"] = i
                resObj["y"] = j
                resObj["value"] = target
            } 
        }
    }

    return resObj;
    
}