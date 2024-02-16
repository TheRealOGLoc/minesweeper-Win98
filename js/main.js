/*----- constants -----*/
// Beginner mine size
const beginnerSize = {
    row: 9,
    column: 9, 
}

// Intermediate mine size
const intermediateSize = {
    row: 16,
    column: 16
}

// Expert mine size
const expertSize = {
    row: 20,
    column: 30
}

// Different level of the game
const level = {
    beginner: 10,
    intermediate: 30,
    expert: 90,
}

// Use to search the cell in different direction
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

// Use to represent how many mines nearby in the mine field array
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

// The timer and mine left indicator class name
const numImageClassName = [
    "num-zero",
    "num-one",
    "num-two",
    "num-three",
    "num-four",
    "num-five",
    "num-six",
    "num-seven",
    "num-eight",
    "num-nine"
]

// The cell status names
const statusName = {
    unopened: "unopened",
    opened: "opened",
    flagged: "flagged",
    exploded: "exploded",
    flagMissed: "flagMissed",
    targetExploded: "targetExploded",
    pressing: "pressing",
}

// The mine class name
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

// The winning status
const winStatus = {
    playing: 0,
    win: 1,
    lose: -1,
}

// The restart button class name
const restartButtonClassName = {
    playing: "playing",
    searching: "searching",
    win: "win",
    lose: "lose"
}

// Use to determine the game level in the init function
const gameDifficulty = {
    beginner: "beginner",
    intermediate: "intermediate",
    expert: "expert"
}

// Width and height of a mine cell
const mineSize = 25; // change the mineSize must change the size in css as well

/*----- state variables -----*/
const state = {
    size: null, //
    level: null, //
    difficulty: null, //
    mines: [], 
    status: [],
    minesCreated: false,
    statusCreated: false,
    timer: [0, 0, 0],
    mineLeft: 0, //
    win: null,
    firstClick: false,
};

/*----- cached elements  -----*/
const minesEl = document.querySelector(".mines");
const containerEl = document.querySelector(".container");
const titleBarEl = document.querySelector(".title-bar");
const mineLeftHundredsEl = document.querySelector(".mine-left-hundreds");
const mineLeftTensEl = document.querySelector(".mine-left-tens");
const mineLeftUnitsEl = document.querySelector(".mine-left-units");
const timerHundredsEl = document.querySelector(".timer-hundreds");
const timerTensEl = document.querySelector(".timer-tens");
const timerUnitsEl = document.querySelector(".timer-units");
const restartButtonEl = document.querySelector(".restart");
const gameMenuButtonEl = document.getElementById("game-menu-btn");
const helpMenuButtonEl = document.getElementById("help-menu-btn");
const gameMenuContentEl = document.getElementById("game-content");
const helpMenuContentEl = document.getElementById("help-content");
const newGameButtonEl = document.getElementById("new-game");
const beginnerGameButtonEl = document.getElementById("beginner-game");
const intermediateGameButtonEl = document.getElementById("intermediate-game");
const expertGameButtonEl = document.getElementById("expert-game");
const menusContentEl = document.querySelectorAll(".menu-content");
const minesweeperTaskEl = document.querySelector(".minesweeper-task")
const titleQuitButtonEl = document.getElementById("quit");
const menuQuitButtonEl = document.getElementById("menu-quit");
const minesweeperGameIconEl = document.getElementById("minesweeper-program");
const titleMinimumButtonEl = document.getElementById("minimum");
const gameIconNameEl = document.getElementById("minesweeper-program-name");
const bodyEl = document.getElementsByTagName("body")[0];


/*----- classes -----*/

// Time class to show the time has played
class Timer {
    static hundreds = 0;
    static tens = 0;
    static units = 0;
    static timer;
    static timeIncrement = () => {
        if (this.hundreds === 9 && this.tens === 9 && this.units === 9) {
            return [9, 9, 9]
        }
        this.units++;
        if (this.units === 10) {
            this.tens++;
            this.units = 0;
        } 
        if (this.tens === 10) {
            this.hundreds++;
            this.tens = 0;
        }
        return [this.hundreds, this.tens, this.units];
    }
}

