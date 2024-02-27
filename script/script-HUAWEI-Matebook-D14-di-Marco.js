let giocabutton = document.getElementById("gioca")
let backtohomebutton = document.querySelectorAll(".backtohome")
let regolebutton = document.getElementById("regole")
let x5button = document.getElementById("x5")
let x6button = document.getElementById("x6")
let x7button =  document.getElementById("x7")
let xcasualebutton = document.getElementById("xcasuale")
let statoattuale = ""
let colori = new Map()
let avviato = false
let scambio 
let eliminaegenerata = []
colori = {"x5":"#518c38","x6":"#b1670c","x7":"#b10c0c","xcasuale":"#00000075"}
let punti = [1,2,3,5]
let oggetti = ["secco.png","carta.png","plastica.png","vetro.png","poterericiclo.png","amorenatura.png"]
let punteggio = [0,0,0,0]
let spawnato = false
document.querySelector(".homescreen").style.display = "flex"

setTimeout(function(){
    document.querySelector(".loadscreen").addEventListener("click",()=>{
        setTimeout(()=>{
            transizione(document.querySelector(".loadscreen"),document.querySelector(".homescreen"))
        },50)
    })
},1650)

/*Gestione Tabella*/
function transizione(inn,outt)
{
    setTimeout(()=>{
        document.querySelector(".blocco").style.display = "block"
        inn.style.animation = "transitionout 0.6s ease forwards"
        outt.style.animation = "transitionin 0.6s ease forwards"
        outt.style.display = "flex"
        setTimeout(function(){
            inn.style.display  ="none"
            document.querySelector(".blocco").style.display = "none"
        },600)
    },50)
}
function transizioneavanzata(inn,outt,w)
{
    setTimeout(()=>{
        document.querySelector
        (".blocco").style.display = "block"
        inn.style.animation = "transitionout 0.6s ease forwards"
        outt.style.animation = "transitionin 0.6s ease forwards"
        document.querySelector(".generalover").style.display = "block"
        document.querySelector(".generalover").style.animation = "transitionover 0.6s ease forwards"
        setTimeout(function(){
            document.getElementById("sfondo").src = "img/"+w+".jpg"
        },401)
        outt.style.display = "flex"
        setTimeout(function(){
            inn.style.display  ="none"
            document.querySelector(".generalover").style.display = "none"
            document.querySelector(".blocco").style.display = "none"
        },600)
        
    },50)
}
function genid()
{
    let caratteri = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890!£$%&/"
    caratteri = caratteri.split("")
    let volte = Math.floor(Math.random()*(10-5)+5)
    let st = ""
    for(let i = 0; i<volte; i++)
    {
        let cv = caratteri[Math.floor(Math.random()*caratteri.length)]
        st = st + cv
    }
    return st
}
function generazione(num)
{
    let matrice = []
    let riga = []
    for(let i = 0;i<num;i++)
    {
        for(let j = 0;j<num;j++)
        {
            let valo = []
            let p = Math.round(Math.random() * (3))
            let idunivoco = genid()
            let codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p] +"'></div>"
            valo = [p,codice,idunivoco]
            if(j!=0 || i!=0)
            {
                while(valo[0] == (j!=0 ? riga[j-1][0] : -1) || valo[0] == (i!=0 ? matrice[i-1][j][0] : -1))
                {
                    p = Math.round(Math.random() * (3))
                    idunivoco = genid()
                    codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p] +"'></div>"
                    valo = [p,codice,idunivoco]
                }
            }
            riga[j] = valo
        }
        matrice[i] = [...riga]
        riga = []
    }
    return matrice
}
function generaelemento(posizioni,tipo,matrice)
{
    if(tipo != undefined)
    {
        let valo = []
        let idunivoco = genid()
        let codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + tipo +"'><img class='immaginecella' src='img/" + oggetti[tipo] +"'></div>"
        valo = [tipo,codice,idunivoco]
        return valo
    }
    else
    {
        let valo = []
        let p = Math.round(Math.random() * (3))
        let idunivoco = genid()
        let codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p] +"'></div>"
        valo = [p,codice,idunivoco]
        if(posizioni[0]+1<matrice.length && matrice[posizioni[0]+1][posizioni[1]] != undefined)
        {
            while(matrice[posizioni[0]+1][posizioni[1]][0] == tipo)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + tipo +"'><img class='immaginecella' src='img/" + oggetti[tipo] +"'></div>"
                valo = [tipo,codice,idunivoco]
            }
        }
        if(posizioni[0]-1>=0 && matrice[posizioni[0]-1][posizioni[1]] != undefined)
        {
            while(matrice[posizioni[0]-1][posizioni[1]][0] == tipo)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + tipo +"'><img class='immaginecella' src='img/" + oggetti[tipo] +"'></div>"
                valo = [tipo,codice,idunivoco]
            }
        }
        if(posizioni[1]+1 < matrice[posizioni[0]].length && matrice[posizioni[0]][posizioni[1]+1] != undefined)
        {
            while(matrice[posizioni[0]][posizioni[1]+1][0] == tipo)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + tipo +"'><img class='immaginecella' src='img/" + oggetti[tipo] +"'></div>"
                valo = [tipo,codice,idunivoco]
            }
        }
        if(posizioni[1]-1 >=0 && matrice[posizioni[0]][posizioni[1]-1] != undefined)
        {
            while(matrice[posizioni[0]][posizioni[1]-1][0] == tipo)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + tipo +"'><img class='immaginecella' src='img/" + oggetti[tipo] +"'></div>"
                valo = [tipo,codice,idunivoco]
            }
        }
        return valo
    }
}
console.log(punteggio[-1])
function stampaggiorna(matrix)
{
    let stringa = ""
    for(let i = 0;i<matrix.length;i++)
    {
        let r = "<div class='riga'>"
        for(let j = 0;j<matrix[i].length;j++)
        {
            if(matrix[i][j] == undefined)
            {
                r = r + "<div id='undefined' class='cella'></div>"
            }
            else
            {
                r = r + matrix[i][j][1]
            }
        }
        r = r + "</div>"
        stringa = stringa + r
    }
    document.querySelector(".appiglio").innerHTML = stringa
    document.querySelectorAll(".cella").forEach(cella => {
        if(spawnato == true)
        {
            cella.style.animation = "compari 0.5s ease"
        }
        else
        {
        }
        cella.style.display = "flex"
    })
    if(spawnato == false)
    {
        document.querySelector(".appiglio").style.animation = "se 0.3s ease forwards"
        document.querySelector(".appiglio").style.display = "flex"
    }
    spawnato = true
    let celle = document.querySelectorAll(".cella")
    celle.forEach(cella => {
        cella.addEventListener("click",(e)=>{
            let attuale = e.currentTarget
            if(attuale.id == 'undefined')
            {
            }
            else if(attuale.id == '4' || attuale.id == '5' && scambio == undefined)
            {
                let posatu = individua(attuale.getAttribute('idunivoco'),matrix)
                let posizioni = [posatu.i,posatu.j]
                let k = effettospeciale(attuale.id,posizioni,matrix)
                matrix = k[0]
                for(let i = 0; i<k[1].length;i++)
                {
                    if(k[1][i][0] < 4)
                    {
                        punteggio[k[1][i][0]] = parseInt(punteggio[k[1][i][0]]) + punti[k[1][i][0]]
                    }
                }
                matrix = shift(matrix)
                matrix = rigenera(matrix)
                stampaggiorna(matrix)
                scambio = undefined
            }
            else if(scambio == undefined)
            {
                scambio = attuale
                cella.style.border = "solid #c9b27d 10px"
            }
            else if(scambio.getAttribute('idunivoco') == attuale.getAttribute('idunivoco') && scambio != undefined)
            {
                cella.style.border = "solid #c9b27d 10px"
            }
            else if(scambio.getAttribute('idunivoco') != attuale.getAttribute('idunivoco') && attuale.id != "undefined" && scambio != undefined && (scambio.id != '5' || scambio.id != '4'))
            {
                let idunivocoattuale = attuale.getAttribute('idunivoco')
                let idunivocoscambiare = scambio.getAttribute('idunivoco')
                let posizioneelemento = individua(idunivocoattuale,matrix)
                let  posizioneelemento2 = individua(idunivocoscambiare,matrix)
                if(vicino(posizioneelemento,posizioneelemento2))
                {
                    matrix = swap(posizioneelemento,posizioneelemento2,matrix)
                    let posizioni = [posizioneelemento.i,posizioneelemento.j]
                    let posizioni2 = [posizioneelemento2.i,posizioneelemento2.j]
                    eliminaegenerata = [controllo(matrix[posizioni[0]][posizioni[1]][0],posizioni,matrix),controllo(matrix[posizioni2[0]][posizioni2[1]][0],posizioni2,matrix)]
                    if(eliminaegenerata[0] != false)
                    {
                        for(let i = 0; i<eliminaegenerata[0][0].length;i++)
                        {
                            punteggio[eliminaegenerata[0][0][i][0]] = parseInt(punteggio[eliminaegenerata[0][0][i][0]]) + punti[eliminaegenerata[0][0][i][0]]
                        }
                        matrix = elimina(eliminaegenerata[0][0],matrix)
                    }
                    if(eliminaegenerata[1] != false)
                    {
                        for(let i = 0; i<eliminaegenerata[1][0].length;i++)
                        {
                            punteggio[eliminaegenerata[1][0][i][0]] = parseInt(punteggio[eliminaegenerata[1][0][i][0]]) + punti[eliminaegenerata[1][0][i][0]]
                        }
                        matrix = elimina(eliminaegenerata[1][0],matrix)
                    }
                    console.log(eliminaegenerata)
                    creaelementocondizionale(eliminaegenerata[0][1],posizioni,matrix)
                    creaelementocondizionale(eliminaegenerata[1][1],posizioni2,matrix)    
                    cella.removeAttribute("style")
                    matrix = shift(matrix)
                    matrix = rigenera(matrix)
                    stampaggiorna(matrix)
                    scambio = undefined
                }
            }
            console.log(punteggio)
        })
    })
}
function individua(id1, matrice)
{
    let pos1
    for(let onkai = 0; onkai < matrice.length; onkai++) {
        for(let onka = 0; onka < matrice[onkai].length; onka++) {
            if(matrice[onkai][onka] != undefined && matrice[onkai][onka][2] === id1) {
                pos1 = {i: onkai, j: onka};
            }
        }
    }
    return pos1
}
function swap(pos1,pos2,matrice) {
    if(pos1 && pos2) {
        let temp = matrice[pos1.i][pos1.j];
        matrice[pos1.i][pos1.j] = matrice[pos2.i][pos2.j];
        matrice[pos2.i][pos2.j] = temp;
    }
    return matrice
}
function vicino(posizioni1,posizioni2)
{
    let gapx = Math.abs(posizioni1.j - posizioni2.j)
    let gapy = Math.abs(posizioni1.i - posizioni2.i)
    if((gapx == 0 && gapy == 1) || (gapy == 0 && gapx == 1))
    {
        return true
    }
    else
    {
        console.log("nope")
        return false
    }
}
function controllo(tipo, posizioni, matrice) {
    let adiacenti = [];

    for(let direzione = -1; direzione <= 1; direzione += 2) {
        for(let i = posizioni[0] + direzione; i >= 0 && i < matrice.length && matrice[i][posizioni[1]] && tipo === matrice[i][posizioni[1]][0]; i += direzione) 
        {
            adiacenti.push(matrice[i][posizioni[1]]);
        }
    }
    for(let direzione = -1; direzione <= 1; direzione += 2) 
    {
        for(let j = posizioni[1] + direzione; j >= 0 && j < matrice[posizioni[0]].length && matrice[posizioni[0]][j] && tipo === matrice[posizioni[0]][j][0]; j += direzione)
        {
            adiacenti.push(matrice[posizioni[0]][j]);
        }
    }
    
    let elemdaeliminare = [];
    for(let i = 0; i < adiacenti.length; i++) 
    {
        if(elemdaeliminare.indexOf(adiacenti[i]) == -1) 
        {
            elemdaeliminare.push(adiacenti[i]);
        }
    }
    elemdaeliminare.push(matrice[posizioni[0]][posizioni[1]]);

    if(elemdaeliminare.length > 2) 
    {
        return [elemdaeliminare, elemdaeliminare.length];
    } 
    else 
    {
        return false;
    }
}
function elimina(elemdaeliminare,matrice)
{
    for(let i = 0; i<matrice.length;i++)
    {
        for(let j = 0;j<matrice[i].length;j++)
        {
            if(elemdaeliminare.indexOf(matrice[i][j]) != -1)
            {
                matrice[i][j] = undefined
            }
        }
    }
    return matrice
}
function creaelementocondizionale(long,posizioni,matrice)
{
    if(long >= 5)
    {
        matrice[posizioni[0]][posizioni[1]] = generaelemento(posizioni,5,matrice)
    }
    else if(long == 4)
    {
        matrice[posizioni[0]][posizioni[1]] = generaelemento(posizioni,4,matrice)
    }

    return matrice
}
function effettospeciale(tipo, posizioni, matrice) 
{
    let darestituire = [];
    let i = posizioni[0];
    let j = posizioni[1];
    matrice[i][j] = undefined;
    if (i > 0 && matrice[i-1][j] != undefined) 
    {
        if( matrice[i-1][j][0] == 4 ||matrice[i-1][j][0] == 5)
        {
            let g = [i-1,j]
            let k = effettospeciale(matrice[i-1][j][0],g,matrice)
            matrice = k[0]
            darestituire = k[1]
        }
        else
        {
            darestituire.push(matrice[i-1][j]);
            matrice[i-1][j] = undefined;
        }
    }
    if (i < matrice.length - 1 && matrice[i+1][j] != undefined) 
    {
        if( matrice[i+1][j][0] == 4 ||matrice[i+1][j][0] == 5)
        {
            let g = [i+1,j]
            let k = effettospeciale(matrice[i+1][j][0],g,matrice)
            matrice = k[0]
            darestituire = k[1]
        }
        else
        {
            darestituire.push(matrice[i+1][j]);
            matrice[i+1][j] = undefined;
        }
    }
    if (j > 0 && matrice[i][j-1] != undefined) 
    {
        if( matrice[i][j-1][0] == 4 ||matrice[i][j-1][0] == 5)
        {
            let g = [i,j-1]
            let k = effettospeciale(matrice[i][j-1][0],g,matrice)
            matrice = k[0]
            darestituire = k[1]
        }
        else
        {
            darestituire.push(matrice[i][j-1]);
            matrice[i][j-1] = undefined;
        }
    }
    if (j < matrice[i].length - 1 && matrice[i][j+1] != undefined) 
    {
        if( matrice[i][j+1][0] == 4 ||matrice[i][j+1][0] == 5)
        {
            let g = [i,j+1]
            let k = effettospeciale(matrice[i][j+1][0],g,matrice)
            matrice = k[0]
            darestituire = k[1]
        }
        else
        {
            darestituire.push(matrice[i][j+1]);
            matrice[i][j+1] = undefined;
        }
    }
    if (tipo == 5) 
    {
        if (i > 0 && j > 0 && matrice[i-1][j-1] != undefined) 
        {
            if( matrice[i-1][j-1][0] == 4 ||matrice[i-1][j-1][0] == 5)
            {
                let g = [i-1,j-1]
                let k = effettospeciale(matrice[i-1][j-1][0],g,matrice)
                matrice = k[0]
                darestituire = k[1]
            }
            else
            {
                darestituire.push(matrice[i-1][j-1]);
                matrice[i-1][j-1] = undefined;
            }
        }
        if (i > 0 && j < matrice[i].length - 1 && matrice[i-1][j+1] != undefined) 
        {
            if( matrice[i-1][j+1][0] == 4 ||matrice[i-1][j+1][0] == 5)
            {
                let g = [i-1,j+1]
                let k = effettospeciale(matrice[i-1][j+1][0],g,matrice)
                matrice = k[0]
                darestituire = k[1]
            }
            else
            {            
                darestituire.push(matrice[i-1][j+1]);
                matrice[i-1][j+1] = undefined;
            }

        }
        if (i < matrice.length - 1 && j > 0 && matrice[i+1][j-1] != undefined) 
        {
            if( matrice[i+1][j-1][0] == 4 ||matrice[i+1][j-1][0] == 5)
            {
                let g = [i+1,j-1]
                let k = effettospeciale(matrice[i+1][j-1][0],g,matrice)
                matrice = k[0]
                darestituire = k[1]
            }
           else
            {
                darestituire.push(matrice[i+1][j-1]);
                matrice[i+1][j-1] = undefined;
            }
        }
        if (i < matrice.length - 1 && j < matrice[i].length - 1 && matrice[i+1][j+1] != undefined) 
        {
            if( matrice[i+1][j+1][0] == 4 ||matrice[i+1][j+1][0] == 5)
            {
                let g = [i+1,j+1]
                let k = effettospeciale(matrice[i+1][j+1][0],g,matrice)
                matrice = k[0]
                darestituire = k[1]
            }
            else
            {
                darestituire.push(matrice[i+1][j+1]);
                matrice[i+1][j+1] = undefined;
            }
        }
    }

    return [matrice, darestituire];
}
function shift(matrice) 
{
    let moved;
    do 
    {
        moved = false;
        for(let i = matrice.length - 2; i >= 0; i--) 
        { 
            for(let j = 0; j < matrice[i].length; j++) 
            {
                if(matrice[i][j] != undefined && matrice[i+1][j] == undefined) 
                {
                    let pos1 = {i: i, j: j};
                    let pos2 = {i: i+1, j: j};
                    swap(pos1, pos2, matrice);
                    moved = true;
                }
            }
        }
    } 
    while(moved);
    return matrice;
}
function rigenera(matrice)
{
    for(let i = 0;i<matrice.length;i++)
    {
        for(let j = 0;j<matrice[i].length;j++)
        {
            if(matrice[i][j]==undefined)
            {
                let y = [i,j]
                matrice[i][j] = generaelemento(y,undefined,matrice)
            }
        }
    }
    return matrice
}

