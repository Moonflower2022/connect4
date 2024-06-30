class Connect4 {
	constructor(cols, rows, width, height, botPlayer, botDepth) {
		this.cols = cols
		this.rows = rows
		this.width = width
		this.height = height
		this.rectSize = {
			x: this.width / this.cols,
			y: this.height / this.rows
		}
		this.turn = true
		this.isOver = false
		this.gameoverText = null
		this.showGameover = true
		// bool, true is p1, false is p2
		this.botPlayer = botPlayer
		this.botDepth = botDepth
		this.board = []
		//p1 token is true, p2 token is false
		for (let y = 0; y < rows; y++) {
			this.board[y] = []
			for (let x = 0; x < cols; x++) {
				this.board[y][x] = null
			}
		}
	}
	inBoard(x, y) {
		return 0 <= x && x < this.cols && 0 <= y && y < this.rows
	}
	lowestAvailableSpace(x) {
		for (let y = 0; y < this.rows; y++) {
			if (this.board[y][x] != null) {
				return y - 1
			} else if (y === this.rows - 1) {
				return this.rows - 1
			}
		}
	}
	moveIsValid(x) {
		if (this.board[0][x] === null) {
			return true
		}
		return false
	}
	move(x) {
		this.board[this.lowestAvailableSpace(x)][x] = this.turn
		this.turn = !this.turn
	}
	undoMove(x) {
		this.board[this.lowestAvailableSpace(x) + 1][x] = null
		this.turn = !this.turn
	}
	botMove() {
		let move = minimax(this.botDepth, this.botDepth, this, this.botPlayer, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)[1]
		this.move(move)
		return move
	}
	generateMoves() {
		let ret = []
		for (let x = 0; x < this.cols; x++) {
			if (this.moveIsValid(x)) {
				ret.push(x)
			}
		}
		return ret
	}
	over(lastMoveX) {
		let center = {
			x: lastMoveX,
			y: this.lowestAvailableSpace(lastMoveX) + 1
		}
		for (let i = 0; i < 4; i++) {
			if (
				this.inBoard(center.x, center.y - i) &&
				this.inBoard(center.x, center.y - i + 3) &&
				checkLine(this.board[center.y - i][center.x],
					this.board[center.y - i + 1][center.x],
					this.board[center.y - i + 2][center.x],
					this.board[center.y - i + 3][center.x])
			) {
				return [true, this.board[center.y][center.x], [
					[center.x, center.y - i], 
					[center.x, center.y - i + 1], 
					[center.x, center.y - i + 2], 
					[center.x, center.y - i + 3]
				]]
			}
		}
		for (let i = 0; i < 4; i++) {
			if (
				this.inBoard(center.x - i, center.y + i) &&
				this.inBoard(center.x - i + 3, center.y + i - 3) &&
				checkLine(this.board[center.y + i][center.x - i],
					this.board[center.y + i - 1][center.x - i + 1],
					this.board[center.y + i - 2][center.x - i + 2],
					this.board[center.y + i - 3][center.x - i + 3])
			) {
				return [true, this.board[center.y][center.x], [
					[center.x - i, center.y + i], 
					[center.x - i + 1, center.y + i - 1], 
					[center.x - i + 2, center.y + i - 2], 
					[center.x - i + 3, center.y + i - 3]
				]]
			}
		}
		for (let i = 0; i < 4; i++) {
			if (
				this.inBoard(center.x - i, center.y) &&
				this.inBoard(center.x - i + 3, center.y) &&
				checkLine(
					this.board[center.y][center.x - i],
					this.board[center.y][center.x - i + 1],
					this.board[center.y][center.x - i + 2],
					this.board[center.y][center.x - i + 3]
				)
			) {
				return [true, this.board[center.y][center.x], [
					[center.x - i, center.y], 
					[center.x - i + 1, center.y], 
					[center.x - i + 2, center.y], 
					[center.x - i + 3, center.y]
				]]
			}
		}
		for (let i = 0; i < 4; i++) {
			if (
				this.inBoard(center.x - i, center.y - i) &&
				this.inBoard(center.x - i + 3, center.y - i + 3) &&
				checkLine(
					this.board[center.y - i][center.x - i],
					this.board[center.y - i + 1][center.x - i + 1],
					this.board[center.y - i + 2][center.x - i + 2],
					this.board[center.y - i + 3][center.x - i + 3])
			) {
				return [true, this.board[center.y][center.x], [
					[center.x - i, center.y - i], 
					[center.x - i + 1, center.y - i + 1], 
					[center.x - i + 2, center.y - i + 2], 
					[center.x - i + 3, center.y - i + 3]
				]]
			}
		}
		for (let row of this.board) {
			if (!row.every(x => x != null)) {
				return [false, null]
			}
		}
		return [true, null, null]
	}
	getColumn(mouseX) {
		return Math.floor(mouseX / this.rectSize.x)
	}
}