/*----- constants -----*/
const beginnerSize = {
    row: 9,
    column: 9, 
}

const intermediateSize = {
    row: 16,
    column: 16
}

const expertSize = {
    row: 16,
    column: 30
}

const level = {
    beginner: 10,
    intermediate: 40,
    expert: 99,
}

const offsetDirection = {
    N:  [-1,  0],
    NW: [-1, -1],
    W:  [ 0, -1],
    SW: [ 1, -1],
    S:  [ 1,  0],
    SE: [ 1,  1],
    E:  [ 0,  1],
    NE: [-1,  1]
}

const mineStatus = {
    mine: -3,
    flaged: -2,
    unopened: -1,
    zeroMine: 0,
    oneMine: 1,
    twoMine: 2,
    threeMine: 3,
    fourMine: 4,
    fiveMine: 5,
    sixMine: 6,
    sevenMine: 7,
    eightMine: 8
}

const mineSize = 25;

/*----- state variables -----*/
const state = {
    size: null,
    level: null,
    mines: [],
};

/*----- cached elements  -----*/
const minesEl = document.querySelector(".mines");

/*----- event listeners -----*/


/*----- functions -----*/
const init = function() {
    state.size = beginnerSize;
    state.level = level.beginner;
    setMinesSize();
    createMinesArray(state.size);
    allocateMines();
    render();
}

// Set the minesEl's width and height
const setMinesSize = function() {
    minesEl.style.width = `${mineSize * state.size.column}px`
    minesEl.style.height = `${mineSize * state.size.row}px`
}

// Based on the size of game, create the array
const createMinesArray = function(size) {
    const row = size.row;
    const column = size.column;
    for (let i = 0; i < row; i++) {
        const emptyRow = [];
        state.mines.push(emptyRow);
        for (let j = 0; j < column; j++) {
            state.mines[i][j] = mineStatus.zeroMine;    // set initial mine
        }
    }
}

// Randomly allocate the mines into the array
const allocateMines = function() {
    const level = state.level;
    let count = 0;
    while (count != level) {
        const row = Math.floor(Math.random() * 9);
        const column = Math.floor(Math.random() * 9);
        // if the target is not mine, set it to mine
        if (state.mines[row][column] !== mineStatus.mine) {
            state.mines[row][column] = mineStatus.mine;
            count++;
        } else {
            continue;
        }
    }
    console.log(state.mines);
}

// Calculate nearby mines based on the given location
const calculateNearbyMines = function(row, column) {
    let minesNearby = 0;
    const mines = state.mines;
    // If the given location is a mine, return 
    if (mines[row][column] === mineStatus.mine) {
        return mineStatus.mine;
    }
    // calculate nearby mines by checking the nearby location with differect direction 
    for (const direction in offsetDirection) {
        const targetRow = row + direction[0];
        const targetColumn = column + direction[1];
        // If the target location is not out of the index boundary
        // and is a mine, increase count number
        if (mines[targetRow][targetColumn] !== undefined &&
            mines[targetRow][targetColumn] === mineStatus.mine) {
                minesNearby++
        }
    }
    return minesNearby;
}

const modifyMinesArray = function() {
    const row = state.size.row;
    const column = state.size.column;
    const mines = state.mines;
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            mines[i][j] = calculateNearbyMines(i, j);
        }
    }
}

// Render all the content
const render = function() {
    const row = state.size.row;
    const column = state.size.column;
    for (let i = 0; i < row; i++) {
        const eachRowEl = document.createElement("div");
        eachRowEl.style.display = "flex";
        eachRowEl.classList.add("mine-row");
        eachRowEl.classList.add(`row-${i}`);
        for (let j = 0; j < column; j++) {
            const mineEl = document.createElement("div");
            mineEl.classList.add("unopened");
            mineEl.id = `${i}-${j}`;
            eachRowEl.appendChild(mineEl)   // append to the row element
        }
        minesEl.appendChild(eachRowEl);     // append to the mines element
    }
}

init();