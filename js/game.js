let actions = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",];

function resolve(depth = 6) {
    let currentState = game.getCurrentState();

    if (currentState.isGameOver || currentState.maxTile === 2048) {
        return;
    }

    let action = min_max(currentState.grid, depth, smoothness);
    gameBoard.update(game.update(actions[action.move]));
}

function min_max(gameState, depth, evalFunc, minimizing = false, alpha = -Infinity, beta = Infinity) {

    if (depth === 0) {
        return { move: null, score: evalFunc(gameState) };
    }
    else if (game.isGameOver(gameState)) {
        return { move: null, score: -Infinity };
    }

    let bestMove = null
    let bestScore = minimizing ? Infinity : -Infinity;

    if (!minimizing) {
        //console.log(("MAXIMIZING"));

        let childs = expandMaximizing(gameState);

        bestMove = childs[0].move;

        for (let i = 0; i < childs.length; i++) {
            let tmp = min_max(childs[i].state, depth - 1, evalFunc, !minimizing, alpha, beta);

            /*
            console.log("Minimizing: ", minimizing);
            console.log("Best Score: ", bestScore);
            console.log("Best Move:", bestMove);
            */

            if (tmp.score > bestScore) {
                bestScore = tmp.score;
                bestMove = childs[i].move;
            }

            alpha = Math.max(alpha, tmp.score);

            if (beta <= alpha) {
                break;
            }
        }
    }
    else {
        //console.log(("MINIMIZING"));

        let childs = expandMinimizing(gameState);

        bestMove = childs[0].move;

        for (let i = 0; i < childs.length; i++) {
            let tmp = min_max(childs[i].state, depth - 1, evalFunc, !minimizing, alpha, beta);

            /*
            console.log("Minimizing: ", minimizing);
            console.log("Best Score: ", bestScore);
            console.log("Best Move:", bestMove);
            */

            if (tmp.score < bestScore) {
                bestScore = tmp.score;
                bestMove = childs[i].move;
            }

            beta = Math.min(beta, tmp.score);

            if (beta <= alpha) {
                break;
            }
        }

    }

    return { move: bestMove, score: bestScore };
}

function expandMaximizing(gameState) {
    //espansione nodo
    let childs = [];

    let stateCopy = JSON.parse(JSON.stringify(gameState));
    if (game.left(stateCopy)) {
        childs.push({ move: 0, state: stateCopy });
    }

    stateCopy = JSON.parse(JSON.stringify(gameState));
    if (game.right(stateCopy)) {
        childs.push({ move: 1, state: stateCopy });
    }

    stateCopy = JSON.parse(JSON.stringify(gameState));
    if (game.up(stateCopy)) {
        childs.push({ move: 2, state: stateCopy });
    }

    stateCopy = JSON.parse(JSON.stringify(gameState));
    if (game.down(stateCopy)) {
        childs.push({ move: 3, state: stateCopy });
    }

    return childs;
}

function expandMinimizing(gameState) {
    //espansione nodo
    let childs = [];

    let emptyCells = game.getEmptyCells(gameState);

    for (let i = 0; i < emptyCells.length; i++) {
        let stateCopy = JSON.parse(JSON.stringify(gameState));
        stateCopy[emptyCells[i].row][emptyCells[i].col] = 2;
        childs.push({ move: i, state: stateCopy });
    }

    for (let i = 0; i < emptyCells.length; i++) {
        let stateCopy = JSON.parse(JSON.stringify(gameState));
        stateCopy[emptyCells[i].row][emptyCells[i].col] = 4;
        childs.push({ move: (emptyCells.length + i), state: stateCopy });
    }


    return childs;
}

function smoothness(gameState) {
    let smoothnessScore = 0;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameState[i][j] !== 0) {
                let currentValue = Math.log2(gameState[i][j]);

                // Check the neighboring cells to the right
                if (j < 3 && gameState[i][j + 1] !== 0) {
                    let neighborValue = Math.log2(gameState[i][j + 1]);
                    smoothnessScore -= Math.abs(currentValue - neighborValue);
                }

                // Check the neighboring cells below
                if (i < 3 && gameState[i + 1][j] !== 0) {
                    let neighborValue = Math.log2(gameState[i + 1][j]);
                    smoothnessScore -= Math.abs(currentValue - neighborValue);
                }
            }
        }
    }

    return smoothnessScore;
}

function monotonicity(gameState) {
    let monoScore = 0;

    // Check the rows for monotonicity
    for (let i = 0; i < 4; i++) {
        let row = gameState[i];
        let increasing = true;
        let decreasing = true;
        for (let j = 1; j < 4; j++) {
            if (row[j] > row[j - 1]) {
                decreasing = false;
            } else if (row[j] < row[j - 1]) {
                increasing = false;
            }
        }
        if (increasing || decreasing) {
            monoScore++;
        }
    }

    // Check the columns for monotonicity
    for (let j = 0; j < 4; j++) {
        let column = [gameState[0][j], gameState[1][j], gameState[2][j], gameState[3][j]];
        let increasing = true;
        let decreasing = true;
        for (let i = 1; i < 4; i++) {
            if (column[i] > column[i - 1]) {
                decreasing = false;
            } else if (column[i] < column[i - 1]) {
                increasing = false;
            }
        }
        if (increasing || decreasing) {
            monoScore++;
        }
    }

    return monoScore;
}