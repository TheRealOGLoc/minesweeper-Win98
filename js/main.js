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
    row: 20,
    column: 30
}

const level = {
    beginner: 10,
    intermediate: 30,
    expert: 100,
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
    mine: -1,
    zeroMine: 0,
    oneMine: 1,
    twoMine: 2,
    threeMine: 3,
    fourMine: 4,
    fiveMine: 5,
    sixMine: 6,
    sevenMine: 7,
    eightMine: 8,
}

const statusName = {
    unopened: "unopened",
    opened: "opened",
    flagged: "flagged",
    exploded: "exploded",
    flagMissed: "flagMissed",
    targetExploded: "targetExploded",
    pressing: "pressing",
}

const mineClassName = [
    "zeroMine",
    "oneMine",
    "twoMine",
    "threeMine",
    "fourMine",
    "fiveMine",
    "sixMine",
    "sevenMine",
    "eightMine",
    "mine"
]

const winStatus = {
    playing: 0,
    win: 1,
    lose: -1,
}

const mineSize = 10; // change the mineSize must change the size in css as well

/*----- state variables -----*/
const state = {
    size: null,
    level: null,
    mines: [],
    status: [],
    minesCreated: false,
    statusCreated: false,
    time: 0,
    win: null,
    firstClick: false,
};

/*----- cached elements  -----*/
const minesEl = document.querySelector(".mines");

/*----- functions -----*/
const init = function() {
    state.size = expertSize;
    state.level = level.expert;
    state.win = winStatus.playing;
    setMinesSize();
    createMinesArray(state.size);
    allocateMines(5, 5);
    modifyMinesArray();
    createInitialStatusArray(state.size);
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
            state.mines[i][j] = mineStatus.zeroMine;    // set initial mine to zero mine
        }
    }
}

// Randomly allocate the mines into the array
const allocateMines = function(firstRow, firstColumn) { 
    const level = state.level;
    let count = 0;
    while (count != level) {
        const row = Math.floor(Math.random() * state.size.row);
        const column = Math.floor(Math.random() * state.size.column);
        // if the target is not mine, set it to mine
        if (row === firstRow && column === firstColumn) {
            continue;
        } else if (state.mines[row][column] !== mineStatus.mine) {
            state.mines[row][column] = mineStatus.mine;
            count++;
        } 
    }
    state.minesCreated = true;
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
        const targetRow = row + offsetDirection[direction][0];
        const targetColumn = column + offsetDirection[direction][1];
        // If the target location is not out of the index boundary
        // and is a mine, increase count number
        if (mines[targetRow] !== undefined &&
            mines[targetRow][targetColumn] !== undefined &&
            mines[targetRow][targetColumn] === mineStatus.mine) {
                minesNearby++
        }
    }
    return minesNearby;
}

// Modify the mines array by using calculateNearbyMines 
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

// Create initial unopened status array
const createInitialStatusArray = function(size) {
    const row = size.row;
    const column = size.column;
    for (let i = 0; i < row; i++) {
        const emptyRow = [];
        state.status.push(emptyRow);
        for (let j = 0; j < column; j++) {
            state.status[i][j] = statusName.unopened;    // set initial mine
        }
    }
    state.statusCreated = true;
}

// Rend the mine field
const rendInitialMinesField = function() {
    const row = state.size.row;
    const column = state.size.column;
    for (let i = 0; i < row; i++) {
        const eachRowEl = document.createElement("div");
        eachRowEl.style.display = "flex";
        eachRowEl.classList.add("mine-row");
        for (let j = 0; j < column; j++) {
            const mineEl = document.createElement("div");
            mineEl.classList.add("unopened");
            mineEl.id = `${i}-${j}`;
            eachRowEl.appendChild(mineEl)   // append to the row element
        }
        minesEl.appendChild(eachRowEl);     // append to the mines element
    }
}

// Get target mine element with position
const getTargetElwithPosition = function(row, column) {
    return minesEl.children[row].children[column];
}

// Get target el's new status
const getTargetElNewStatus = function(row, column) {
    const index = state.mines[row][column];
    if (index !== -1) {
        return mineClassName[index];
    } else {
        return mineClassName[9];
    }
    
}

// Update the new status to the status array
const updateTargetElStatus = function(row, column, newStatus) {
    const status = state.status;
    status[row][column] = newStatus;
}

// Update the target el's class
const updateTargetElClassList = function(row, column) {
    const targetEl = getTargetElwithPosition(row, column);
    const newStatus = state.status[row][column];
    targetEl.className = "";
    targetEl.classList.add(newStatus);
}

