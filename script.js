let bombCount = 0;
let flagsCount = 0;
let isPlaying = false;
let isFirstClickHappened = false;
let x = 9;
let y = 9;
let boardMatrix;
let music;
let isMusicPlaying = false;
let isFirstMusicStoppingHappened = false;
let interval;

musicInitialization();
levels();
gameRules();
emojiInitialization();
startGame();

function generateMatrix(x, y){
    const matrix = [];
    //létrehozunk egy két dimenziós objektum tömböt, aminek beállítjuk az alapértelmezett értékeit
    for(let i = 0; i < x; i++){
        const rows = [];
        for(let j = 0; j < y; j++){
            rows.push({
                isRevealed: false,
                isFlagged: false,
                isBomb: false,
                cellValue: 0
            });
        }
        matrix.push(rows);
    }

    //bombák számának megadása a pálya mérete szerint, a pályák egyre nehezednek, ahogy nő a méretük, több a bomba százalékosan
    if(x === 9 && y === 9){
        bombCount = 10;
    }
    else if(x === 16 && y === 16){
        bombCount = 40;
    }
    else if(x === 16 && y === 30){
        bombCount = 99;
    }
    return matrix;
}

function fillBoard(matrix, indexX, indexY){
    
    //létrehozunk egy két dimenziós tömböt, amiben a matrix tömb összes indexét eltároljuk
    const coordinates = [];
    for(let i = 0; i < x; i++){
        for(let j = 0; j < y; j++){
            if (i !== indexX || j !== indexY) { //első klikk koordináták, nem lehet bomba (indexX és indexY)
                coordinates.push([i, j]);
            }
        }
    }

    //Fisher-Yates algoritmus
    for(let i = coordinates.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [coordinates[i], coordinates[j]] = [coordinates[j], coordinates[i]];
    }

    //bombák véletlenszerű elhelyezése
    for(let i = 0; i < bombCount; i++){
        const [row, column] = coordinates[i];
        matrix[row][column].isBomb = true;
    }

    matrix = calculateBombsAroundCells(matrix);

    return matrix;
}

//beszámozza a mezőket
function calculateBombsAroundCells(matrix) {
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[i].length; j++){
            if(matrix[i] [j].isBomb){//a bomba mezőket járja körbe és növeli az értékét
                //bal felső mező
                if(i - 1 >= 0 && i - 1 < matrix.length && j - 1 >= 0 && j - 1 < matrix[i].length && !matrix[i - 1] [j - 1].isBomb){
                    matrix[i - 1] [j - 1].cellValue++;
                }
                //felső mező
                if(i - 1 >= 0 && i - 1 < matrix.length && j >= 0 && j < matrix[i].length && !matrix[i - 1] [j].isBomb){
                    matrix[i - 1] [j].cellValue++;
                }
                //jobb felső mező
                if(i - 1 >= 0 && i - 1 < matrix.length && j + 1 >= 0 && j + 1 < matrix[i].length && !matrix[i - 1] [j + 1].isBomb){
                    matrix[i - 1] [j + 1].cellValue++;
                }
                //job oldali mező
                if(i >= 0 && i < matrix.length && j + 1 >= 0 && j + 1 < matrix[i].length && !matrix[i] [j + 1].isBomb){
                    matrix[i] [j + 1].cellValue++;
                }
                //jobb alsó mező
                if(i + 1 >= 0 && i + 1 < matrix.length && j + 1 >= 0 && j + 1 < matrix[i].length && !matrix[i + 1] [j + 1].isBomb){
                    matrix[i + 1] [j + 1].cellValue++;
                }
                //alsó mező
                if(i + 1 >= 0 && i + 1 < matrix.length && j >= 0 && j < matrix[i].length && !matrix[i + 1] [j].isBomb){
                    matrix[i + 1] [j].cellValue++;
                }
                //bal alsó mező
                if(i + 1 >= 0 && i + 1 < matrix.length && j - 1 >= 0 && j - 1 < matrix[i].length && !matrix[i + 1] [j - 1].isBomb){
                    matrix[i + 1] [j - 1].cellValue++;
                }
                //bal oldali mező
                if(i >= 0 && i < matrix.length && j - 1 >= 0 && j - 1 < matrix[i].length && !matrix[i] [j - 1].isBomb){
                    matrix[i] [j - 1].cellValue++;
                }
            }
        }
    }

    return matrix;
}