// Use to check which menu is open
class MenuContent {
    static gameMenuOpen = false;
    static helpMenuOpen = false;
    static openGameMenu = () => {
        this.gameMenuOpen = true;
        this.helpMenuOpen = false;
    }
    static openHelpMenu = () => {
        this.gameMenuOpen = false;
        this.helpMenuOpen = true;
    }
    static closeAllMenu = () => {
        this.gameMenuOpen = false;
        this.helpMenuOpen = false;
    }
    static getMenusCondition = () => {
        return [this.gameMenuOpen, this.helpMenuOpen];
    }
}

// Seve the mouse offset
class MouseOffset {
    static offsetX;
    static offsetY;
}

/*----- functions -----*/

// Initialization function, entry point of the game
const init = function(difficulty) {
    if (difficulty === gameDifficulty.beginner) {
        state.difficulty = gameDifficulty.beginner
        state.size = beginnerSize;
        state.level = level.beginner;
        state.mineLeft = level.beginner;
    } else if (difficulty === gameDifficulty.intermediate) {
        state.difficulty = gameDifficulty.intermediate
        state.size = intermediateSize;
        state.level = level.intermediate;
        state.mineLeft = level.intermediate;
    } else if (difficulty === gameDifficulty.expert) {
        state.difficulty = gameDifficulty.expert
        state.size = expertSize;
        state.level = level.expert;
        state.mineLeft = level.expert;
    }
    state.win = winStatus.playing;
    resetTimer();
    setElementsSize();
    createMinesArray(state.size);
    allocateMines();
    modifyMinesArray();
    createInitialStatusArray(state.size);
    render();
}