// Open an cell
const openTargetCell = function(row, column) {
    const status = state.status[row][column];
    const cell = state.mines[row][column];
    // If the target cell is not a mine
    if (status === statusName.unopened && cell !== mineStatus.mine) {
        const newStatus = getTargetElNewStatus(row, column);
        updateTargetElStatus(row, column, newStatus);
        updateTargetElClassList(row, column);
        let scannedCell = [];
        openNearbyZeroMineCell(row, column, scannedCell);
        // if the target cell is a mine
    } else if (status === statusName.unopened && cell === mineStatus.mine) {
        const newStatus = statusName.targetExploded;
        updateTargetElStatus(row, column, newStatus);
        updateTargetElClassList(row, column);
        showAllMinesAndCheckFlag();
        changeWinningCondition(winStatus.lose);
    } 
}

const changeWinningCondition = function(condition) {
    state.win = condition;
}

// Count nearby flag number
const countNearbyFlagNum = function(row, column, mines) {
    let flagsNearbyNum = 0;
    for (const direction in offsetDirection) {
        const nearbyTargetRow = row + offsetDirection[direction][0];
        const nearbyTargetColumn = column + offsetDirection[direction][1];
        // If the target location is not out of the index boundary
        if (mines[nearbyTargetRow] !== undefined &&
            mines[nearbyTargetRow][nearbyTargetColumn] !== undefined) {
                const nearbyStatus = state.status[nearbyTargetRow][nearbyTargetColumn];
                if (nearbyStatus === statusName.flagged) {
                    flagsNearbyNum++;
            }
        }
    }
    return flagsNearbyNum;
}

// Open nearby none zero cell
const openNearbyNoneZeroCell = function(row, column, mines) {
    for (const direction in offsetDirection) {
        const nearbyTargetRow = row + offsetDirection[direction][0];
        const nearbyTargetColumn = column + offsetDirection[direction][1];
        // If the target location is not out of the index boundary
        if (mines[nearbyTargetRow] !== undefined &&
            mines[nearbyTargetRow][nearbyTargetColumn] !== undefined) {
                openTargetCell(nearbyTargetRow, nearbyTargetColumn);
        }
    }
}

// If the target cell is already opened and is not a zero mine
const openNearbyCell = function(row, column) {
    const mines = state.mines;
    const status = state.status[row][column];
    const minesNearbyNum = state.mines[row][column];
    // If the target cell is not a zero mine
    if (mineClassName.some(name => status !== mineClassName[0] && status !== mineClassName[9] && name === status)) {
        const flagsNearbyNum = countNearbyFlagNum(row, column, mines);
        if (flagsNearbyNum === minesNearbyNum) {
            openNearbyNoneZeroCell(row, column, mines);
        }
    }
}



// Open nearby zero mine cells, recursive function
const openNearbyZeroMineCell = function(row, column, scannedCell) {
    const mines = state.mines;
    const targetMine = mines[row][column];
    // If the target cell is not zero mine and it is in the scannedCell
    if (targetMine !== mineStatus.zeroMine || scannedCell.some(cell => cell[0] === row && cell[1] === column)) {
        // Imme return
        return;
    } 
    // Push it into the scannedCell to prevent exceeding maximum resursion depth
    scannedCell.push([row, column]);
    for (const direction in offsetDirection) {
        const nearbyTargetRow = row + offsetDirection[direction][0];
        const nearbyTargetColumn = column + offsetDirection[direction][1];
        // If the target location is not out of the index boundary
        if (mines[nearbyTargetRow] !== undefined &&
            mines[nearbyTargetRow][nearbyTargetColumn] !== undefined) {
                openTargetCell(nearbyTargetRow, nearbyTargetColumn);
                openNearbyZeroMineCell(nearbyTargetRow, nearbyTargetColumn, scannedCell);
        }
    }
}

// Show all mine and check is the flag is correct
const showAllMinesAndCheckFlag = function() {
    const mines = state.mines;
    const status = state.status;
    const size = state.size;
    for (let i = 0; i < size.row; i++) {
        for (let j = 0; j < size.column; j++) {
            const targetStatus = status[i][j];
            const targetMine = mines[i][j];
            if (targetMine === mineStatus.mine && targetStatus === statusName.unopened) {
                updateTargetElStatus(i, j, statusName.exploded);
                updateTargetElClassList(i, j);
            } else if (targetMine !== mineStatus.mine && targetStatus === statusName.flagged) {
                updateTargetElStatus(i, j, statusName.flagMissed);
                updateTargetElClassList(i, j);
            }
        }
    }
}

