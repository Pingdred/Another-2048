"use strict";
 
/**
 * 
 * @typedef {Object} MaxTile
 * @property {number} value - The tile value.
 * @property {number} row - The column index of the tile.
 * @property {number} column - The row index of the  tile.
 *
 * @typedef {Object} GameState
 * @property {Array<Array<number>>} grid - The current game grid.
 * @property {Array<Array<number>>} prevGrid - The previous game grid.
 * @property {number} score - The game score.
 * @property {MaxTile} maxTile - An object with 'value', 'row' and 'column' properties representing the tile with the highest value. 
 * @property {boolean} gameOver - True if no more action can be taken, false otherwise.
 */

/**
 * GameEngine for the game 2048
 * @class
 */
class GameEngine {

    #grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    #maxStateHistoryLength = 3
    #stateHistory = [];

    /**
     * @constructor
     * @param {number} stateHistoryLength - The max states history lenght.
     */
    constructor(stateHistoryLength = 3) {
        this.#maxStateHistoryLength = stateHistoryLength;
        this.#newGame();
    }

    /**
     * Start new game.
     */
    #newGame() {
        this.#grid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        this.#stateHistory = [];

        this.randomTile(this.#grid);
        this.randomTile(this.#grid);
    }

    /**
     * @param {Array<Array<number>>} grid - The game grid.
     * @returns {boolean} - False if the grid rappresent a game over, True otherwise.
     */
    #historyPush(grid) {

        if (this.isGameOver(grid)) {
            return false;
        }

        if (this.#stateHistory.length === this.#maxStateHistoryLength) {
            this.#stateHistory.shift();
        }

        this.#stateHistory.push(grid);

        return true;
    }

    /**
     * Remove the last element of the state hystory and set as current gamse state.
     * @returns {boolean} True if the state hystory is not empty, False otherwise
     */
    #historyPop() {
        if (this.#stateHistory.length === 0) {
            return false;
        }

        this.#grid = this.#stateHistory.pop();