// Set the minesEl's width and height
const setElementsSize = function() {
    containerEl.style.width = `${mineSize * state.size.column + 28}px`
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
const allocateMines = function() { 
    const level = state.level;
    let count = 0;
    while (count != level) {
        const row = Math.floor(Math.random() * state.size.row);
        const column = Math.floor(Math.random() * state.size.column);
        if (state.mines[row][column] !== mineStatus.mine) {
            state.mines[row][column] = mineStatus.mine;
            count++;
        } 
    }
    state.minesCreated = true;
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

// Update single number in the indicator
const updateNumberClass = function(element, newNumberIndex) {
    for (let i = 0; i < numImageClassName.length; i++) {
        element.classList.remove(numImageClassName[i]);
    }
    element.classList.add(numImageClassName[newNumberIndex]);
}

// Rend all the mine left number
const rendMineLeftCount = function() {
    const mineLeft = state.mineLeft;
    const mineLeftUnitNum = parseInt(mineLeft % 10);
    const mineLeftTenNum = parseInt((mineLeft % 100) / 10);
    const mineLeftHundredNum = parseInt((mineLeft % 1000) / 100);
    updateNumberClass(mineLeftUnitsEl, mineLeftUnitNum);
    updateNumberClass(mineLeftTensEl, mineLeftTenNum);
    updateNumberClass(mineLeftHundredsEl, mineLeftHundredNum);
}

// Change the timer view
const rendTimer = function() {
    const timer = state.timer;
    const timerUnitNum = timer[2];
    const timerTenNum = timer[1];
    const timerHundredNum = timer[0];
    updateNumberClass(timerUnitsEl, timerUnitNum);
    updateNumberClass(timerTensEl, timerTenNum);
    updateNumberClass(timerHundredsEl, timerHundredNum);
}

// Clean the mine field
const cleanMineField = function() {
    minesEl.textContent = '';
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

// Check if has won
const checkIfHasWon = function() {
    if (state.mineLeft === 0) {
        const size = state.size;
        const mines = state.mines;
        const status = state.status;
        const level = state.level;
        let correctFlagsCount = 0
        // Count if all mine has been flagged
        for (let i = 0; i < size.row; i++) {
            for (let j = 0; j < size.column; j++) {
                if (mines[i][j] === mineStatus.mine && status[i][j] === statusName.flagged) {
                    correctFlagsCount++;
                }
            }
        }
        // If the number of correct flag equals the level mine
        if (correctFlagsCount === level) {
            changeWinningCondition(winStatus.win);
            changeRestartButtonImage("win");
            clearInterval(Timer.timer);
        }
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
        clearInterval(Timer.timer);
        changeRestartButtonImage("lose");
    } 
}


// Change the current game condition
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

// Reset timer to zero
const resetTimer = function() {
    Timer.hundreds = 0;
    Timer.tens = 0;
    Timer.units = 0;
    state.timer = [0, 0, 0];
}

// The time function to be set as the interval
const updateTimer = function() {
    state.timer = Timer.timeIncrement();
    rendTimer();
}

// Prevent the first click is mine
const preventFirstClickMine = function(row, column) {
    if (!state.firstClick) {
        const mines = state.mines;
        const size = state.size;
        if (mines[row][column] === mineStatus.mine) {
            mines[row][column] = mineStatus.zeroMine;
            let hasMovedMine = false;
            // Add a new mine to new location
            while (!hasMovedMine) {
                const newMineRow = Math.floor(Math.random() * size.row);
                const newMineColumn = Math.floor(Math.random() * size.column);
                if (mines[newMineRow][newMineColumn] !== mineStatus.mine) {
                    mines[newMineRow][newMineColumn] = mineStatus.mine;
                    hasMovedMine = true;
                }
            }
            modifyMinesArray();
        }
        state.firstClick = true;
        // Start timer
        Timer.timer = setInterval(updateTimer, 1000);
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
            // If the target mine has not been flagged, open it
            if (targetMine === mineStatus.mine && targetStatus === statusName.unopened) {
                updateTargetElStatus(i, j, statusName.exploded);
                updateTargetElClassList(i, j);
            // If the target mine is miss flagged, set it to miss flag
            } else if (targetMine !== mineStatus.mine && targetStatus === statusName.flagged) {
                updateTargetElStatus(i, j, statusName.flagMissed);
                updateTargetElClassList(i, j);
            }
        }
    }
}

// Add or minus the number of mins left
const changeMineLeft = function(add) {
    if (add) {
        state.mineLeft--;
    } else {
        state.mineLeft++
    }
}

// Right click to put a flag on a cell 
const flagTargetCell = function(row, column) {
    const status = state.status[row][column];
    // If the cell is unopened, put flag on it
    if (status === statusName.unopened) {
        updateTargetElStatus(row, column, statusName.flagged);
        updateTargetElClassList(row, column);
        changeMineLeft(true);
      //if already has a flag, remove flag
    } else if (status === statusName.flagged) {
        updateTargetElStatus(row, column, statusName.unopened);
        updateTargetElClassList(row, column);
        changeMineLeft(false);
    }
}

// Convert the target id to int array
const convertTargetIDtoPosition = function(target) {
    const id = target.id;
    const position = id.split("-");
    return [parseInt(position[0]), parseInt(position[1])]
}

// Remove restart button's all condition class
const removeRestartButtonClass = function() {
    restartButtonEl.classList.remove(restartButtonClassName.playing);
    restartButtonEl.classList.remove(restartButtonClassName.searching);
    restartButtonEl.classList.remove(restartButtonClassName.win);
    restartButtonEl.classList.remove(restartButtonClassName.lose);
}

// Change restart button to new image
const changeRestartButtonImage = function(event) {
    if (event === "mousedown") {
        removeRestartButtonClass();
        restartButtonEl.classList.add(restartButtonClassName.searching);
    }  else if (event === "win") {
        removeRestartButtonClass();
        restartButtonEl.classList.add(restartButtonClassName.win);
    } else if (event === "lose") {
        removeRestartButtonClass();
        restartButtonEl.classList.add(restartButtonClassName.lose);
    } else if (event === "mouseup" || event === "playing") {
        removeRestartButtonClass();
        restartButtonEl.classList.add(restartButtonClassName.playing);
    }
}


// Change the open condition of menu
const changeMenuCondition = function(menu) {
    if (menu === "game-menu-btn") {
        MenuContent.openGameMenu();
    } else if (menu === "help-menu-btn") {
        MenuContent.openHelpMenu();
    }
}

// Avoid bug if click on the menu's span
const IDConvertor = function(id) {
    const gameMenuSpan = "game-menu-btn-span";
    const helpMenuSpan = "help-menu-btn-span";
    if (id === "game-menu-btn" || id === "help-menu-btn") {
        return id;
    } else if (id === gameMenuSpan) {
        return "game-menu-btn";
    } else if (id === helpMenuSpan) {
        return "help-menu-btn";
    }
}

// Open game or help menu
const showMenuContent = function(evt) {
    const target = evt.target;
    const id = IDConvertor(target.id);
    changeMenuCondition(id);
    const menuConditions = MenuContent.getMenusCondition();
    if (menuConditions[0]) {
        gameMenuContentEl.classList.add("show-menu-content");
        helpMenuContentEl.classList.remove("show-menu-content")
    } if (menuConditions[1]) {
        helpMenuContentEl.classList.add("show-menu-content");
        gameMenuContentEl.classList.remove("show-menu-content")
    } 
}

// Close all menus
const closeAllMenu = function() {
    MenuContent.closeAllMenu();
    gameMenuContentEl.classList.remove("show-menu-content");
    helpMenuContentEl.classList.remove("show-menu-content");
}

// If the menu is opened and the click target is not menu, close menu
const closeAllMenuIfOut = function(evt) {
    const target = evt.target;
    const tagName = target.tagName;
    const menuConditions = MenuContent.getMenusCondition();
    if (menuConditions[0] || menuConditions[1]) {
        if (tagName !== "LI" &&
            tagName !== "UL" &&
            tagName !== "BUTTON" &&
            tagName !== "SPAN") {
            closeAllMenu();
        }
    }
}

// Add select class to game icon
const selectMinesweeperIcon = function() {
    const iconClasses = gameIconNameEl.classList;
    if (!iconClasses.contains("selected")) {
        iconClasses.add("selected");
    }
}

// Remove select class from game icon
const deselectedMinesweeperIcon = function(evt) {
    const tagName = evt.target.tagName;
    if (tagName === "BODY" || tagName === "MAIN") {
        gameIconNameEl.classList.remove("selected");
    } 
}

// According to the current difficulty, change the tick in the game menu
const setCurrentDifficultyTick = function() {
    const currentDifficulty = state.difficulty + "-game";
    const difficultyButtons = [beginnerGameButtonEl, intermediateGameButtonEl, expertGameButtonEl];
    for (let i = 0; i < 3; i++) {
        if (difficultyButtons[i].id === currentDifficulty) {
            difficultyButtons[i].childNodes[0].classList.add("show-tick");
        } else {
            difficultyButtons[i].childNodes[0].classList.remove("show-tick");
        }
    }
}

// When mouse down (pressing an mine cell)
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
        changeRestartButtonImage("mousedown");
    }
    
}