function startGame(){
    setEmojiFace('fa-face-smile');
    resetTimer();
    resetBoard();
    boardMatrix = generateMatrix(x, y);
    generateBoard(boardMatrix);
    isPlaying = true;
    flagInitialization();
}

function generateBoard(matrix){
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateRows = `repeat(${matrix.length}, 40px)`; // Sorok számának dinamikus beállítása
    gameBoard.style.gridTemplateColumns = `repeat(${matrix[0].length}, 40px)`; // Oszlopok számának dinamikus beállítása
    gameBoard.style.width = '100%';
    gameBoard.style.height = '100%';
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[i].length; j++){
            const matrixCurrentElement = matrix[i] [j];
            const newCell = createCell(i, j, matrixCurrentElement);//createCell metódus segítségével elkészítjük a mezőket
            gameBoard.appendChild(newCell);//feltölti a táblát mezőkkel
        }
    }
    gameBoard.classList.add('board');
}

function createCell(x, y, cell){
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('cell-container'); // új köztes div

    const newCell = document.createElement('div');//mezok hozzáadása
    newCell.dataset.indexX = x.toString();
    newCell.dataset.indexY = y.toString();
    newCell.classList.add('cell');
    
    if(!cell.isRevealed){
        newCell.classList.add('faceDown');
    }
    newCell.addEventListener('click', (event)=>{//Klikkelés lekezelése szám mezőnél, bombánál és üres mezőnél
        if(!isPlaying){//ha nem játszik, ne működjenek az event listener-ek
            return;
        }
        if(newCell.classList.contains('flag')){//ha zászló van rajta bal kattintás nem lehetséges
            return;
        }
        cell.isRevealed = true;
        const indexX = parseInt(event.target.dataset.indexX); //aktuális mező koordinátájának elmentése
        const indexY = parseInt(event.target.dataset.indexY);
        console.log(indexX, indexY);
        newCell.classList.remove('faceDown');
        if(!isFirstClickHappened){
            boardMatrix = fillBoard(boardMatrix, indexX, indexY);
            isFirstClickHappened = true;
            if(!isFirstMusicStoppingHappened) {
                playMusic();
            }

            timer();
        }
        if(cell.isBomb){
            newCell.classList.add('bomb');
            onBombClick(indexX, indexY);
        }
        else if(cell.cellValue !== 0){
            newCell.classList.add('number');
            newCell.innerText = cell.cellValue;
            checkWin();
        }
        else{
            cell.isRevealed = false;
            emptyCellClick(indexX, indexY);
        }
    })

    newCell.addEventListener('contextmenu', (event)=>{//jobb klikkel zászló felrakása a mezőre, ha fent van még egy jobb klikkel le lehet venni
        event.preventDefault();
        const indexX = parseInt(event.target.dataset.indexX); //aktuális mező koordinátájának elmentése
        const indexY = parseInt(event.target.dataset.indexY);
        let shouldDecrease = true;
        if(!isPlaying){//ha nem játszik, ne működjenek az event listener-ek
            return;
        }
        if(!isFirstClickHappened){
            if(!isFirstMusicStoppingHappened) {
                playMusic();
            }
            timer();
        }
        if (!cell.isRevealed) {
            if (!boardMatrix[indexX][indexY].isFlagged) {
                shouldDecrease = true;
                flagHandler(shouldDecrease, indexX, indexY);
                if(isFirstClickHappened){
                    checkWin();
                }
            }
            else
            {
                shouldDecrease = false;
                flagHandler(shouldDecrease, indexX, indexY);
            }
        }
    })
    containerDiv.appendChild(newCell);
    return containerDiv;
}

