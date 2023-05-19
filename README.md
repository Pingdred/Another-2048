# 2048 Game

This repository contains a copy of the game 2048, originally created by Gabriele Cirulli (which is a copy of the 1024 game). The game is implemented in JavaScript and includes an implementation of the Minimax algorithm with Alpha-Beta pruning for solving the game. The Minimax algorithm utilizes the concept of monotonicity as the evaluation function.

## Minimax Algorithm with Alpha-Beta Pruning

The Minimax algorithm is a decision-making algorithm commonly used in two-player games. It is based on the concept of evaluating the possible future game states and making the move that leads to the best possible outcome for the player. In this implementation, the Minimax algorithm is enhanced with Alpha-Beta pruning, which is a technique that reduces the number of game states that need to be evaluated by cutting off branches that are determined to be less promising.

## State evaluation

In this implementation, the Minimax algorithm uses the concept of monotonicity as the evaluation function. Monotonicity refers to the trend of the values on the board to either increase or decrease along a specific direction (up, down, left, or right). The evaluation function assigns a higher score to game states where the board values exhibit a more pronounced monotonic trend, as it indicates better opportunities for merging tiles and reaching higher values.

## How to Play

The game is playable on [github-pages](https://sirius-0.github.io/2048/). Use the **arrow keys** on the keyboard to move the tiles in the corresponding direction (up, down, left, or right) and the **x** key to undo up to the third last move made.

To start the resolution, press the **s** key and the **p** key to pause it.

The game will continue until there are no possible moves left.