// PACKAGES
const inquirer = require('inquirer')
const prompt = inquirer.prompt
const chalk = require('chalk')
const { table } = require('table')

let table_options = {
    columns: {
        0: {
            width: 10,
            alignment: 'center'
        },
        1: {
            width: 10,
            alignment: 'center'
        },
        2: {
            width: 10,
            alignment: 'center'
        },
        3: {
            width: 10,
            alignment: 'center'
        },
        4: {
            width: 10,
            alignment: 'center'
        },
        5: {
            width: 10,
            alignment: 'center'
        },
        6: {
            width: 10,
            alignment: 'center'
        },
    }
}

// GLOBAL VARIABLES
let table_header = [['1', '2', '3', '4', '5', '6', '7']]
let this_turn; // this holds the string "red" or "black"; changed by switchTurn() function
let board; // this holds the matrix rendered by boardMaker() and setBoard()f
let win = false; // this stays false until a win situation returns true
const invalid_msg = "This is not a valid entry. Use a number from 1 - 7." // string message to be logged to user if input invalid


setGame(); // GAME FRAMEWORK

function setGame() {
    board = boardMaker(6, 7);
    setBoard(board);
    this_turn = "red";
    askQuestion();
}

// GAME LOOP
// show the user the board as a matrix; ask them which column they'd like to play, tell them which turn it is. 
function askQuestion() {
    console.log(table(table_header, table_options));
    console.log(table(board, table_options));
    prompt([{
            name: 'move',
            message: `It's ${this_turn}'s turn: enter the column in which you'd like to play (1 - 7): `
        }])
        .then(res => {
            // validate response (must be a number, must be greater than/equal to 1, less than/equal to 6)
            if (isNaN(parseInt(res.move)) || parseInt(res.move) < 1 || parseInt(res.move) > 7) {
                console.error(chalk.red.bold(invalid_msg));
                askQuestion() // if it's an invalid entry, re-do function without switching turns
            } else {
                // IF VALD RESPONSE:
                makeMove(board, this_turn, res.move); 
                // "win" will be true or false, based on the return of checkWin()
                win = checkWin(board, this_turn);
                if (win) {
                    // if a player wins, log message and board, end recursion
                    console.log(chalk.magenta.bold(`CONGRATS ${this_turn.toUpperCase()} - YOU WON!!!!!!`));
                    console.log(table(board, table_options));
                }
                else {
                    // if no win, switch the turn, askQuestion() recursion
                    switchTurn();
                    askQuestion();
                }
            }
            
        })
}
// check each win-case (vertical, horizontal, left/right diagonal) - return true if any of them return true; otherwise return false
function checkWin(board, turn) {
    if (winByRow(board, turn) || winByCol(board, turn)   || winByNegSlope(board, turn) || winByPosSlope(board, turn)) {
        return true;
    }
    return false;
}
// horizontal win check - in each row, if any 4 adjacent elements have the same value, return true; otherwise, return false
function winByRow(board, turn) {
    for (let i = 0; i < board.length; i++) {
        for(let j = 0; j < board[i].length; j++) {
            if (board[i][j] === turn && board[i][j+1] === board[i][j] && board[i][j+2] === board[i][j+1] && board[i][j+3] === board[i][j+2]) {
                return true;
            }
        }
    }
    return false;
}
// vertical win check - in each column, add each row value to a check array; if the check array resolves as true, return true; otherwise, keep iterating through; if no columns return true when passed to the check array, return false
function winByCol(board, turn) {
    for (let j = 0; j < board[0].length; j++ ) {
        let check_array = []
        for (let i = 0; i < board.length; i++) {
            check_array.push(board[i][j])        
        }
        if (winHelper(check_array, turn)) {
            return true;
        }
    }
    return false;
}
// negative slope win
function winByNegSlope(board, turn) {
    for (let i = 0; i < board.length-2; i++) {
        if (board[i+3] !== undefined) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === turn && board[i+1][j+1] === turn && board[i+2][j+2] === turn && board[i+3][j+3] === turn) {
                    return true;
                }
            }        
        }
    }
    return false;
}

// positive slope win
function winByPosSlope(board, turn) {
    for (let i = 0; i < board.length-2; i++) {;
        if (board[i+3] !== undefined) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === turn && board[i+1][j-1] === turn && board[i+2][j-2] === turn && board[i+3][j-3] === turn) {
                    return true;
                }
            }
        }
    }
    return false;
}

// helper function to return true if a passed array values resolve; otherwise, return false
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
// checks turn, switches to other.
function switchTurn() {
    if (this_turn === "red") {
        this_turn = "yellow";
    } else {
        this_turn = "red";
    }
}
// make move function takes the matrix, the turn, and the move column as identified by the user; iterates through whole matrix in reverse to check whether the last possible value is a number; if so, it's a valid place to move; if not, it'll check the next one.
function makeMove(array, turn, move_col) {
    let parse_move = move_col - 1
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i][parse_move] === null) {
            array[i][parse_move] = turn;
            return;
        }
    }
}

// creates the matrix creating an array of arrays; returns the array of arrays.
function boardMaker(col, row) {
    let arr = new Array(col)
    for (i = 0; i < arr.length; i++) {
        arr[i] = new Array(row);
    }
    return arr;
}

// adds the values (num as string for now) to the matrix
function setBoard (array) {
    let insert = null;
    for(i = 0; i < array.length; i++) {
        for (j = 0; j < array[i].length; j++) {
            array[i][j] = insert
        }
    }

}

// takes the matrix, value, returns an array of objects {x, y, value} to be used to check diagonal wins
// USING AS A TESTER FUNCTION
function getValue (array, target) {
    let res_array = []
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] === target.toString()) {
                res_array.push({"x": j, "y": i, "value": target})
            } 
        }
    }
    return res_array;
}