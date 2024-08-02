"use strict"

const GameState = {
    WINNER: "WINNER",
    TIE: "TIE",
    UNKNOWN: "UNKNOWN"
}

const board = (function () {
    let cells = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]; // -1 * 3 Matrix

    let winnerSymbol = null;

    function placeAt(playerSymbol, row, column) {
        cells[row][column] = playerSymbol
    }

    function check() {
        // Check for a winner horizontally
        for (let i = 0; i < 3; i++) {
            if (cells[i][0] === "X" && cells[i][1] === "X" && cells[i][2] === "X") {
                winnerSymbol = "X";
                return GameState.WINNER;
            } else if (cells[i][0] === "O" && cells[i][1] === "O" && cells[i][2] === "O") {
                winnerSymbol = "O";
                return GameState.WINNER;
            }
        }

        // Check for a winner vertically
        for (let i = 0; i < 3; i++) {
            if (cells[0][i] === "X" && cells[1][i] === "X" && cells[2][i] === "X") {
                winnerSymbol = "X";
                return GameState.WINNER;
            } else if (cells[0][i] === "O" && cells[1][i] === "O" && cells[2][i] === "O") {
                winnerSymbol = "O";
                return GameState.WINNER;
            }
        }

        // Check for a winner diagonally
        if (cells[0][0] === "X" && cells[1][1] === "X" && cells[2][2] === "X") {
            winnerSymbol = "X";
            return GameState.WINNER;
        }
        if (cells[0][0] === "O" && cells[1][1] === "O" && cells[2][2] === "O") {
            winnerSymbol = "O";
            return GameState.WINNER;
        }

        if (cells[0][2] === "X" && cells[1][1] === "X" && cells[2][0] === "X") {
            winnerSymbol = "X";
            return GameState.WINNER;
        }
        if (cells[0][2] === "O" && cells[1][1] === "O" && cells[2][0] === "O") {
            winnerSymbol = "O";
            return GameState.WINNER;
        }

        if (cells.every(row => row.every(cell => cell !== ""))) {
            return GameState.TIE;
        }

        return GameState.UNKNOWN;
    }

    function getBoard() {
        return cells;
    }

    function getWinnerSymbol() {
        return winnerSymbol;
    }

    function clear() {
        winnerSymbol = null;
        cells = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
    }

    return {getBoard, getWinnerSymbol, placeAt, check, clear};
})();

const displayManager = (function () {
    function displayToConsole(board) {
        let result = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    result += "Empty";
                } else {
                    result += board[i][j];
                }
                result += "\t";
            }
            result += "\n";
        }

        console.log(result);
    }

    let turnP = document.querySelector(".turn")
    function displayToWeb(turn) {
        turnP.innerText = `It's ${turn}'s Turn`

        let state = board.check();
        if (state === GameState.WINNER) {
            turnP.innerText = `${board.getWinnerSymbol()} Won!`
            gameManager.setIsOver(true);
        } else if (state === GameState.TIE) {
            turnP.innerText = `Tie!`
            gameManager.setIsOver(true);
        }
    }

    return {displayToConsole, displayToWeb};
})();

const gameManager = (function () {
    let turn = "X";
    let isOver = false;

    function getTurn() {
        return turn;
    }

    function setTurn(symbol) {
        turn = symbol
    }

    function setIsOver(val) {
        isOver = val;
    }

    function getIsOver() {
        return isOver;
    }

    function reset(cells) {
        isOver = false;
        board.clear();
        turn = "X";
        displayManager.displayToWeb(turn);

        cells.forEach(cell => {
            cell.innerText = "";
        })
    }

    function play(row, column) {
        if (isOver) {
            return;
        }

        board.placeAt(turn, row, column)
        if (turn === "X") {
            turn = "O";
        } else {
            turn = "X";
        }

        displayManager.displayToWeb(turn);
    }

    return {getTurn, setTurn, play, setIsOver, reset, getIsOver};
})();

function createUser(name, symbol) {
    return {name, symbol};
}

let firstUser = createUser("first", "X");
let secondUser = createUser("second", "O");

gameManager.setTurn(firstUser.symbol);

const cells = document.querySelectorAll(".cell");
cells.forEach(cell => {
    cell.addEventListener("click", e => {
        let target = e.target;
        let row = parseInt(target.getAttribute("data-row"))
        let column = parseInt(target.getAttribute("data-column"))
        if (!gameManager.getIsOver()) {
            target.innerText = gameManager.getTurn();
        }

        gameManager.play(row, column);
    })
})

document.querySelector(".reset").addEventListener("click", () => {
    console.log("reset")
    gameManager.reset(cells);
})