let timeoutID = null;

document.addEventListener('keydown', (event) => {
    let code = event.code;

    event.preventDefault();

    if (code == "KeyP") { //Pause resolution
        clearTimeout(timeoutID);
        timeoutID = null;

        return;
    }

    // if resolution is not in progress
    if (timeoutID === null) {

        // start resolution
        if (code == "KeyS") {
            (function loop() {
                timeoutID = setTimeout(() => {
                    resolve();
                    loop()
                }, 10)

            })();
        }
        else if (code === "KeyX") { // undo last move
            gameBoard.update(game.update("Undo"));
        }
        else {
            gameBoard.update(game.update(code));
        }
    }
});

document.getElementById("newGame").addEventListener("click", () => {

    // if the resolution is in progress it is stopped
    if(timeoutID !== null){
        clearTimeout(timeoutID);
        timeoutID = null;
    }
    
    gameBoard.update(game.update("NewGame"));
});

document.getElementById("undo").addEventListener("click", () => {
    gameBoard.update(game.update("Undo"));
});