function onBombClick(x, y){
    isPlaying = false; //játék vége
    for(let i = 0; i < boardMatrix.length; i++){
        for(let j = 0; j < boardMatrix[i].length; j++){
            const cell = boardMatrix[i][j];
            if(cell.isBomb){
                const element = getElementByIndexes(i, j);
                if (!cell.isFlagged){
                    element.classList.remove('faceDown');
                    element.classList.add('bomb');
                    if(i == x && j == y){
                        element.classList.add('firstBomb'); //az a bomba amire először kattintottunk, így külön lehet formázni
                        element.classList.remove('bomb');
                    }
                }
            }
        }
    }
    for(let i = 0; i < boardMatrix.length; i++){ //vesztéskor a korábban tévesen lerakott zászlók pirosan jelennek meg
        for(let j = 0; j < boardMatrix[i].length; j++){
            const cell = boardMatrix[i][j];
            if(cell.isFlagged){
                if(!cell.isBomb){
                    const wrongFlagCell = getElementByIndexes(i, j);
                    wrongFlagCell.classList.add('wrongFlag');
                }
            }
        }
    }

    //pointer és hover eltávolítása
    for(let i = 0; i < boardMatrix.length; i++){
        for(let j = 0; j < boardMatrix[i].length; j++){
            const cell = boardMatrix[i][j];
            if(!cell.isRevealed){
                const faceDownCell = getElementByIndexes(i, j);
                faceDownCell.style.pointerEvents = "none";
            }
        }
    }

    modalShowHide(true, 'lost');
    setEmojiFace('fa-face-tired');
    stopTimer();
}

//megjeleníti, vagy elrejti a megadott modal-t és a főtárolót
function modalShowHide(isShown, modalContainerName) { //fadeIn és fadeOut animációval megjeleníti a nyertes/vesztes modal-t

    const modalContainer = document.getElementById(modalContainerName);
    const mainContainer = document.getElementById('mainContainer');
    const mainTitle = document.getElementById('mainTitle');

    if (!modalContainer) {
        return;
    }

    if (!isShown) { // modalTarolo elrejtese
        modalContainer.classList.remove('popup-scale-in');
        setTimeout(() => {
            mainContainer.classList.add('fade-in');
            mainTitle.classList.add('fade-in');
            mainContainer.classList.remove('fade-out');
            mainTitle.classList.remove('fade-out');
        }, 150);

        setTimeout(() => {
            modalContainer.classList.remove('active');
        }, 300);

    } else { //modalTarolo megjelenítése
        modalContainer.classList.add('active');
        requestAnimationFrame(() => {
            mainContainer.classList.remove('fade-in');
            mainTitle.classList.remove('fade-in');
            modalContainer.classList.add('popup-scale-in');
            mainContainer.classList.add('fade-out');
            mainTitle.classList.add('fade-out');
        });

        //kattintás esetén eltűnik
        modalContainer.addEventListener('click', (event)=>{
            modalShowHide(false, modalContainerName);
        });

        // modal automatikus eltüntetése idővel
        setTimeout(() =>{
            modalShowHide(false, modalContainerName);
        }, 3000)
    }
}

function getElementByIndexes(x, y){ //tömb adott eleméhez tartozó HTML element lekérdezése
    const element = document.querySelector(`[data-index-x="${x}"][data-index-y="${y}"]`);
    return element;
}


function checkWin(){
    let wonByReveal = true;
    let wonByFlags = true;
    let noIncorrectFlag = true;
    for(let i = 0; i < boardMatrix.length; i++){
        for(let j = 0; j < boardMatrix[i].length; j++){
            const cell = boardMatrix[i][j];
            if(cell.isBomb && !cell.isFlagged){//van-e olyan mező, ami bomba, de nincs rajta zászló
                wonByFlags = false;
            }
            if(!cell.isBomb && !cell.isRevealed){//van-e olyan mező, ami bomba, de nincs felfordítva
                wonByReveal = false;
            }
            if (!cell.isBomb && cell.isFlagged) {//van-e olyan mező, ami nem bomba, de van rajta zászló
                noIncorrectFlag = false;
            }
        }
    }

    if(wonByReveal || (wonByFlags && noIncorrectFlag)){ //ha minden zaszló alatt bomba van, vagy ha minden nem akna fel van fedve nyer a felhasználó
        isPlaying = false;
        modalShowHide(true, 'won');
        setEmojiFace('fa-face-laugh-beam');
        stopTimer();
    }
}

function flagInitialization(){ //zaszlo számláló inicializálása
    flagsCount = bombCount;
    const flagsCounter = document.createElement('div'); //zaszló számláló div
    flagsCounter.textContent = flagsCount; //megadom az értékét
    flagsCounter.classList.add('flags-counter');
    const flagContainer = document.getElementsByClassName('flags-container')[0];
    flagContainer.insertBefore(flagsCounter, flagContainer.children[1]);
}

