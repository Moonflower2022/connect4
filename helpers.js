function isWithin(x, y, topX, topY, bottomX, bottomY) {
    return bottomX > x && x > topX && bottomY > y && y > topY
}

function checkLine(a, b, c, d) {
    // Check first element non-zero and all elements match
    return ((a != null) && (a === b) && (a === c) && (a === d));
}



let evalBoard = [
    [3, 4, 5, 7, 5, 4, 3],
    [4, 6, 8, 10, 8, 6, 4],
    [5, 8, 11, 13, 11, 8, 5],
    [5, 8, 11, 13, 11, 8, 5],
    [4, 6, 8, 10, 8, 6, 4],
    [3, 4, 5, 7, 5, 4, 3]
]

function evaluate(game) {
    let sum = 0
    for (let y = 0; y < game.rows; y++) {
        for (let x = 0; x < game.cols; x++) {
            if (game.board[y][x] === true) {
                sum = sum + evalBoard[y][x];
            } else if (game.board[y][x] === false) {
                sum = sum - evalBoard[y][x];
            }
        }
    }
    return 138 + sum;
}

function minimax(originalDepth, depth, game, isMaximizingPlayer, alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY) {
    // Base case: evaluate board
    if (depth === 0) {
        return [evaluate(game), null]
    }
    // Recursive case: search possible moves
    var bestMove = null; // best move not set yet
    var possibleMoves = game.generateMoves().sort(() => Math.random() - 0.5);
    // Set a default best move value
    var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    // Search through all possible moves
    for (var i = 0; i < possibleMoves.length; i++) {
        var move = possibleMoves[i];
        // Make the move, but undo before exiting loop
        game.move(move);
        let value;
        let gameoverInfo = game.over(move)
        if (gameoverInfo[0]) {
            value = gameoverInfo[1] ? 1000*depth : gameoverInfo[1] === false ? -1000*depth : 0
        } else {
            value = minimax(originalDepth, depth - 1, game, !isMaximizingPlayer, alpha, beta)[0];
        }
        // Recursively get the value from this move


        if (isMaximizingPlayer) {
            // Look for moves that maximize position
            if (value > bestMoveValue) {
                bestMoveValue = value;
                bestMove = move;
            }
            alpha = Math.max(alpha, value);
        } else {
            // Look for moves that minimize position
            if (value < bestMoveValue) {
                bestMoveValue = value;
                bestMove = move;
            }
            beta = Math.min(beta, value);
        }
        // Undo previous move
        game.undoMove(move);
        // Check for alpha beta pruning
        if (beta <= alpha) {
            break;
        }
    }
    return [bestMoveValue, bestMove]
}