        return true;
    }

    /**
     * @returns {Array<Array<number>>} The previous game state grid.
     */
    #getHistoryLastElement() {
        return this.#stateHistory[this.#stateHistory.length - 1];
    }

    /**
     * Flip the grid.
     * @param {Array<Array<number>>} grid - The game grid.
     */
    #flipGrid(grid) {
        for (let i = 0; i < grid.length; i++) {
            grid[i] = grid[i].reverse();
        }
    }

    /**
     * Swap the rows and columns of the grid.
     * 
     * @param {Array<Array<number>>} grid - The game grid.
     */
    #transposeGrid(grid) {
        for (let i = 0; i < grid.length; i++) {
            for (let j = i; j < grid.length; j++) {
                let tmp = grid[i][j];
                grid[i][j] = grid[j][i];
                grid[j][i] = tmp;
            }
        }
    }

    /**
     * Swipe and merge tiles to left
     * 
     * @param {Array<Array<number>>} grid - The game grid.
     * @returns {boolean} True if the grid has changed, False otherwise.
     */
    #swipeLeft(grid) {
        let oldGrid = JSON.stringify(grid);

        for (let i = 0; i < grid.length; i++) {

            //remove empty tiles
            let elements = grid[i].filter(num => num !== 0);

            //merge tiles
            for (let j = 0; j < elements.length - 1; j++) {
                if (elements[j] === elements[j + 1]) {
                    elements[j] *= 2;
                    elements[j + 1] = 0;
                }
            }

            //remove empty tiles
            elements = elements.filter(num => num !== 0);

            let fill = [];
            for (let h = 0; h < (grid.length - elements.length); h++) {
                fill.push(0);
            }

            grid[i] = elements.concat(fill);
        }

        return (JSON.stringify(grid) !== oldGrid);
    }

    /**
     * Set the max history length
     * 
     * @param {Array<Array<number>>} grid - The max history length.
     */
    setHistoryLimit(limit) {

        if (limit <= 1) {
            return false;
        }

        this.#maxStateHistoryLength = limit;
        return true;
    }

    /**
     * @returns {GameState} A game state with properties 'grid', 'prevGrid', 'score', 'maxTile', 'gameOver'.
     */
    getCurrentState() {

        return {
            grid: this.#grid,
            prevGrid: this.#getHistoryLastElement(),
            score: this.getScore(this.#grid),
            maxTile: this.getMaxTile(this.#grid),
            gameOver: this.isGameOver(this.#grid)
        };

    }

    /**
     * Perform the action on the internal game grid and update the state history.
     * 
     * @param {Array<Array<number>>} action - The action to perform, the accepted ones are ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Undo, NewGame.
     * @returns {GameState} The nwe game state with properties 'grid', 'prevGrid', 'score', 'maxTile', 'gameOver'.
     */
    update(action) {

        let newState = false;
        let oldGrid = JSON.stringify(this.#grid);

        switch (action) {

            case "ArrowLeft":
                newState = this.left(this.#grid);
                break;

            case "ArrowRight":
                newState = this.right(this.#grid);
                break;

            case "ArrowUp":
                newState = this.up(this.#grid);
                break;

            case "ArrowDown":
                newState = this.down(this.#grid);
                break;

            case "Undo":
                this.#historyPop();
                break;

            case "NewGame":
                this.#newGame();
                break;

        }

        if (newState) {
            this.randomTile(this.#grid);
            this.#historyPush(JSON.parse(oldGrid));
        }

        return this.getCurrentState();
    }

    /**
     * @param {Array<Array<number>>} grid - The game grid.
     * @returns {Array<object>} An array containing an object with properties row and column, indicating the row and column of the empty cell.
     */
    getEmptyCells(grid) {
        let emptyCells = [];

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                if (grid[i][j] === 0) {
                    emptyCells.push({ row: i, column: j });
                }
            }
        }

        return emptyCells;
    }

    /**
     * Add two random tiles to the grid, 
     * the tiles have a 90 percent chance of having value 2 
     * and 10 percent chance of having value 4.
     * 
     * @param {Array<Array<number>>} grid - The game grid.
     * @returns {boolean} True if the grid is not full, False otherwise.
     */
    randomTile(grid) {

        let emptyCells = this.getEmptyCells(grid);

        if (emptyCells.length <= 0) {
            return false;
        }

        let index = Math.floor(Math.random() * (emptyCells.length));
        let cell = emptyCells[index]
        let value = Math.random() < 0.9 ? 2 : 4;

        grid[cell.row][cell.column] = value;

        return true;
    }

    /**
     * Swipe and merge tiles left
     * 
     * @param {Array<Array<number>>} grid - The game grid.
     * @returns {boolean} True if the grid has changed, False otherwise.
     */
    left(grid) {
        return this.#swipeLeft(grid);
    }

    /**
     * Swipe and merge tiles right
     * 
     * @param {Array<Array<number>>} grid - The game grid.
     * @returns {boolean} True if the grid has changed, False otherwise.
     */
    right(grid) {
        //Rotate 180 degrees 
        this.#flipGrid(grid);

        let res = this.#swipeLeft(grid);

        //Rotate 180 degrees
        this.#flipGrid(grid);

        return res;
    }

    /**
     * Swipe and merge tiles up
     * 
     * @param {Array<Array<number>>} grid - The game grid.
     * @returns {boolean} True if the grid has changed, False otherwise.
     */
    up(grid) {

        //Rotate 90 degrees 
        this.#transposeGrid(grid);

        let res = this.#swipeLeft(grid);

        //Rotate 270 degrees
        this.#transposeGrid(grid);

        return res;
    }

    /**
     * Swipe and merge tiles down
     * 
     * @param {Array<Array<number>>} grid - The game grid.
     * @returns {boolean} True if the grid has changed, False otherwise.
     */
    down(grid) {

        //Rotate 270 degrees
        this.#transposeGrid(grid);
        this.#flipGrid(grid);

        let res = this.#swipeLeft(grid);

        //Rotate 90 degrees
        this.#flipGrid(grid);
        this.#transposeGrid(grid);

        return res;
    }

    /**
     * Calculate the sum of the tiles values on the grid.
     * 
     * @param {Array<Array<number>>} grid - The game grid.
     * @returns {number} Return the sum of the tiles values on the grid.
     */
    getScore(grid) {

        let score = 0;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                score += grid[i][j];
            }
        }

        return score;
    }

    /**
     * @returns {maxTile} An object with properties 'value', 'row' and 'column'.
     */
    getMaxTile(grid) {
        let maxTile = 0;
        let row = 0;
        let col = 0;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {

                if (grid[i][j] > maxTile) {
                    maxTile = grid[i][j];
                    row = i;
                    col = j;
                }

            }
        }

        return { value: maxTile, row: row, column: col };
    }

    /**
     * @returns {boolean} True if no more action can be taken, false otherwise.
     */
    isGameOver(grid) {

        let grid_JSON = JSON.stringify(grid);

        return !(this.left(JSON.parse(grid_JSON)) || this.right(JSON.parse(grid_JSON)) || this.down(JSON.parse(grid_JSON)) || this.up(JSON.parse(grid_JSON)));
    }

}