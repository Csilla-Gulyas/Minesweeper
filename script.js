let bombakSzama = 0;
let zaszlokSzama = 0;
let jatszikE = false;
let elsoKattintasTortentE = false;
let x = 9;
let y = 9;
let palyaTomb;

jatekIndit();

function tombGeneral(x, y){
    const matrix = [];
    //létrehozunk egy két dimenziós objektum tömböt, aminek beállítjuk az alapértelmezett értékeit
    for(let i = 0; i < x; i++){
        const sorok = [];
        for(let j = 0; j < y; j++){
            sorok.push({
                feldorditottE: false,
                zaszlosE: false,
                bombaE: false,
                mezokErteke: 0
            });
        }
        matrix.push(sorok);
    }

    //bombák számának megadása a pálya mérete szerint, a pályák egyre nehezednek, ahogy nő a méretük, több a bomba százalékosan
    if(x === 9 && y === 9){
        bombakSzama = 10;
    }
    else if(x === 16 && y === 16){
        bombakSzama = 40;
    }
    else if(x === 16 && y === 30){
        bombakSzama = 99;
    }
    return matrix;
}

function palyaFeltoltes(matrix, indexX, indexY){
    
    //létrehozunk egy két dimenziós tömböt, amiben a matrix tömb összes indexét eltároljuk
    const koordinatak = [];
    for(let i = 0; i < x; i++){
        for(let j = 0; j < y; j++){
            if (i !== indexX || j !== indexY) { //első klikk koordináták, nem lehet bomba (indexX és indexY)
                koordinatak.push([i, j]);
            }
        }
    }

    //Fisher-Yates algoritmus
    for(let i = koordinatak.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [koordinatak[i], koordinatak[j]] = [koordinatak[j], koordinatak[i]];
    }

    //bombák véletlenszerű elhelyezése
    for(let i = 0; i < bombakSzama; i++){
        const [sor, oszlop] = koordinatak[i];
        //console.log(koordinatak[i]);
        matrix[sor][oszlop].bombaE = true;
    }

    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[i].length; j++){
            //console.log(matrix[i] [j].bombaE);
        }
    }

    //beszámozza a mezőket
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[i].length; j++){
            if(matrix[i] [j].bombaE){//a bomba mezőket járja körbe és növeli az értékét
                //bal felső mező
                if(i - 1 >= 0 && i - 1 < matrix[i].length && j - 1 >= 0 && j - 1 < matrix[i].length && !matrix[i - 1] [j - 1].bombaE){
                    matrix[i - 1] [j - 1].mezokErteke++;
                }
                //felső mező
                if(i - 1 >= 0 && i - 1 < matrix[i].length && j >= 0 && j < matrix[i].length && !matrix[i - 1] [j].bombaE){
                    matrix[i - 1] [j].mezokErteke++;
                }
                 //jobb felső mező
                 if(i - 1 >= 0 && i - 1 < matrix[i].length && j + 1 >= 0 && j + 1 < matrix[i].length && !matrix[i - 1] [j + 1].bombaE){
                    matrix[i - 1] [j + 1].mezokErteke++;
                }
                //job oldali mező
                if(i >= 0 && i < matrix[i].length && j + 1 >= 0 && j + 1 < matrix[i].length && !matrix[i] [j + 1].bombaE){
                    matrix[i] [j + 1].mezokErteke++;
                }
                //jobb alsó mező
                if(i + 1 >= 0 && i + 1 < matrix[i].length && j + 1 >= 0 && j + 1 < matrix[i].length && !matrix[i + 1] [j + 1].bombaE){//azt vizsgáljuk-e, hogy bomba, mert akkor nem kell az értékét növelni
                    matrix[i + 1] [j + 1].mezokErteke++;
                }
                //alsó mező
                if(i + 1 >= 0 && i + 1 < matrix[i].length && j >= 0 && j < matrix[i].length && !matrix[i + 1] [j].bombaE){
                    matrix[i + 1] [j].mezokErteke++;
                }
                //bal alsó mező
                if(i + 1 >= 0 && i + 1 < matrix[i].length && j - 1 >= 0 && j - 1 < matrix[i].length && !matrix[i + 1] [j - 1].bombaE){
                    matrix[i + 1] [j - 1].mezokErteke++;
                }
                //bal oldali mező
                if(i >= 0 && i < matrix[i].length && j - 1 >= 0 && j - 1 < matrix[i].length && !matrix[i] [j - 1].bombaE){
                    matrix[i] [j - 1].mezokErteke++;
                }
            }
        }
    }

    // for(let i = 0; i < matrix.length; i++){
    //     let tesztString = "";
    //     for(let j = 0; j < matrix[i].length; j++){
    //         let mezokErtekeString = matrix[i] [j].bombaE ? "#" : matrix[i] [j].mezokErteke;
    //         tesztString += mezokErtekeString + ", ";
    //     }
    //     console.log(tesztString);
    // }
    return matrix;
}