function chiedinome(e)
{
    document.querySelector(".chiedinome").style.display = "flex"
    document.querySelector(".ok").addEventListener("click",()=>{
        let d = generazione(e)
        avviato = true
        document.querySelector(".chiedinome").style.animation = "scompari 0.3s ease forwards"
        setTimeout(function(){
            document.querySelector(".chiedinome").style.display = "none"
            stampaggiorna(d)
        },300)
    })
}
giocabutton.addEventListener("click", () => {
    transizione(document.querySelector(".homescreen"),document.querySelector(".selezione"))
})
regolebutton.addEventListener("click",()=>{
    transizione(document.querySelector(".homescreen"),document.querySelector(".regole"))
})
backtohomebutton.forEach(button => {
    button.addEventListener("click", ()=>{
        transizione(document.querySelector("."+statoattuale),document.querySelector(".homescreen"))
    })
})
x5button.addEventListener("click", ()=>{
    document.body.style.setProperty("--sfondotabella",colori.x5+"d5")
    chiedinome(5)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".areagioco"),"x5")
})
x6button.addEventListener("click", ()=>{
    document.body.style.setProperty("--sfondotabella",colori.x6+"d5")
    chiedinome(6)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".areagioco"),"x6")
})
x7button.addEventListener("click", ()=>{
    document.body.style.setProperty("--sfondotabella",colori.x7+"d5")
    chiedinome(7)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".areagioco"),"x7")
})
xcasualebutton.addEventListener("click",()=>{
    let num = Math.round(Math.random()*(10-5)+5)
    document.body.style.setProperty("--sfondotabella",colori.xcasuale)
    chiedinome(num)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".areagioco"),"xcasuale")
})