// When mouse up (releasing an mine cell)
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
        changeRestartButtonImage("mouseup");
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

// Calculate the offset of mouse
const dragTitleMouseDown = function(evt) {
    MouseOffset.offsetX = evt.clientX - containerEl.offsetLeft;
    MouseOffset.offsetY = evt.clientY - containerEl.offsetTop;
    document.addEventListener("mousemove", onMouseMove);
}

// Calculate and update the containerEl's position
function onMouseMove(event) {
    // Calculate new positon
    let newX = event.clientX - MouseOffset.offsetX;
    let newY = event.clientY - MouseOffset.offsetY;
    // Update new position
    containerEl.style.left = newX + "px";
    containerEl.style.top = newY + "px";
}

// Quit current game
const quitGame = function() {
    containerEl.style.display = "none";
    minesweeperTaskEl.style.display = "none";
}

// Show the game
const showGame = function() {
    containerEl.style.display = "block";
    minesweeperTaskEl.style.display = "flex";
}

// The minimum button's hide game feature
const minimumOrshowGame = function() {
    if (containerEl.style.display === "none") {
        containerEl.style.display = "block";
        minesweeperTaskEl.classList.remove("minimum-status");
    } else {
        containerEl.style.display = "none";
        minesweeperTaskEl.classList.add("minimum-status");
    }
}

