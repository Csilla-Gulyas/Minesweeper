let bombakSzama = 0;
let zaszlokSzama = 0;
let jatszikE = false;
let elsoKattintasTortentE = false;
let x = 9;
let y = 9;
let palyaTomb;
let zene;

zeneInicializalas();
jatekIndit();
szintek();

function tombGeneral(x, y){
    const matrix = [];
    //létrehozunk egy két dimenziós objektum tömböt, aminek beállítjuk az alapértelmezett értékeit
    for(let i = 0; i < x; i++){
        const sorok = [];
        for(let j = 0; j < y; j++){
            sorok.push({
                felforditottE: false,
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
                if(i - 1 >= 0 && i - 1 < matrix.length && j - 1 >= 0 && j - 1 < matrix[i].length && !matrix[i - 1] [j - 1].bombaE){
                    matrix[i - 1] [j - 1].mezokErteke++;
                }
                //felső mező
                if(i - 1 >= 0 && i - 1 < matrix.length && j >= 0 && j < matrix[i].length && !matrix[i - 1] [j].bombaE){
                    matrix[i - 1] [j].mezokErteke++;
                }
                 //jobb felső mező
                 if(i - 1 >= 0 && i - 1 < matrix.length && j + 1 >= 0 && j + 1 < matrix[i].length && !matrix[i - 1] [j + 1].bombaE){
                    matrix[i - 1] [j + 1].mezokErteke++;
                }
                //job oldali mező
                if(i >= 0 && i < matrix.length && j + 1 >= 0 && j + 1 < matrix[i].length && !matrix[i] [j + 1].bombaE){
                    matrix[i] [j + 1].mezokErteke++;
                }
                //jobb alsó mező
                if(i + 1 >= 0 && i + 1 < matrix.length && j + 1 >= 0 && j + 1 < matrix[i].length && !matrix[i + 1] [j + 1].bombaE){
                    matrix[i + 1] [j + 1].mezokErteke++;
                }
                //alsó mező
                if(i + 1 >= 0 && i + 1 < matrix.length && j >= 0 && j < matrix[i].length && !matrix[i + 1] [j].bombaE){
                    matrix[i + 1] [j].mezokErteke++;
                }
                //bal alsó mező
                if(i + 1 >= 0 && i + 1 < matrix.length && j - 1 >= 0 && j - 1 < matrix[i].length && !matrix[i + 1] [j - 1].bombaE){
                    matrix[i + 1] [j - 1].mezokErteke++;
                }
                //bal oldali mező
                if(i >= 0 && i < matrix.length && j - 1 >= 0 && j - 1 < matrix[i].length && !matrix[i] [j - 1].bombaE){
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
    palyaTisztitas();
    palyaTomb = tombGeneral(x, y);
    palyaGeneral(palyaTomb);
    jatszikE = true;
    zaszloKezdoAllapot();
}

function palyaGeneral(matrix){
    const jatekTabla = document.getElementById('jatekTabla');
    jatekTabla.innerHTML = '';

    jatekTabla.style.display = 'grid';
    jatekTabla.style.gridTemplateRows = `repeat(${matrix.length}, 40px)`; // Sorok számának dinamikus beállítása
    jatekTabla.style.gridTemplateColumns = `repeat(${matrix[0].length}, 40px)`; // Oszlopok számának dinamikus beállítása
    jatekTabla.style.width = '100%';
    jatekTabla.style.height = '100%';
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
    const kontenerDiv = document.createElement('div');
    kontenerDiv.classList.add('mezo-kontener'); // új köztes div

    const ujMezo = document.createElement('div');//mezok hozzáadása
    ujMezo.dataset.indexX = x.toString();
    ujMezo.dataset.indexY = y.toString();
    ujMezo.classList.add('mezok');
    
    if(!mezo.felforditottE){
        ujMezo.classList.add('leforditott');
    }
    ujMezo.addEventListener('click', (event)=>{//Klikkelés lekezelése szám mezőnél, bombánál és üres mezőnél
        if(!jatszikE){//ha nem játszik, ne működjenek az event listener-ek
            return;
        }
        if(ujMezo.classList.contains('zaszlo')){//ha zászló van rajta bal kattintás nem lehetséges
            return;
        }
        mezo.felforditottE = true;
        const indexX = parseInt(event.target.dataset.indexX); //aktuális mező koordinátájának elmentése
        const indexY = parseInt(event.target.dataset.indexY);
        console.log(indexX, indexY);
        ujMezo.classList.remove('leforditott');
        if(!elsoKattintasTortentE){
            palyaTomb = palyaFeltoltes(palyaTomb, indexX, indexY)
            elsoKattintasTortentE = true;
            zeneLejatszas();
        }
        if(mezo.bombaE){
            ujMezo.classList.add('bomba');
            bombaKattint(indexX, indexY);
        }
        else if(mezo.mezokErteke !== 0){
            ujMezo.classList.add('szam');
            ujMezo.innerText = mezo.mezokErteke;
            nyert();
        }
        else{
            mezo.felforditottE = false;
            uresKattint(indexX, indexY);
        }
    })

    ujMezo.addEventListener('contextmenu', (event)=>{//jobb klikkel zászló felrakása a mezőre, ha fent van még egy jobb klikkel le lehet venni
        event.preventDefault();
        const indexX = parseInt(event.target.dataset.indexX); //aktuális mező koordinátájának elmentése
        const indexY = parseInt(event.target.dataset.indexY);
        let csokkentsukE = true;
        if(!jatszikE){//ha nem játszik, ne működjenek az event listener-ek
            return;
        }
        if(!elsoKattintasTortentE){
            zeneLejatszas();
        }
        if (!mezo.felforditottE) {
            if (!palyaTomb[indexX][indexY].zaszlosE) {
                csokkentsukE = true;
                zaszloSzamlalo(csokkentsukE, indexX, indexY);
                if(elsoKattintasTortentE){
                    nyert();
                }
            }
            else
            {
                csokkentsukE = false;
                zaszloSzamlalo(csokkentsukE, indexX, indexY);
            }
        }
    })
    kontenerDiv.appendChild(ujMezo);
    return kontenerDiv;
}

function bombaKattint(x, y){
    jatszikE = false; //játék vége
    for(let i = 0; i < palyaTomb.length; i++){
        for(let j = 0; j < palyaTomb[i].length; j++){
            const mezo = palyaTomb[i][j];
            if(mezo.bombaE){
                const elem = elementLekereseIndexekkel(i, j);
                //TODO: lekezelni, ha fel van fordítva
                elem.classList.remove('leforditott');
                elem.classList.add('bomba');
                if(i == x && j == y){
                    elem.classList.add('aBomba'); //az a bomba amire először kattintottunk, így külön lehet formázni
                }
            }
        }
    }
    for(let i = 0; i < palyaTomb.length; i++){
        for(let j = 0; j < palyaTomb[i].length; j++){
            const mezo = palyaTomb[i][j];
            if(mezo.zaszlosE){
                if(!mezo.bombaE){
                    const tevesZaszlo = elementLekereseIndexekkel(i, j);
                    tevesZaszlo.classList.add('tevesZaszlo');
                }
            }
        }
    }
    
    const vesztettel = document.createElement('div'); //vesztés tényének kiírása egy div-be
    vesztettel.textContent = 'Vesztettél!';
    vesztettel.classList.add('vesztettel');
    vesztettel.classList.add('beugroDoboz'); //ezt majd a nyertes div-hez is akarom, alapvető formázások ugyanazok
    document.body.appendChild(vesztettel);
}

function elementLekereseIndexekkel(x, y){
    const elem = document.querySelector(`[data-index-x="${x}"][data-index-y="${y}"]`);
    return elem;
}


function nyert(){
    let nyertEFelfedve = true;
    let nyertEZaszlokkal = true;
    let nincsTevesZaszlo = true;
    for(let i = 0; i < palyaTomb.length; i++){
        for(let j = 0; j < palyaTomb[i].length; j++){
            const mezo = palyaTomb[i][j];
            if(mezo.bombaE && !mezo.zaszlosE){//van-e olyan mező, ami bomba, de nincs rajta zászló
                nyertEZaszlokkal = false;
            }
            if(!mezo.bombaE && !mezo.felforditottE){//van-e olyan mező, ami bomba, de nincs felfordítva
                nyertEFelfedve = false;
            }
            if (!mezo.bombaE && mezo.zaszlosE) {//van-e olyan mező, ami nem bomba, de van rajta zászló
                nincsTevesZaszlo = false;
            }
        }
    }

    if(nyertEFelfedve || (nyertEZaszlokkal && nincsTevesZaszlo)){
        jatszikE = false;
        const nyertel = document.createElement('div'); //nyerés tényének kiírása egy div-be
        nyertel.textContent = 'Gratulálok, nyertél!';
        nyertel.classList.add('nyertel');
        nyertel.classList.add('beugroDoboz');
        document.body.appendChild(nyertel);
    }
}

function zaszloKezdoAllapot(){
    zaszlokSzama = bombakSzama;
    const zaszlok = document.createElement('div'); //zaszló számláló div
    zaszlok.textContent = zaszlokSzama; //megadom az értékét
    zaszlok.classList.add('zaszloSzamol');
    const tablaFelett = document.getElementById('tablaFelett');
    tablaFelett.insertBefore(zaszlok, tablaFelett.children[1]);
}

function zaszloSzamlalo(csokkentsukE, indexX, indexY){
    const ujMezo = elementLekereseIndexekkel(indexX, indexY);
    if(csokkentsukE){
        if(zaszlokSzama >= 1){
            ujMezo.classList.add('zaszlo'); // Hozzáadja a zászlót
            
            palyaTomb[indexX][indexY].zaszlosE = true;

            zaszlokSzama--;
            const zaszlok = document.getElementsByClassName('zaszloSzamol');
            zaszlok[0].textContent = zaszlokSzama;
        }
    }
    else
    {
        if(zaszlokSzama < bombakSzama){
            ujMezo.classList.remove('zaszlo'); // Ha már van zászló, eltávolítja
            //ujMezo.classList.add('leforditott');

            palyaTomb[indexX][indexY].zaszlosE = false;

            zaszlokSzama++;
            const zaszlok = document.getElementsByClassName('zaszloSzamol');
            zaszlok[0].textContent = zaszlokSzama;
        }
    }
}

function uresKattint(x, y){
    let ellenorizendoElemek = [];
    ellenorizendoElemek.push({x, y});

    for (let i = 0; i < ellenorizendoElemek.length; i++) {
        const aktElem = ellenorizendoElemek[i];
        let ujElemek = uresKattintKornyezoMezok(aktElem.x,  aktElem.y);
        ellenorizendoElemek.push(...ujElemek);
    }

    nyert();
}

function uresKattintKornyezoMezok(x, y) {
    let ujEllenorizendoElemek = [];

    if(palyaTomb[x][y].felforditottE){
        return ujEllenorizendoElemek;
    }
    else if (palyaTomb[x][y].bombaE){
        return ujEllenorizendoElemek;
    }
    else if(palyaTomb[x][y].mezokErteke > 0 && palyaTomb[x][y].mezokErteke < 9){
        felfed(x, y);
        return ujEllenorizendoElemek;
    }
    else{
        felfed(x, y);
        ujEllenorizendoElemek = kornyezoMezokLekerese(x,y, palyaTomb);
    }

    return ujEllenorizendoElemek;
}

function felfed(x, y) {
    let palyaAktEleme = palyaTomb[x][y];

    // ha bomba nem fut tovább a metódus
    if (palyaAktEleme.bombaE) {
        return;
    }

    const mezo = elementLekereseIndexekkel(x, y);

    if (palyaAktEleme.mezokErteke !== 0) {
        mezo.classList.add('szam');
        mezo.innerText = palyaAktEleme.mezokErteke;
    } else {
        mezo.classList.add('ures');
    }

    mezo.classList.remove('leforditott')
    palyaAktEleme.felforditottE = true;
}

function kornyezoMezokLekerese(x,y, matrix) {
    let kornyezoMezok = [];

    //bal felső mező
    if(x - 1 >= 0 && x - 1 < matrix.length && y - 1 >= 0 && y - 1 < matrix[x].length && !matrix[x - 1] [y - 1].bombaE && !matrix[x - 1] [y - 1].bombaE.felforditottE){
        kornyezoMezok.push({
            x: x - 1, y: y - 1
        });
    }
    //felső mező
    if(x - 1 >= 0 && x - 1 < matrix.length && y >= 0 && y < matrix[x].length && !matrix[x - 1] [y].bombaE && !matrix[x - 1] [y].felforditottE){
        kornyezoMezok.push({
            x: x - 1, y: y
        });
    }
    //jobb felső mező
    if(x - 1 >= 0 && x - 1 < matrix.length && y + 1 >= 0 && y + 1 < matrix[x].length && !matrix[x - 1] [y + 1].bombaE && !matrix[x - 1] [y + 1].felforditottE){
        kornyezoMezok.push({
            x: x - 1, y: y + 1
        });
    }
    //job oldali mező
    if(x >= 0 && x < matrix.length && y + 1 >= 0 && y + 1 < matrix[x].length && !matrix[x] [y + 1].bombaE && !matrix[x] [y + 1].felforditottE){
        kornyezoMezok.push({
            x: x, y: y + 1
        });
    }
    //jobb alsó mező
    if(x + 1 >= 0 && x + 1 < matrix.length && y + 1 >= 0 && y + 1 < matrix[x].length && !matrix[x + 1] [y + 1].bombaE && !matrix[x + 1] [y + 1].felforditottE){
        kornyezoMezok.push({
            x: x + 1, y: y + 1
        });
    }
    //alsó mező
    if(x + 1 >= 0 && x + 1 < matrix.length && y >= 0 && y < matrix[x].length && !matrix[x + 1] [y].bombaE && !matrix[x + 1] [y].felforditottE){
        kornyezoMezok.push({
            x: x + 1, y: y
        });
    }
    //bal alsó mező
    if(x + 1 >= 0 && x + 1 < matrix.length && y - 1 >= 0 && y - 1 < matrix[x].length && !matrix[x + 1] [y - 1].bombaE && !matrix[x + 1] [y - 1].felforditottE){
        kornyezoMezok.push({
            x: x + 1, y: y - 1
        });
    }
    //bal oldali mező
    if(x >= 0 && x < matrix.length && y - 1 >= 0 && y - 1 < matrix[x].length && !matrix[x] [y - 1].bombaE && !matrix[x] [y - 1].felforditottE){
        kornyezoMezok.push({
            x: x, y: y - 1
        });
    }

    return kornyezoMezok;
}

function szintek(){
    const kezdo = document.getElementById('kezdo');
    kezdo.addEventListener('click', (event)=>{
        x = 9;
        y = 9;
        jatekIndit();
    })

    const halado = document.getElementById('halado');
    halado.addEventListener('click', (event)=>{
        x = 16;
        y = 16;
        jatekIndit();
    })

    const szakerto = document.getElementById('szakerto');
    szakerto.addEventListener('click', (event)=>{
        x = 16;
        y = 30;
        jatekIndit();
    })
}

const szintValasztoGomb = document.getElementById('szintValasztoGomb');
const szintValaszto = document.getElementById('szintValaszto');
szintValasztoGomb.addEventListener('click', (event)=>{
    szintValaszto.style.display = 'block';
})//a szintválasztó gomb megnyomásával megjelennek a szintek gombjai

const kezdoGomb = document.getElementById('kezdo');//ez a 3 eventlistener azt kezeli le, hogy mikor, melyik szint gombjai menjenek
kezdoGomb.addEventListener('click', (event)=>{
    kezdoGomb.disabled = true;
    haladoGomb.disabled = false;
    szakertoGomb.disabled = false;
})

const haladoGomb = document.getElementById('halado');
haladoGomb.addEventListener('click', (event)=>{
    haladoGomb.disabled = true;
    kezdoGomb.disabled = false;
    szakertoGomb.disabled = false;
})

const szakertoGomb = document.getElementById('szakerto');
szakertoGomb.addEventListener('click', (event)=>{
    szakertoGomb.disabled = true;
    haladoGomb.disabled = false;
    kezdoGomb.disabled = false;
})

function palyaTisztitas(){
    bombakSzama = 0;
    zaszlokSzama = 0;
    jatszikE = false;
    elsoKattintasTortentE = false;
    palyaTomb = [];
    const zaszlok = document.getElementsByClassName('zaszloSzamol');
    if(zaszlok && zaszlok.length > 0){
        zaszlok[0].remove();
    }
    const vesztettel = document.getElementsByClassName('vesztettel');
    if(vesztettel && vesztettel.length > 0){
        vesztettel[0].remove();
    }
    const nyertel = document.getElementsByClassName('nyertel');
    if(nyertel && nyertel.length > 0){
        nyertel[0].remove();
    }
}



let perc = 0;
let masodperc = 0;

function idozito() {
  
}

function zeneLejatszas() { 
  zene.play(); 
} 

function zeneMegallitas() { 
  zene.pause(); 
} 

function zeneInicializalas(){
    zene = document.getElementById("zene"); 
    zene.loop = true;

    const lejatszasGomb = document.getElementById('lejatszas');
    const megallitasGomb = document.getElementById('megallitas');

    lejatszasGomb.addEventListener('click', (event)=>{
        zeneLejatszas();
        lejatszasGomb.hidden = true;
        megallitasGomb.hidden = false;
    })

    megallitasGomb.addEventListener('click', (event)=>{
        zeneMegallitas();
        megallitasGomb.hidden = true;
        lejatszasGomb.hidden = false;
    })
}

