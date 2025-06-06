function GameBoard() { //gameboard object
    const rows = 3;
    const columns = 3;
    const board = [];
    let moves = 0;

    for (let i = 0; i < rows; i++) { //2d game array
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    function getBoard() {
        return board;
    };

    function placeXOrO(row, column, player) {
        let taken = false;

        if (board[row][column].getValue() === 0) {
            board[row][column].addXorO(player);
            moves++;
        } else {
            console.log("Cell is taken. Try another spot!");
            taken = true;
        }

        return taken; 
    };

    function threeInARow() {
        for (let i = 0; i < rows; i++) {
            if (board[i][0].getValue() !== 0 && board[i][0].getValue() === board[i][1].getValue() && board[i][1].getValue() === board[i][2].getValue()) {
                return true;
            }
        }

        for (let j = 0; j < columns; j++) {
            if (board[0][j].getValue() !== 0 && board[0][j].getValue() === board[1][j].getValue() && board[1][j].getValue() === board[2][j].getValue()) {
                return true;
            }
        }
        //diagonals
        if (board[0][0].getValue() !== 0 && board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()) {
            return true;
        }
        if (board[0][2].getValue() !== 0 && board[0][2].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][0].getValue()) {
            return true;
        }

        return false;
    }

    function Cell() {
        let value = 0;

        function addXorO(player) {
            value = player;
        };

        function getValue() {
            return value;
        };

        return { addXorO, getValue };
    }

    function printBoard() {
        const boardWithValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithValues); 
    };

    return { getBoard, placeXOrO, printBoard, threeInARow};
}

function GameController(playerOne, playerTwo) { //game flow object
    const board = GameBoard();
    let firstRound = true;

    const players = [ //object array for players
        {
            name: playerOne,
            token: "X"
        },
        {
            name: playerTwo, 
            token: "O"
        }
    ];

    let activePlayer = players[0];

    function switchPlayerTurn() {
        if (activePlayer == players[0]) {
            activePlayer = players[1];
        } else {
            activePlayer = players[0];
        }

        return activePlayer;
    };

    function getActivePlayer() {
        return activePlayer;
    };

    function printNewRound() {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    function printPlayer() {
        firstRound = false;
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    function playRound(row, column) {
        let moves = 0;

        if (firstRound) {
            printPlayer();
        }

        console.log("Playing round.");
        const taken = board.placeXOrO(row, column, getActivePlayer().token);
        
        if (taken) {
            console.log(`Still ${getActivePlayer().name}'s turn.`);
        } else {
            const winner = board.threeInARow();
            if (winner) {
                board.printBoard();
                console.log(`${getActivePlayer().name} wins!`);
                return;
            }

            if (moves === 9) {
                console.log("It's a draw!");
                board.printBoard();
                return;
            }

            switchPlayerTurn(); 
            printNewRound(); 
        }
    }

    return { playRound, getActivePlayer, getBoard: board.getBoard, threeInARow: board.threeInARow };
}

    let playerTwoScore = 0;
function ScreenController() {
    const game = GameController("Player X", "Player O");
    let end = false;

    const boardDiv = document.querySelector(".board");
    function updateScreen() {
        boardDiv.textContent = ""; //clearing the board

        const board = game.getBoard();

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;

                const value = cell.getValue();
                cellButton.textContent = value === 0 ? "" : value;
                boardDiv.appendChild(cellButton);
            });
        });

        if (game.threeInARow()) {
            updateScores();
            end = true;
        }
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (selectedRow === undefined || selectedColumn === undefined) return;

        if (end) {
            console.log("Game is over. No more moves allowed.");
            return;
        }

        game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
        updateScreen();
    }

    const playerOne = document.querySelector(".player-one");
    let playerOneScore = 0;
    const playerTwo = document.querySelector(".player-two");
    let playerTwoScore = 0;
    
    function updateScores() {
        if (game.getActivePlayer().name == "Player X") {
            playerOneScore++;
            playerOne.textContent = `Player X: ${playerOneScore}`;
        }
        else {
            playerTwoScore++;
            playerTwo.textContent = `Player O: ${playerTwoScore}`;
        }
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();

    //allows user to play another round
    const resetButton = document.querySelector(".reset-game");
    resetButton.addEventListener("click", () => {
        const newGame = GameController("Player X", "Player O");
        Object.assign(game, newGame);
        end = false;
        updateScreen();
    })

    //allows user to play a whole new game
    const newGameButton = document.querySelector(".new-game");
    newGameButton.addEventListener("click", () => {
        playerOne.textContent = "Player X: 0";
        playerTwo.textContent = "Player O: 0";
        ScreenController();
    })

}

ScreenController();
