function remainingMoves(state) {
    let moveCount = 0
    for (let x = 0; x < 7; x++) {
        if (state[0][x] === null) {
            moveCount++
        }
    }
    return moveCount
}

function copyState(state) {
    const boardLength = state.length
    let newState = []
    for (let i = 0; i < boardLength; i++) {
        newState.push([])
        for (let j = 0; j < boardLength; j++) {
            newState[i].push(state[i][j])
        }
    }
    return newState
}

class Node {
    constructor(state, parent, color, terminated, moveMade) {
        this.state = state
        this.color = color // color means the color of the player that just moved
        this.parent = parent // null if root
        this.isLeaf = true
        this.children = []
        this.simulations = 0
        this.wins = 0
        this.remainingSquares = remainingSquares(state)
        this.terminated = terminated // false means no, number means the side that won (since no ties)
        this.moveMade = moveMade
    }

    isFullyExpanded = () => {
        return this.remainingSquares === this.children.length
    }

    chooseLeaf = () => {
        let currentNode = this

        while (!currentNode.isLeaf && currentNode.isFullyExpanded()) {
            currentNode = currentNode.bestUTC()
        }

        return currentNode
    }

    bestUTC = () => {
        const scores = this.children.map((child, i) => {
            return { index: i, value: child.UTC() }
        })

        let bestScore = 0
        let bestIndex
        for (let score of scores) {
            if (score.value > bestScore) {
                bestScore = score.value
                bestIndex = score.index
            }
        }
        return this.children[bestIndex]
    }

    UTC = () => {
        if (this.simulations === 0) {
            return 1000000
        }
        const ratio = this.wins / this.simulations
        const constant = Math.sqrt(2)
        const bonus = Math.sqrt(
            Math.log(this.parent.simulations) / this.simulations
        )
        return ratio + constant * bonus
    }

    simulate = () => {
        let state = copyState(this.state)
        let color = this.color
        while (!checkWinPath(state, color)) {
            let move = randomMove(state)
            color = oppositeColor(color)
            state[move[0]][move[1]] = color
        }
        return color
    }

    expand = (expansionCount) => {
        if (this.terminated !== false) {
            return this
        } else {
            for (let i = 0; i < expansionCount; i++) {
                this.addChild()
            }
            return this.children.random()
        }
    }

    addChild = () => {
        let newState = copyState(this.state)
        let move = randomMove(
            newState,
            this.children.map((child) => {
                return child.moveMade
            })
        )
        let newColor = oppositeColor(this.color)
        newState[move[0]][move[1]] = newColor

        let newNode = new Node(
            newState,
            this,
            newColor,
            checkWinPath(newState, newColor) ? newColor : false,
            move
        )
        this.children.push(newNode)
        this.isLeaf = false
    }

    backpropogate(result) {
        this.simulations++
        if (this.color === result) {
            this.wins++
        }
        if (this.parent) {
            this.parent.backpropogate(result)
        }
    }
}

function monteCarloTreeSearch(
    state,
    color,
    searchSeconds,
    simulationCount,
    expansionCount
) {
    let root = new Node(state, null, color, false, null)
    let end = Date.now() + searchSeconds * 1000
    let i = 0
    while (Date.now() < end) {
        let node = root.chooseLeaf()
        let simulationNode = node.expand(expansionCount)
        for (let j = 0; j < simulationCount; j++) {
            winningColor = simulationNode.simulate()
            simulationNode.backpropogate(winningColor)
        }
        i++
    }
    console.log(`ran for ${i} iterations`)

    root.children.sort((a, b) => {
        return b.wins / b.simulations - a.wins / a.simulations
    })
    return root.children[0].moveMade
}

function botMove(board, pastMoves, playerColor) {
    move = monteCarloTreeSearch(board, playerColor, 1, 1, 1)
    pastMoves.push([move[0], move[1], 1])
    board[move[0]][move[1]] = 1
}