// All left click function wrapper
const leftClickHandler = function(evt) {
    if (evt.button === 0 && state.win === winStatus.playing) {
        const target = evt.target;
        const position = convertTargetIDtoPosition(target);
        const row = position[0];
        const column = position[1];
        preventFirstClickMine(row, column);
        openTargetCell(row, column);
        openNearbyCell(row, column);
        checkIfHasWon();
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
        rendMineLeftCount();
        checkIfHasWon();
    }
}

// Reset state to initial condition
const resetState = function() {
    state.size = null;
    state.level = null;
    state.difficulty = null;
    state.mines = [];
    state.status = [];
    state.minesCreated = false;
    state.statusCreated = false;
    state.timer = [0, 0, 0];
    state.mineLeft = 0;
    state.win = null;
    state.firstClick = false;    
}

// Restart game with different difficulty
const restartGame = function(difficulty) {
    const currentDifficulty = state.difficulty;
    clearInterval(Timer.timer)
    resetState();
    if (Object.values(gameDifficulty).includes(difficulty)) {
        init(difficulty);
    } else {
        init(currentDifficulty);
    }
    changeRestartButtonImage("playing");
    closeAllMenu();
    bindEventListener();
} 

// Double click to restart the game
const restartBeginnerGameByIcon = function() {
    if (containerEl.style.display === "none" &&
        minesweeperTaskEl.style.display === "none") {
        restartBeginnerGame();
        showGame();
    }
}

// Restart a beginner game
const restartBeginnerGame = function() {
    restartGame(gameDifficulty.beginner);
}

// Restart a intermediate game
const restartIntermediateGame = function() {
    restartGame(gameDifficulty.intermediate);
}

// Restart a expert game
const restartExpertGame = function() {
    restartGame(gameDifficulty.expert);
}


// Render all the content
const render = function() {
    cleanMineField();
    rendInitialMinesField();
    setCurrentDifficultyTick();
    rendMineLeftCount();
    rendTimer();
}

init(gameDifficulty.beginner);

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
    newGameButtonEl.addEventListener("click", restartGame);
    beginnerGameButtonEl.addEventListener("click", restartBeginnerGame);
    intermediateGameButtonEl.addEventListener("click", restartIntermediateGame);
    expertGameButtonEl.addEventListener("click", restartExpertGame);
    restartButtonEl.addEventListener("click", restartGame);
    gameMenuButtonEl.addEventListener("click", showMenuContent);
    helpMenuButtonEl.addEventListener("click", showMenuContent);
    titleBarEl.addEventListener("mousedown", dragTitleMouseDown)
    document.addEventListener("mouseup", function() {
        document.removeEventListener("mousemove", onMouseMove);
    });
    titleQuitButtonEl.addEventListener("click", quitGame);
    menuQuitButtonEl.addEventListener("click", quitGame);
    minesweeperGameIconEl.addEventListener("dblclick", restartBeginnerGameByIcon);
    minesweeperGameIconEl.addEventListener("click", selectMinesweeperIcon);
    titleMinimumButtonEl.addEventListener("click", minimumOrshowGame);
    minesweeperTaskEl.addEventListener("click", minimumOrshowGame);
    bodyEl.addEventListener("click", deselectedMinesweeperIcon);
}
// Disable the right click menu
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener("click", closeAllMenuIfOut);
bindEventListener();