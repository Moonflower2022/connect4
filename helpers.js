function isWithin(x, y, topX, topY, bottomX, bottomY) {
    return bottomX > x && x > topX && bottomY > y && y > topY
}

function checkLine(a, b, c, d) {
    // Check first element non-zero and all elements match
    return ((a != null) && (a === b) && (a === c) && (a === d));
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
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