function flagHandler(shouldDecrease, indexX, indexY){ //zaszló kezelés
    const newCell = getElementByIndexes(indexX, indexY);
    if(shouldDecrease){
        if(flagsCount >= 1){
            newCell.classList.add('flag'); // Hozzáadja a zászlót
            
            boardMatrix[indexX][indexY].isFlagged = true;

            flagsCount--;
            const flagsCounter = document.getElementsByClassName('flags-counter');
            flagsCounter[0].textContent = flagsCount;
        }
    }
    else
    {
        if(flagsCount < bombCount){
            newCell.classList.remove('flag'); // Ha már van zászló, eltávolítja
            //ujMezo.classList.add('faceDown');

            boardMatrix[indexX][indexY].isFlagged = false;

            flagsCount++;
            const flagsCounter = document.getElementsByClassName('flags-counter');
            flagsCounter[0].textContent = flagsCount;
        }
    }
}

function emptyCellClick(x, y){ //kezeli az üres mezőre kattintást
    let cellsToCheck = [];
    cellsToCheck.push({x, y});

    for (let i = 0; i < cellsToCheck.length; i++) {
        const currentCell = cellsToCheck[i];
        let newCells = emptyClickAdjacentCells(currentCell.x,  currentCell.y);
        cellsToCheck.push(...newCells);
    }
    checkWin();
}

function emptyClickAdjacentCells(x, y) { //felfedi az aktuális mezőt, ha nem bomba és nincs felfordítva és, ha üres akkor lekéri a környező mezőket
    let newCellsToCheck = [];

    if(boardMatrix[x][y].isRevealed){
        return newCellsToCheck;
    }
    else if (boardMatrix[x][y].isBomb){
        return newCellsToCheck;
    }
    else if(boardMatrix[x][y].cellValue > 0 && boardMatrix[x][y].cellValue < 9){
        reveal(x, y);
        return newCellsToCheck;
    }
    else{
        reveal(x, y);
        newCellsToCheck = getAdjacentCells(x,y, boardMatrix);
    }

    return newCellsToCheck;
}

function reveal(x, y) { //felfedi az aktuális mezőt, hogy ha nem bomba és nem zászló
    let currentCell = boardMatrix[x][y];

    // ha bomba, vagy zászló nem fut tovább a metódus
    if (currentCell.isBomb || currentCell.isFlagged) {
        return;
    }

    const cellElement = getElementByIndexes(x, y);

    if (currentCell.cellValue !== 0) {
        cellElement.classList.add('number');
        cellElement.innerText = currentCell.cellValue;
    } else {
        cellElement.classList.add('empty');
    }

    cellElement.classList.remove('faceDown')
    currentCell.isRevealed = true;
}

function getAdjacentCells(x,y, matrix) { //visszatér a környező mezőkkel, amelyek nem zászlók és nem aknák
    let adjacentCells = [];

    //bal felső mező
    if(x - 1 >= 0 && x - 1 < matrix.length && y - 1 >= 0 && y - 1 < matrix[x].length && !matrix[x - 1] [y - 1].isBomb && !matrix[x - 1] [y - 1].isBomb.isRevealed && !matrix[x - 1] [y - 1].isBomb.isFlagged){
        adjacentCells.push({
            x: x - 1, y: y - 1
        });
    }
    //felső mező
    if(x - 1 >= 0 && x - 1 < matrix.length && y >= 0 && y < matrix[x].length && !matrix[x - 1] [y].isBomb && !matrix[x - 1] [y].isRevealed && !matrix[x - 1] [y].isFlagged){
        adjacentCells.push({
            x: x - 1, y: y
        });
    }
    //jobb felső mező
    if(x - 1 >= 0 && x - 1 < matrix.length && y + 1 >= 0 && y + 1 < matrix[x].length && !matrix[x - 1] [y + 1].isBomb && !matrix[x - 1] [y + 1].isRevealed && !matrix[x - 1] [y + 1].isFlagged){
        adjacentCells.push({
            x: x - 1, y: y + 1
        });
    }
    //job oldali mező
    if(x >= 0 && x < matrix.length && y + 1 >= 0 && y + 1 < matrix[x].length && !matrix[x] [y + 1].isBomb && !matrix[x] [y + 1].isRevealed && !matrix[x] [y + 1].isFlagged){
        adjacentCells.push({
            x: x, y: y + 1
        });
    }
    //jobb alsó mező
    if(x + 1 >= 0 && x + 1 < matrix.length && y + 1 >= 0 && y + 1 < matrix[x].length && !matrix[x + 1] [y + 1].isBomb && !matrix[x + 1] [y + 1].isRevealed && !matrix[x + 1] [y + 1].isFlagged){
        adjacentCells.push({
            x: x + 1, y: y + 1
        });
    }
    //alsó mező
    if(x + 1 >= 0 && x + 1 < matrix.length && y >= 0 && y < matrix[x].length && !matrix[x + 1] [y].isBomb && !matrix[x + 1] [y].isRevealed && !matrix[x + 1] [y].isFlagged){
        adjacentCells.push({
            x: x + 1, y: y
        });
    }
    //bal alsó mező
    if(x + 1 >= 0 && x + 1 < matrix.length && y - 1 >= 0 && y - 1 < matrix[x].length && !matrix[x + 1] [y - 1].isBomb && !matrix[x + 1] [y - 1].isRevealed && !matrix[x + 1] [y - 1].isFlagged){
        adjacentCells.push({
            x: x + 1, y: y - 1
        });
    }
    //bal oldali mező
    if(x >= 0 && x < matrix.length && y - 1 >= 0 && y - 1 < matrix[x].length && !matrix[x] [y - 1].isBomb && !matrix[x] [y - 1].isRevealed && !matrix[x] [y - 1].isFlagged){
        adjacentCells.push({
            x: x, y: y - 1
        });
    }

    return adjacentCells;
}