// Right click to put a flag on a cell 
const flagTargetCell = function(row, column) {
    const status = state.status[row][column];
    // If the cell is unopened, put flag on it
    if (status === statusName.unopened) {
        updateTargetElStatus(row, column, statusName.flagged);
        updateTargetElClassList(row, column);
      //if already has a flag, remove flag
    } else if (status === statusName.flagged) {
        updateTargetElStatus(row, column, statusName.unopened);
        updateTargetElClassList(row, column);
    }
}

// Convert the target id to int array
const convertTargetIDtoPosition = function(target) {
    const id = target.id;
    const position = id.split("-");
    return [parseInt(position[0]), parseInt(position[1])]
}

// When mouse down
const changeImageToPress = function(evt) {
    const target = evt.target;
    const button = evt.button;
    const id = convertTargetIDtoPosition(target);
    const status = state.status[id[0]][id[1]];
    const mines = state.mines;
    if (state.win === winStatus.playing) {
        // If the target cell is unopened cell
        if (status === statusName.unopened && button === 0) {
            target.classList.remove(statusName.unopened);
            target.classList.add(statusName.pressing);
        
        } 
        // If the target cell is opened number cell
        changeNearbyImage(id[0], id[1], status, mines, false);
    }
    
}

// When mouse up
const changeImageToUnopen = function(evt) {
    const target = evt.target;
    const button = evt.button;
    const id = convertTargetIDtoPosition(target);
    const status = state.status[id[0]][id[1]];
    const mines = state.mines;
    if (state.win === winStatus.playing) {
        // If the target cell is in pressing condition
        if (button === 0 && target.classList.contains(statusName.pressing)) {
            target.classList.remove(statusName.pressing);
            target.classList.add(statusName.unopened);
        }
        // If the target cell is opened number cell
        changeNearbyImage(id[0], id[1], status, mines, true);
    }
    
}

// Change the view of nearby cell when clicking an opened cell
const changeNearbyImage = function(row, column, status, mines, releaseMouse) {
    let removeStatus = statusName.unopened;
    let addStatus = statusName.pressing;
    if (releaseMouse) {
        removeStatus = statusName.pressing;
        addStatus = statusName.unopened;
    }
    // If the target cell is not a mine
    if (mineClassName.some(name => name === status && status != mineClassName[9])) {
        for (const direction in offsetDirection) {
            const nearbyTargetRow = row + offsetDirection[direction][0];
            const nearbyTargetColumn = column + offsetDirection[direction][1];
            // If the target location is not out of the index boundary
            if (mines[nearbyTargetRow] !== undefined &&
                mines[nearbyTargetRow][nearbyTargetColumn] !== undefined) {
                    const nearbyStatus = state.status[nearbyTargetRow][nearbyTargetColumn];
                    // If the nearby cell is unopened
                    if (nearbyStatus === statusName.unopened) {
                        const nearbyTarget = getTargetElwithPosition(nearbyTargetRow, nearbyTargetColumn);
                        nearbyTarget.classList.remove(removeStatus);
                        nearbyTarget.classList.add(addStatus);
                }
            }
        }
    }

}

// When pressing cell instead of clicking it.
const pressingCellEventListener = function(target) {
    target.addEventListener("mousedown", changeImageToPress)
    target.addEventListener("mouseup", changeImageToUnopen)
    target.addEventListener("mouseout", changeImageToUnopen)
}

// All left click function wrapper
const leftClickHandler = function(evt) {
    if (evt.button === 0 && state.win === winStatus.playing) {
        const target = evt.target;
        const position = convertTargetIDtoPosition(target);
        const row = position[0];
        const column = position[1];
        openTargetCell(row, column);
        openNearbyCell(row, column);
    }
}

// All right click function wrapper
const rightClickHandler = function(evt) {
    if (evt.button === 2 && state.win === winStatus.playing) {
        const target = evt.target;
        const position = convertTargetIDtoPosition(target);
        const row = position[0];
        const column = position[1];
        flagTargetCell(row, column);
    }
}

// Render all the content
const render = function() {
    rendInitialMinesField();
}

init();


/*----- event listeners -----*/
const bindEventListener = function() {
    for (let i = 0; i < state.size.row; i++) {
        for (let j = 0; j < state.size.column; j++) {
            const target = getTargetElwithPosition(i, j);
            pressingCellEventListener(target);
            target.addEventListener("click", leftClickHandler)
            target.addEventListener("contextmenu", rightClickHandler);
        }
    }
}
// Disable the right click menu
document.addEventListener('contextmenu', event => event.preventDefault());
bindEventListener();