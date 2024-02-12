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

const mineNum = {
    beginner: 10,
    intermediate: 40,
    expert: 99,
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
    mines: [],
};

/*----- cached elements  -----*/
const minesEl = document.querySelector(".mines");

/*----- event listeners -----*/


/*----- functions -----*/
const init = function() {
    state.size = beginnerSize;
    setMinesSize()
    createMines(state.size);
    render();
}

const setMinesSize = function() {
    minesEl.style.width = `${mineSize * state.size.column}px`
    minesEl.style.height = `${mineSize * state.size.row}px`
}

const createMines = function(size) {
    const row = size.row;
    const column = size.column;
    for (let i = 0; i < row; i++) {
        const emptyRow = [];
        state.mines.push(emptyRow);
        for (let j = 0; j < column; j++) {
            state.mines[i][j] = mineStatus.unopened;
        }
    }
}

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
            eachRowEl.appendChild(mineEl)
        }
        minesEl.appendChild(eachRowEl);
    }
}

init();