function gameRules() { //beállítja a játék szabályzathoz kapcsolódó event listener-eket
    const gameRulesContainer = document.getElementById('gameRulesContainer');
    const gameRulesButton = document.getElementById('gameRulesButton');
    const gameRules = document.getElementById('gameRules');

    gameRulesButton.addEventListener('click', (event) => {
        modalShowHideWithAnimation(true, 'gameRulesContainer');
    })

    gameRulesContainer.addEventListener('click', (event) => {
        modalShowHideWithAnimation(false, 'gameRulesContainer');
    })

    gameRules.addEventListener('click', (event) => {
        event.stopPropagation();
    })

    const gameRulesClose = document.getElementById('gameRulesClose');
    gameRulesClose.addEventListener('click', (event) => {
        modalShowHideWithAnimation(false, 'gameRulesContainer');
    })
}

function levels(){ //beállítja a szint választóhoz kapcsolódó event listener-eket
    const beginner = document.getElementById('beginner');
    beginner.addEventListener('click', (event)=>{
        x = 9;
        y = 9;
        startGame();
    })

    const advanced = document.getElementById('advanced');
    advanced.addEventListener('click', (event)=>{
        x = 16;
        y = 16;
        startGame();
    })

    const expert = document.getElementById('expert');
    expert.addEventListener('click', (event)=>{
        x = 16;
        y = 30;
        startGame();
    })

    const levelSelectorButton = document.getElementById('levelSelectorButton');
    const levelSelector = document.getElementById('levelSelector');
    const levels = document.getElementById('levels');

    // bezarodik, ha a modalon kívűl kattint
    levelSelector.addEventListener('click', (event) => {
        modalShowHideWithAnimation(false, 'levelSelector');
    })

    // meggátolja, hogy bezárodojon, ha a modalra rákattint
    levels.addEventListener('click', (event) => {
        event.stopPropagation();
    })

    levelSelectorButton.addEventListener('click', (event) => {
        modalShowHideWithAnimation(true, 'levelSelector');
    })//a szintválasztó gomb megnyomásával megjelennek a szintek gombjai

    const beginnerButton = document.getElementById('beginner');//ez a 3 eventlistener azt kezeli le, hogy mikor, melyik szint gombjai menjenek
    beginnerButton.addEventListener('click', (event) => {
        beginnerButton.disabled = true;
        advancedButton.disabled = false;
        expertButton.disabled = false;
        modalShowHideWithAnimation(false, 'levelSelector');
    })

    const advancedButton = document.getElementById('advanced');
    advancedButton.addEventListener('click', (event) => {
        advancedButton.disabled = true;
        beginnerButton.disabled = false;
        expertButton.disabled = false;
        modalShowHideWithAnimation(false, 'levelSelector');
    })

    const expertButton = document.getElementById('expert');
    expertButton.addEventListener('click', (event) => {
        expertButton.disabled = true;
        advancedButton.disabled = false;
        beginnerButton.disabled = false;
        modalShowHideWithAnimation(false, 'levelSelector');
    })

    const levelsClose = document.getElementById('levelsClose');
    levelsClose.addEventListener('click', (event) => {
        modalShowHideWithAnimation(false, 'levelSelector');
    })
}

