// make a button to customize who goes first

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const GAMEWIDTH = 700
const GAMEHEIGHT = 600
ctx.canvas.width = GAMEWIDTH;
ctx.canvas.height = GAMEHEIGHT + 100;

const gameBackgroudColor = "rgb(28,98,241)"
const backgroundColor = "rgb(225, 225, 225)"
const gameoverColor = "rgb(66,241,84)"
const highlightColor = "rgb(0, 230, 255)"
const displayP1Color = "rgb(241, 115, 115)"
const p1Color = "rgb(246, 26, 26)"
const p2Color = "rgb(246, 231, 26)"
const emptyColor = "rgb(215, 215, 215)"
const topLeft = { x: (window.innerWidth - GAMEWIDTH) / 2, y: (window.innerHeight - GAMEHEIGHT - 100) / 2 }
const bottomRight = { x: (window.innerWidth + GAMEWIDTH) / 2, y: (window.innerHeight + GAMEHEIGHT - 100) / 2 }
const searchDepth = 10

let startAs = localStorage.getItem("start") ? localStorage.getItem("start") : "red"
console.log(startAs)
let game = startAs === "red" ? new Connect4(7, 6, GAMEWIDTH, GAMEHEIGHT, false, searchDepth) : new Connect4(7, 6, GAMEWIDTH, GAMEHEIGHT, true, searchDepth)

let lastMove;
let drawCol;
let moveBuffer;
let winningFour;

document.addEventListener("click", function (event) {
  if (event.button === 0 && isWithin(event.pageX, event.pageY, topLeft.x, topLeft.y, bottomRight.x, bottomRight.y)) {
    if (game.isOver) {
      game.showGameover = !game.showGameover
    }
    if ((game.turn != game.botPlayer) && game.moveIsValid(game.getColumn(event.pageX - topLeft.x)) && !game.isOver) {
      var playerX = game.getColumn(event.pageX - topLeft.x)
      game.move(playerX)
      lastMove = playerX
      moveBuffer = 1
      if (game.over(playerX)[0]) {
        game.isOver = true
        winningFour = game.over(playerX)[2]
        game.gameoverText = (game.over(playerX)[1] && !game.botPlayer) ||
          (game.over(playerX)[1] === false && game.botPlayer) ? "You Win!" :
          (game.over(playerX)[1] && game.botPlayer) ||
            (game.over(playerX)[1] === false && !game.botPlayer) ? "You Lose! :(" :
            "It's a tie!"
      }
    }
  }
});

document.onmousemove = function (event) {
  drawCol = game.getColumn(getMousePos(canvas, event).x)
}

document.querySelector(".redbutton").addEventListener("click", function (){
  localStorage.setItem("start", "red")
})
document.querySelector(".yellowbutton").addEventListener("click", function (){
  localStorage.setItem("start", "yellow")
})

if (game.botPlayer === true){
  moveBuffer = 1
}

function drawCircle(x, y, radius, fill, stroke, strokeWidth) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    ctx.stroke()
  }
}
function draw() {
  requestAnimationFrame(draw)
  ctx.fillStyle = gameBackgroudColor;
  ctx.fillRect(0, 0, GAMEWIDTH, GAMEHEIGHT);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, GAMEHEIGHT, GAMEWIDTH, GAMEHEIGHT + 100);
  ctx.font = "20px oswald";
  ctx.fillStyle = "black"
  ctx.fillText("Click on the columns to insert a marker. Four in a row diagonally, horizontally, ", 35, GAMEHEIGHT + 40)
  ctx.fillText("or vertically wins. The bot will play fast, so be ready! Reload to play again :)", 45, GAMEHEIGHT + 80)
  for (let y = 0; y < game.rows; y++) {
    for (let x = 0; x < game.cols; x++) {
      if (game.board[y][x] === null) {
        if (x === drawCol && y === game.lowestAvailableSpace(drawCol) && !game.isOver) {
          drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 40, displayP1Color)
        } else {
          drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 40, emptyColor)
        }
      } else if (game.board[y][x] === !game.botPlayer) {
        if (x === lastMove && y === game.lowestAvailableSpace(lastMove) + 1) {
          drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 40, highlightColor)
          drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 35, p1Color)
        } else {
          drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 40, p1Color)
        }
      } else if (game.board[y][x] === game.botPlayer) {
        if (x === lastMove && y === game.lowestAvailableSpace(lastMove) + 1) {
          drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 40, highlightColor)
          drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 35, p2Color)
        } else {
          drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 40, p2Color)
        }
      }
    }
  }
  if (game.isOver && winningFour){
    ctx.storkeStyle = "rgb(0, 0, 0)"
    ctx.lineWidth = "8"
    ctx.beginPath(); 
    ctx.moveTo((winningFour[0][0] + 1/2) * game.rectSize.x, (winningFour[0][1] + 1/2) * game.rectSize.y);
    ctx.lineTo((winningFour[3][0] + 1/2) * game.rectSize.x, (winningFour[3][1] + 1/2) * game.rectSize.y);
    ctx.stroke()
    // for (let pos of winningFour){
    //   if (game.board[pos[1]][pos[0]]){
    //     drawCircle((pos[0] + 1 / 2) * game.rectSize.x, (pos[1] + 1 / 2) * game.rectSize.y, 40, highlightedP1Color)
    //   } else {
    //     drawCircle((pos[0] + 1 / 2) * game.rectSize.x, (pos[1] + 1 / 2) * game.rectSize.y, 40, highlightedP2Color)
    //   }
    // }
  }
  if (game.isOver && game.showGameover) {
    ctx.fillStyle = gameoverColor;
    ctx.fillRect(game.rectSize.x * 1.5, game.rectSize.x * 1.2, game.rectSize.x * 4, game.rectSize.x * 3.6)
    ctx.font = "48px oswald";
    ctx.fillStyle = "black";
    ctx.fillText(game.gameoverText, game.rectSize.x * (2.2), game.rectSize.x * 3);
    ctx.font = "32px oswald";
    ctx.fillText("Click to hide", game.rectSize.x * (2.5), game.rectSize.x * 4);
  }
  if (game.turn === game.botPlayer && moveBuffer === 0) {
    var botX = game.botMove()
    lastMove = botX
    if (game.over(botX)[0]) {
      game.isOver = true
      winningFour = game.over(botX)[2]
      game.gameoverText = (game.over(botX)[1] && !game.botPlayer) ||
        (game.over(botX)[1] === false && game.botPlayer) ? "You Win!" :
        (game.over(botX)[1] && game.botPlayer) ||
          (game.over(botX)[1] === false && !game.botPlayer) ? "You Lose! :(" :
          "It's a tie!"
    }
  }
  if (moveBuffer > 0){
    moveBuffer --
  }
}

draw()