"use strict";

class GameBoard {

    #column = 0;
    #row = 0;

    #container = null;

    #score = 0;
    #isGameOver = false;
    #goal = 2048;
    #goalPassed = false;

    #grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    #acceptedKey = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyX"];

    constructor(containerId, row, column, state) {

        this.#row = row;
        this.#column = column;
        this.#container = document.getElementById(containerId);

        //Set grid size
        let root = document.querySelector(":root");
        root.style.setProperty("--row", this.#row.toString());
        root.style.setProperty("--column", this.#column.toString());

        let top = document.createElement("div");
        top.id = "game-board-top";

        //Score
        let score = document.createElement('p');
        score.className = "title";
        score.id = "score";

        top.appendChild(score);

        // Game container
        let game = document.createElement("div");
        game.id = "game";


        let bottom = document.createElement("div");
        bottom.id = "game-board-bottom";

        //New game button
        let newGameButton = document.createElement("button");
        newGameButton.type = "button";
        newGameButton.id = "newGame";
        newGameButton.innerHTML = "New Game";

        //Undo button
        let undoButton = document.createElement("button");
        undoButton.type = "button";
        undoButton.id = "undo";
        undoButton.innerHTML = "Undo";

        bottom.appendChild(newGameButton);
        bottom.appendChild(undoButton);

        this.#container.appendChild(top);
        this.#container.appendChild(game);
        this.#container.appendChild(bottom);

        // Win lose message
        let msg = document.createElement("p");
        msg.setAttribute("class", "title");

        let gameOver = document.createElement("div");
        gameOver.setAttribute("id", "gameFinished");
        gameOver.appendChild(msg);

        game.appendChild(gameOver);

        let newCell = null;

        for (let i = 0; i < this.#row; i++) {
            for (let j = 0; j < this.#column; j++) {
                newCell = document.createElement('div');
                newCell.setAttribute("class", "cell");
                newCell.setAttribute("id", `cell-${i}-${j}`);
                game.appendChild(newCell);
            }
        }

        this.update(state);
    }

    #drawGameBoard() {

        let newTile;
        let goalReached = false;


        document.getElementById("gameFinished").style.display = "none";

        for (let i = 0; i < this.#row; i++) {
            for (let j = 0; j < this.#column; j++) {

                let element = document.getElementById(`tile-${i}-${j}`);
                if (element) {
                    element.remove();
                }

                if (this.#grid[i][j] !== 0) {

                    if ((this.#grid[i][j] == this.#goal) && !this.#goalPassed) {
                        goalReached = true;
                    }

                    newTile = document.createElement("div");
                    newTile.setAttribute("class", `tile tile-${this.#grid[i][j]}`);
                    newTile.setAttribute("id", `tile-${i}-${j}`);
                    newTile.innerHTML = this.#grid[i][j].toString();
                    newTile.style.setProperty('--x', i.toString());
                    newTile.style.setProperty('--y', j.toString());

                    document.getElementById(`cell-${i}-${j}`).append(newTile);
                }
            }
        }

        document.getElementById("score").innerHTML = "Score: " + this.#score.toString();

        if (goalReached && !this.#goalPassed) {
            let gameOver = document.getElementById("gameFinished");
            gameOver.style.display = "flex";
            gameOver.getElementsByTagName('p')[0].innerHTML = "You Win!";
            this.#goalPassed = true;
        }
        else if (this.#isGameOver) {
            let gameOver = document.getElementById("gameFinished");
            gameOver.style.display = "flex";
            gameOver.getElementsByTagName('p')[0].innerHTML = "Game Over";
        }
    }

    update(state) {
        this.#grid = state.grid;
        this.#score = state.score;
        this.#isGameOver = state.isGameOver;

        this.#drawGameBoard();
    }
}