function modalShowHideWithAnimation(isShown, modalContainerName) { //szint választó és a játék szabályzat animáció kezelése
    const modalContainer = document.getElementById(modalContainerName);
    const mainContainer = document.getElementById('mainContainer');
    const mainTitle = document.getElementById('mainTitle');

    if (!isShown) { // modalTarolo elrejtese
        modalContainer.classList.remove('popup-scale-in');
        setTimeout(() => {
            mainContainer.classList.add('fade-in');
            mainTitle.classList.add('fade-in');
            mainContainer.classList.remove('fade-out');
            mainTitle.classList.remove('fade-out');
        }, 150);

        setTimeout(() => {
            modalContainer.classList.remove('active');
        }, 300);

    } else { //modalTarolo megjelenitese
        modalContainer.classList.add('active');
        setTimeout(() => {
            mainContainer.classList.remove('fade-in');
            mainTitle.classList.remove('fade-in');
            modalContainer.classList.add('popup-scale-in');
            mainContainer.classList.add('fade-out');
            mainTitle.classList.add('fade-out');
        }, 0);
    }
}

function resetBoard(){ //alap állapotba állítja a játékot
    bombCount = 0;
    flagsCount = 0;
    isPlaying = false;
    isFirstClickHappened = false;
    boardMatrix = [];
    const flagsCounter = document.getElementsByClassName('flags-counter');
    if(flagsCounter && flagsCounter.length > 0){
        flagsCounter[0].remove();
    }
    modalShowHide(false, 'lost');
    modalShowHide(false, 'won');
}

function timer() { //létrehozza és elindítja az időzítőt
    if (interval) {
        resetTimer();
    }

    const startTime = Date.now();

    interval = setInterval(function() {
        const passedMilliseconds = Date.now() - startTime;
        const passedSeconds = Math.floor(passedMilliseconds / 1000);

        let seconds = passedSeconds % 60;
        let minutes = (passedSeconds - seconds)/60;

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        const timer = document.getElementById('timer');
        timer.textContent = `${minutes}:${seconds}`;

    }, 100)
}

function resetTimer() { //alapállapotba állítja az időzítőt
    stopTimer();
    const timer = document.getElementById('timer');
    timer.textContent = "00:00";
}

function stopTimer() { //megállítja az időzítőt
    clearInterval(interval);
}

function playMusic() { //elindítja a zenét és a hozzátartozó animációt
  music.play();
  isMusicPlaying = true;
  const cassetteWheels = document.getElementsByClassName('cassette-wheel');
  for (let i = 0; i < cassetteWheels.length; i++) {
      cassetteWheels[i].classList.add('cassette-wheel-rotate');
  }
} 

function stopMusic() { //megállítja a zenét és a hozzátartozó animációt
  isFirstMusicStoppingHappened = true;
  music.pause();
  isMusicPlaying = false;
    const cassetteWheels = document.getElementsByClassName('cassette-wheel');
    for (let i = 0; i < cassetteWheels.length; i++) {
        cassetteWheels[i].classList.remove('cassette-wheel-rotate');
    }
} 

function musicInitialization(){ //beállítja a zene gombjához tartozó event listener-t és a zenét
    music = document.getElementById("music");
    music.loop = true;

    const musicButton = document.getElementById('musicButton');

    musicButton.addEventListener('click', (event)=>{
        if (isMusicPlaying) {
            stopMusic();
        } else {
            playMusic();
        }
    })
}

function emojiInitialization() { //beállítja az újraindítás gombot
    const emojiButton = document.getElementById('emojiButton');
    emojiButton.addEventListener('click', (event) =>{
       startGame();
    });
}

function setEmojiFace(arc) { //beállítja a megadott ikont
    const emojiIcon = document.getElementById('emojiButton').querySelector('i');

    if (arc === "fa-face-smile") {
        emojiIcon.classList.remove('fa-face-tired', 'fa-face-laugh-beam');
        emojiIcon.classList.add('fa-face-smile');
    } else if (arc === "fa-face-tired") {
        emojiIcon.classList.remove('fa-face-smile', 'fa-face-laugh-beam');
        emojiIcon.classList.add('fa-face-tired');
    } else if (arc === "fa-face-laugh-beam") {
        emojiIcon.classList.remove('fa-face-tired', 'fa-face-smile');
        emojiIcon.classList.add('fa-face-laugh-beam');
    }
}

