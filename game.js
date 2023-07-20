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
const p1Color = "rgb(246, 26, 26)"
const p2Color = "rgb(246, 231, 26)"
const emptyColor = "rgb(215, 215, 215)"
const topLeft = { x: (window.innerWidth - GAMEWIDTH) / 2, y: (window.innerHeight - GAMEHEIGHT - 100) / 2 }
const bottomRight = { x: (window.innerWidth + GAMEWIDTH) / 2, y: (window.innerHeight + GAMEHEIGHT - 100) / 2 }

let game = new Connect4(7, 6, GAMEWIDTH, GAMEHEIGHT, p1Color, p2Color, false, 9)

document.addEventListener("click", function (event) {
  if (event.button === 0 && isWithin(event.pageX, event.pageY, topLeft.x, topLeft.y, bottomRight.x, bottomRight.y)) {
    if (game.turn && game.moveIsValid(game.clickColumn(event.pageX - topLeft.x)) && !game.isOver) {
      let x = game.clickColumn(event.pageX - topLeft.x)
      game.move(x)
      if (game.over(x)[0]){
        console.log(game.over(x))
        game.isOver = true
        game.gameoverText = (game.over(x)[1] && !game.botPlayer) || 
      (game.over(x)[1] === false && game.botPlayer) ? "You Win!" : 
      (game.over(x)[1] && game.botPlayer) || 
      (game.over(x)[1] === false && !game.botPlayer) ? "You Lose! :(" : 
      "It's a tie!"
      } else {
        let x = game.botMove()
        if (game.over(x)[0]){
          console.log(game.over(x))
          game.isOver = true
          game.gameoverText = (game.over(x)[1] && !game.botPlayer) || 
      (game.over(x)[1] === false && game.botPlayer) ? "You Win!" : 
      (game.over(x)[1] && game.botPlayer) || 
      (game.over(x)[1] === false && !game.botPlayer) ? "You Lose! :(" : 
      "It's a tie!"
        }
      }
    } 
    if (game.isOver){
      game.showGameover = !game.showGameover
    }
  }
});

function resetGame(){

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
        drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 40, emptyColor)
      } else if (game.board[y][x] === true) {
        drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 40, p1Color)
      } else if (game.board[y][x] === false) {
        drawCircle((x + 1 / 2) * game.rectSize.x, (y + 1 / 2) * game.rectSize.y, 40, p2Color)
      }
    }
  }
  if (game.isOver && game.showGameover){
    ctx.fillStyle = gameoverColor;
    ctx.fillRect(game.rectSize.x * 1.5, game.rectSize.x * 1.2, game.rectSize.x * 4, game.rectSize.x * 3.6)
    ctx.font = "48px oswald";
    ctx.fillStyle = "black";
    ctx.fillText(game.gameoverText, game.rectSize.x*(2.1), game.rectSize.x*3);
  }
}
draw()
