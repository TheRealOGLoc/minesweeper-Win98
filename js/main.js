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

const mineSize = 13; // change the mineSize must change the size in css as well

/*----- state variables -----*/
const state = {
    size: null,
    level: null,
    mines: [],
    status: [],
    minesCreated: false,
    statusCreated: false,
    time: 0,
};

/*----- cached elements  -----*/
const minesEl = document.querySelector(".mines");

/*----- functions -----*/
const init = function() {
    state.size = expertSize;
    state.level = level.expert;
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
            state.mines[i][j] = mineStatus.zeroMine;    // set initial mine
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
    if (status === statusName.unopened) {
        const newStatus = getTargetElNewStatus(row, column);
        updateTargetElStatus(row, column, newStatus);
        updateTargetElClassList(row, column);
        let scannedCell = [];
        openNearbyZeroMineCell(row, column, scannedCell);
    }
}



// Open nearby zero mine cells
const openNearbyZeroMineCell = function(row, column, scannedCell) {
    console.log(row, "-", column);
    const mines = state.mines;
    const targetMine = state.mines[row][column]
    console.log(scannedCell);
    if (targetMine === mineStatus.zeroMine && !([row, column] in scannedCell)) {
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
    } else {
        return;
    }
}

const flagTargetCell = function(row, column) {
    const status = state.status[row][column];
    if (status === statusName.unopened) {
        updateTargetElStatus(row, column, statusName.flagged);
        updateTargetElClassList(row, column);
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

const changeImageToPress = function(evt) {
    const target = evt.target;
    const button = evt.button;
    const id = convertTargetIDtoPosition(target);
    const status = state.status[id[0]][id[1]];
    if (status === statusName.unopened && button === 0) {
        target.classList.remove(statusName.unopened);
        target.classList.add(statusName.pressing);
    }
}

const changeImageToUnopen = function(evt) {
    const target = evt.target;
    const button = evt.button;
    if (button === 0 && target.classList.contains(statusName.pressing)) {
        target.classList.remove(statusName.pressing);
        target.classList.add(statusName.unopened);
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
    if (evt.button === 0) {
        const target = evt.target;
        const position = convertTargetIDtoPosition(target);
        const row = position[0];
        const column = position[1];
        openTargetCell(row, column);
    }
}

// All right click function wrapper
const rightClickHandler = function(evt) {
    if (evt.button === 2) {
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
document.addEventListener('contextmenu', event => event.preventDefault());
bindEventListener();













// const changeImageToPress = function(evt) {
//     const target = evt.target;
//     target.classList.remove(statusName.unopened);
//     target.classList.add(statusName.pressing);
// }

// const changeImageToUnopen = function(evt) {
//     const target = evt.target;
//     if (target.classList.contains(statusName.pressing)) {
//         target.classList.remove(statusName.pressing);
//         target.classList.add(statusName.unopened);
//     }
// }


// // Create mine field except the first clicked target's index
// const allocateMinesWithTarget = function(evt) {
//     if (!state.minesCreated) {
//         const target = evt.target;
//         const position = convertTargetIDtoPosition(target);
//         allocateMines(position[0], position[1]);
//         modifyMinesArray();
//     }
// }

// // 
// const addClassNameToCell = function(evt) {
//     const target = evt.target;
//     const position = convertTargetIDtoPosition(target); 
//     const classIndex = state.mines[position[0]][position[1]];
//     target.classList.add(statusName.opened)
//     if (classIndex !== mineStatus.mine) {
//         target.classList.add(mineClassName[classIndex]);
//     } else {
//         target.classList.add(mineClassName[9]);
//     }
// }



// const leftClickHandler = function(evt) {
//     if (evt.button === 0) {
//         //removeUnopenedClass(evt);
//         allocateMinesWithTarget(evt);
//         addClassNameToCell(evt);
//     }
// }

// const rightClickHandler = function(evt) {

// }

// const getMineElwithPosition = function(row, column) {
//     return minesEl.children[row].children[column];
// }



// const floodFeature = function(row, column) {
//     const mines = state.mines;
//     const clickedTargetEl = getMineElwithPosition(row, column);
//     const clickedTarget = mines[row][column];
//     if (clickedTarget === mineStatus.zeroMine &&
//         !clickedTargetEl.classList.contains(mineClassName[0])) {
//         clickedTargetEl.className = "";

//     }

//     for (const direction in offsetDirection) {
//         const targetRow = row + offsetDirection[direction][0];
//         const targetColumn = column + offsetDirection[direction][1];
//         // If the target location is not out of the index boundary
//         if (mines[targetRow] !== undefined &&
//             mines[targetRow][targetColumn] !== undefined &&
//             mines[targetRow][targetColumn] === mineStatus.zeroMine) {
//                 const target = getMineElwithPosition
//         }
//     }
// }

// const convertTargetIDtoPosition = function(target) {
//     const id = target.id;
//     const position = id.split("-");
//     return [parseInt(position[0]), parseInt(position[1])]
// }

// init();
// /*----- event listeners -----*/
// const bindEventListener = function() {
//     for (let i = 0; i < state.size.row; i++) {
//         for (let j = 0; j < state.size.column; j++) {
//             const target = minesEl.children[i].children[j];
//             target.addEventListener("mousedown", changeImageToPress)
//             target.addEventListener("mouseup", changeImageToUnopen)
//             target.addEventListener("mouseout", changeImageToUnopen)
//             target.addEventListener("click", leftClickHandler)
            
//         }
//     }
// }


// bindEventListener();

