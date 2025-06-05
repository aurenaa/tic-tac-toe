function GameBoard() { //gameboard object
    const rows = 3;
    const columns = 3;
    const board = [];

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
        if (board[row][column].getValue() === 0) {
            board[row][column].addXorO(player);
        }
        else {
            console.log("Cell is taken. Try another spot!");
        }
    };

    function Cell() {
        let value = 0;
        
        function addXorO(player) {
            value = player;
        };

        function getValue() {
            return value;
        };

        return {addXorO, getValue};
    }

    function printBoard() {
        const boardWithValues = board.map(row => row.map(cell => cell.getValue())); // Kreiraj matricu vrednosti
        console.log(boardWithValues); 
    }
    
    return {getBoard, placeXOrO, printBoard};
}

function GameController(playerOne, playerTwo) { //game flow object
    const board = GameBoard();

    const players = [ //object array for players
        {
            name: playerOne,
            token: 1
        },
        {
            name: playerTwo,
            token: 2
        }
    ];

    let activePlayer = players[0]; //which player is on turn
    function switchPlayerTurn() {
        if (activePlayer == players[0]) {
            activePlayer = players[1];
        }
        else {
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

    function playRound(row, column) {
        console.log("Playing round.");
        board.placeXOrO(row, column, getActivePlayer().token);

        switchPlayerTurn();
        printNewRound();
    }
    return {playRound, getActivePlayer};
}

const game = GameController("Alice", "Bob");
game.playRound(0, 0);
game.playRound(1, 1);