/*Gestione generale*/
setInterval(()=>{
    if(document.querySelector(".homescreen").style.display == "flex")
    {
        statoattuale = "homescreen"
    }
    else if(document.querySelector(".selezione").style.display == "flex")
    {
        statoattuale = "selezione"
    }
    else if(document.querySelector(".regole").style.display == "flex")
    {
        statoattuale = "regole"
    }
    else if(document.querySelector(".areagioco").style.display == "flex")
    {
        statoattuale = "areagioco"
    }
},50)
history.pushState(null, null, document.URL);
window.addEventListener('popstate', (e) => {
  if (statoattuale == "selezione") {
    history.pushState(null, null, document.URL);
    transizione(document.querySelector(".selezione"),document.querySelector(".homescreen"));
    statoattuale = "homescreen";
  } else if (statoattuale == "homescreen") {
    history.back();
  }
  else if(statoattuale == "regole")
  {
    history.pushState(null, null, document.URL);
    transizione(document.querySelector(".regole"),document.querySelector(".homescreen"));
    statoattuale = "homescreen";
  }
  else if(statoattuale == "areagioco")
  {
    history.pushState(null, null, document.URL);
  }
})
window.addEventListener("beforeunload",(e) => {
    if(statoattuale == "areagioco")
    {
        e.preventDefault()
    }
})