function jatekIndit(){
    palyaTomb = tombGeneral(x, y, 10);
    palyaGeneral(palyaTomb);
}

function palyaGeneral(matrix){
    const jatekTabla = document.getElementById('jatekTabla');
    jatekTabla.innerHTML = '';

    jatekTabla.style.display = 'grid';
    jatekTabla.style.gridTemplateRows = `repeat(${matrix.length}, 30px)`;//sorok száma dinamikusan
    jatekTabla.style.gridTemplateColumns = `repeat(${matrix[0].length}, 30px)`;//oszlopok száma dinamikusan
    jatekTabla.style.border = '2px solid black';
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[i].length; j++){
            const matrixAktualisEleme = matrix[i] [j];
            const ujMezo = mezoKeszito(i, j, matrixAktualisEleme);//mezoKeszito metódus segítségével elkészítjük a mezőket
            jatekTabla.appendChild(ujMezo);//feltölti a táblát mezőkkel
        }
    }
    jatekTabla.classList.add('tabla');
}

function mezoKeszito(x, y, mezo){
    const ujMezo = document.createElement('div');//mezok hozzáadása
    ujMezo.dataset.indexX = x.toString();
    ujMezo.dataset.indexY = y.toString();
    ujMezo.classList.add('mezok');
    ujMezo.style.border = '2px solid black';
    if(!mezo.feldorditottE){
        ujMezo.classList.add('leforditott');
    }
    ujMezo.addEventListener('click', (event)=>{//Klikkelés lekezelése szám mezőnél, bombánál és üres mezőnél
        if(ujMezo.classList.contains('zaszlo')){//ha zászló van rajta bal kattintás nem lehetséges
            return;
        }
        mezo.feldorditottE = true;
        const indexX = parseInt(event.target.dataset.indexX); //aktuális mező koordinátájának elmentése
        const indexY = parseInt(event.target.dataset.indexY);
        console.log(indexX, indexY);
        ujMezo.classList.remove('leforditott');
        if(!elsoKattintasTortentE){
            palyaTomb = palyaFeltoltes(palyaTomb, indexX, indexY)
            elsoKattintasTortentE = true;
        }
        if(mezo.bombaE){
            ujMezo.classList.add('bomba');
            //bombaKattint(indexX, indexY);
            console.log('BUMMM');
        }
        else if(mezo.mezokErteke !== 0){
            ujMezo.classList.add('szam');
            ujMezo.innerText = mezo.mezokErteke;
        }
        else{
            ujMezo.classList.add('ures');
            uresKattint(indexX, indexY);
        }
    })

    ujMezo.addEventListener('contextmenu', (event)=>{//jobb klikkel zászló felrakása a mezőre, ha fent van még egy jobb klikkel le lehet venni
        event.preventDefault();
        if (!mezo.feldorditottE) {
            if (!ujMezo.classList.contains('zaszlo')) {
                ujMezo.classList.add('zaszlo'); // Hozzáadja a zászlót
            }
            else
            {
                ujMezo.classList.remove('zaszlo'); // Ha már van zászló, eltávolítja
                ujMezo.classList.add('leforditott');
            }
        }
    })
    return ujMezo;
}

function uresKattint(x, y){
    console.log('ures');
}






