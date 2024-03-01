let giocabutton = document.getElementById("gioca")
let backtohomebutton = document.querySelectorAll(".backtohome")
let regolebutton = document.getElementById("regole")
let x5button = document.getElementById("x5")
let x6button = document.getElementById("x6")
let x7button =  document.getElementById("x7")
let xcasualebutton = document.getElementById("xcasuale")
let classificabutton = document.getElementById("classici")
let statoattuale = ""
let colori = new Map()
let avviato = false
let strike = document.getElementById("strike")
let scambio = undefined
let mosse = 0
let player = ""
let arrabbiatura = 0
let eliminaegenerata = []
let esplosioni = ["64% 36% 45% 55% / 41% 55% 45% 59%","64% 36% 73% 27% / 36% 69% 31% 64%","34% 66% 73% 27% / 63% 35% 65% 37%","58% 42% 41% 59% / 35% 84% 16% 65%"]
colori = {"x5":"#518c38","x6":"#b1670c","x7":"#b10c0c","xcasuale":"#00000075"}
let punti = [1,2,3,5]
let oggetti = ["secco.png","carta.png","plastica.png","vetro.png","poterericiclo.png","amorenatura.png"]
let punteggio = [0,0,0,0]
let spawnato = false
let classifica = []
if(localStorage.getItem("classifica"))
{
    classifica = JSON.parse(localStorage.getItem("classifica"))
}
document.querySelector(".homescreen").style.display = "flex"

setTimeout(function(){
    document.querySelector(".loadscreen").addEventListener("click",()=>{
        setTimeout(()=>{
            transizione(document.querySelector(".loadscreen"),document.querySelector(".homescreen"))
        },50)
    })
},1650)

/*Gestione Tabella*/
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
            while(matrice[posizioni[0]+1][posizioni[1]][0] == p)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p] +"'></div>"
                valo = [p,codice,idunivoco]
            }
        }
        if(posizioni[0]-1>=0 && matrice[posizioni[0]-1][posizioni[1]] != undefined)
        {
            while(matrice[posizioni[0]-1][posizioni[1]][0] == p)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p] +"'></div>"
                valo = [p,codice,idunivoco]
            }
        }
        if(posizioni[1]+1 < matrice[posizioni[0]].length && matrice[posizioni[0]][posizioni[1]+1] != undefined)
        {
            while(matrice[posizioni[0]][posizioni[1]+1][0] == p)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p] +"'></div>"
                valo = [p,codice,idunivoco]
            }
        }
        if(posizioni[1]-1 >=0 && matrice[posizioni[0]][posizioni[1]-1] != undefined)
        {
            while(matrice[posizioni[0]][posizioni[1]-1][0] == p)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p] +"'></div>"
                valo = [p,codice,idunivoco]
            }
        }
        let urai = Math.round(Math.random() * ((13-valo[0]-arrabbiatura) - 0) + 0)
        if(urai <= 1)
        {
            console.log("ehila")
            idunivoco = genid()
            p = 6
            codice = "<div idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p] +"'></div>"
            valo = [p,codice,idunivoco]
        }
        return valo
    }
}
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
        setTimeout(()=>{
            document.querySelector(".appiglio").style.animation = "ser 0.3s ease"
            document.querySelector(".appiglio").style.display = "flex"
        },300)
    }
    spawnato = true
    let celle = document.querySelectorAll(".cella")
    celle.forEach(cella => {
        cella.addEventListener("click",(e)=>{
            let attuale = e.currentTarget
            if(attuale.id == 'undefined')
            {
            }
            else if(attuale.id == '4' || attuale.id == '5')
            {
                let posatu = individua(attuale.getAttribute('idunivoco'),matrix)
                let posizioni = [posatu.i,posatu.j]
                let k = effettospeciale(attuale.id,posizioni,matrix)
                matrix = k[0]
                for(let i = 0; i<k[1].length;i++)
                {
                    if(k[1][i][0] < 4)
                    {
                        punteggio[k[1][i][0]] = parseInt(punteggio[k[1][i][0]]) + 1
                    }
                }
                matrix = shift(matrix)
                matrix = rigenera(matrix)
                stampaggiorna(matrix)
                scambio = undefined
                arrabbiatura = 0
                mosse = 0
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
                    swapanimation(idunivocoattuale,idunivocoscambiare)
                    let posizioni = [posizioneelemento.i,posizioneelemento.j]
                    let posizioni2 = [posizioneelemento2.i,posizioneelemento2.j]
                    eliminaegenerata = [controllo(matrix[posizioni[0]][posizioni[1]][0],posizioni,matrix),controllo(matrix[posizioni2[0]][posizioni2[1]][0],posizioni2,matrix)]
                    if(eliminaegenerata[0] != false || eliminaegenerata[1] != false)
                    {
                        setTimeout(()=>{
                            if(eliminaegenerata[0] != false)
                            {
                                for(let i = 0; i<eliminaegenerata[0][0].length;i++)
                                {
                                    punteggio[eliminaegenerata[0][0][i][0]] = parseInt(punteggio[eliminaegenerata[0][0][i][0]]) + 1
                                }
                                matrix = elimina(eliminaegenerata[0][0],matrix)
                            }
                            if(eliminaegenerata[1] != false)
                            {
                                for(let i = 0; i<eliminaegenerata[1][0].length;i++)
                                {
                                    punteggio[eliminaegenerata[1][0][i][0]] = parseInt(punteggio[eliminaegenerata[1][0][i][0]]) + 1
                                }
                                matrix = elimina(eliminaegenerata[1][0],matrix)
                            }
                            if(eliminaegenerata[0] == eliminaegenerata[1])
                            {
                                console.log("ok")
                                creaelementocondizionale(eliminaegenerata[0][1],posizioni,matrix)   
                            } 
                            else
                            {
                                creaelementocondizionale(eliminaegenerata[0][1],posizioni,matrix)
                                creaelementocondizionale(eliminaegenerata[1][1],posizioni2,matrix)   
                            }
                            cella.removeAttribute("style")
                            matrix = shift(matrix)
                            matrix = rigenera(matrix)
                            stampaggiorna(matrix)
                            scambio = undefined
                        },300)
                        arrabbiatura = 0
                        mosse = 0
                    }
                    else
                    {
                        matrix = swap(posizioneelemento2,posizioneelemento,matrix)
                        setTimeout(function(){
                            reverse(idunivocoattuale,idunivocoscambiare)
                            scambio.style.border = ""
                            attuale.style.border = ""
                            scambio = undefined
                        },300)
                        mosse = mosse + 1
                        arrabbiatura = mosse
                    }
                }
            }
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
        return false
    }
}
function controllo(tipo, posizioni, matrice) 
{
    let adiacenti = [];

    let riga = posizioni[0];
    let colonna = posizioni[1];

    for (let j = colonna; j >= 0; j--) 
    {
        if (matrice[riga][j] && tipo === matrice[riga][j][0]) 
        {
            adiacenti.push(matrice[riga][j]);
        } 
        else 
        {
            break; 
        }
    }

    for (let j = colonna + 1; j < matrice[riga].length; j++) 
    {
        if (matrice[riga][j] && tipo === matrice[riga][j][0]) 
        {
            adiacenti.push(matrice[riga][j]);
        }
        else 
        {
            break;
        }
    }

    for (let i = riga; i >= 0; i--) 
    {
        if (matrice[i][colonna] && tipo === matrice[i][colonna][0]) 
        {
            adiacenti.push(matrice[i][colonna]);
        } 
        else 
        {
            break; 
        }
    }

    for (let i = riga + 1; i < matrice.length; i++)
    {
        if (matrice[i][colonna] && tipo === matrice[i][colonna][0]) 
        {
            adiacenti.push(matrice[i][colonna]);
        } 
        else 
        {
            break; 
        }
    }

    let elemdaeliminare = [];
    for (let i = 0; i < adiacenti.length; i++) 
    {
        if (elemdaeliminare.indexOf(adiacenti[i]) == -1 && adiacenti[i][0] != 6)
        {
            elemdaeliminare.push(adiacenti[i]);
        }
    }
    if(elemdaeliminare.indexOf(matrice[posizioni[0]][posizioni[1]]) == -1)
    {
        elemdaeliminare.push(matrice[posizioni[0]][posizioni[1]]);
    }
    if (elemdaeliminare.length >= 5) {
        return [elemdaeliminare, elemdaeliminare.length];
    } 
    else if (elemdaeliminare.length < 5 && elemdaeliminare.length > 2) 
    {
        let kp = controllosecondario(tipo, posizioni, matrice);
        return kp;
    }
    else
    {
        return false;
    }
}
function controllosecondario(tipo,posizioni,matrice)
{
    let ui = controllocolonna(tipo,posizioni,matrice)
    if(ui != false)
    {
        return ui
    } 
    else
    {
        ui = controlloriga(tipo,posizioni,matrice)
        if(ui != undefined)
        {
            return ui
        }
        else
        {
            return false
        }
    }
}
function controlloriga(tipo,posizioni,matrice)
{
    let adiacenti = [];

    let riga = posizioni[0];
    let colonna = posizioni[1];

    for (let j = colonna; j >= 0; j--) 
    {
        if (matrice[riga][j] && tipo === matrice[riga][j][0]) 
        {
            adiacenti.push(matrice[riga][j]);
        } 
        else 
        {
            break; 
        }
    }

    for (let j = colonna + 1; j < matrice[riga].length; j++) 
    {
        if (matrice[riga][j] && tipo === matrice[riga][j][0]) 
        {
            adiacenti.push(matrice[riga][j]);
        }
        else 
        {
            break;
        }
    }

    let elemdaeliminare = [];
    for (let i = 0; i < adiacenti.length; i++) 
    {
        if (elemdaeliminare.indexOf(adiacenti[i]) == -1 && adiacenti[i][0] != 6) 
        {
            elemdaeliminare.push(adiacenti[i]);
        }
    }
    if(elemdaeliminare.indexOf(matrice[posizioni[0]][posizioni[1]]) == -1)
    {
        elemdaeliminare.push(matrice[posizioni[0]][posizioni[1]]);
    }
    if(elemdaeliminare.length > 2 && elemdaeliminare.length < 5)
    {
        return [elemdaeliminare,elemdaeliminare.length]
    }
    else
    {
        return false
    }
}
function controllocolonna(tipo,posizioni,matrice)
{
    let adiacenti = [];

    let riga = posizioni[0];
    let colonna = posizioni[1]; 

    for (let i = riga; i >= 0; i--) 
    {
        if (matrice[i][colonna] && tipo === matrice[i][colonna][0]) 
        {
            adiacenti.push(matrice[i][colonna]);
        } 
        else 
        {
            break; 
        }
    }

    for (let i = riga + 1; i < matrice.length; i++)
    {
        if (matrice[i][colonna] && tipo === matrice[i][colonna][0]) 
        {
            adiacenti.push(matrice[i][colonna]);
        } 
        else 
        {
            break; 
        }
    }
    
    let elemdaeliminare = [];
    for (let i = 0; i < adiacenti.length; i++) 
    {
        if (elemdaeliminare.indexOf(adiacenti[i]) == -1 && adiacenti[i][0] != 6) 
        {
            elemdaeliminare.push(adiacenti[i]);
        }
    }
    if(elemdaeliminare.indexOf(matrice[posizioni[0]][posizioni[1]]) == -1)
    {
        elemdaeliminare.push(matrice[posizioni[0]][posizioni[1]]);
    }
    if(elemdaeliminare.length > 2 && elemdaeliminare.length < 5)
    {
        return [elemdaeliminare,elemdaeliminare.length]
    }
    else
    {
        return false
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
                esplosione(matrice[i][j][3])
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
        if( matrice[i-1][j][0] == 4 || matrice[i-1][j][0] == 5)
        {
            let g = [i-1,j]
            let k = effettospeciale(matrice[i-1][j][0],g,matrice)
            matrice = k[0]
            darestituire = k[1]
        }
        else if (matrice[i-1][j][0] == 6 && tipo == 5)
        {
            matrice[i-1][j] = undefined;
        }
        else if(matrice[i-1][j][0] == 6 && tipo == 4)
        {

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
        else if (matrice[i+1][j][0] == 6 && tipo == 5)
        {
            matrice[i+1][j] = undefined;
        }
        else if(matrice[i+1][j][0] == 6 && tipo == 4)
        {
            
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
        else if (matrice[i][j-1][0] == 6 && tipo == 5)
        {
            matrice[i][j-1] = undefined;
        }
        else if(matrice[i][j-1][0] == 6 && tipo == 4)
        {
            
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
        else if (matrice[i][j+1][0] == 6 && tipo == 5)
        {
            matrice[i][j+1] = undefined;
        }
        else if(matrice[i][j+1][0] == 6 && tipo == 4)
        {
            
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
            else if (matrice[i-1][j-1][0] == 6)
            {
                matrice[i-1][j-1] = undefined;
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
            else if (matrice[i-1][j+1][0] == 6)
            {
                matrice[i-1][j+1] = undefined;
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
            else if (matrice[i+1][j-1][0] == 6)
            {
                matrice[i+1][j-1] = undefined;
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
            else if (matrice[i+1][j+1][0] == 6)
            {
                matrice[i+1][j+1] = undefined;
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
function swapanimation(idunin, idunout) {
    let elementoIn = document.querySelector('[idunivoco="' + idunin + '"]');
    let elementoOut = document.querySelector('[idunivoco="' + idunout + '"]');

    let rectIn = elementoIn.getBoundingClientRect();
    let rectOut = elementoOut.getBoundingClientRect();
    let dx = rectIn.left - rectOut.left;
    let dy = rectIn.top - rectOut.top;
    elementoIn.style.transform = 'translate(' + -dx + 'px, ' + -dy + 'px)';
    elementoOut.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
}
function reverse(idunin, idunout)
{
    let elementoIn = document.querySelector('[idunivoco="' + idunin + '"]');
    let elementoOut = document.querySelector('[idunivoco="' + idunout + '"]');

    elementoIn.style.transform = '';
    elementoOut.style.transform = '';
}
function esplosione(idunivoco)
{
    
}

/*Gestione generale*/
setInterval(()=>{
    let colore = ""
    if(mosse <= 1)
    {
        colore = "white"
    }
    else if(mosse == 2)
    {
        colore = colori.x6
    }
    else
    {
        colore = colori.x7
    }
    let r = "Mosse :  <f style='color:" + colore + ";'>" + mosse + "</f>"
    strike.innerHTML = r
    if(avviato == true)
    {
        if(tuttipunti(punteggio) == true)
        {
            win()
        }
        if(mosse > 3)
        {
            lose()
        }
    }
},0)
function win()
{
    let y = "<h2>Hai Vinto</h2><h6>Tocca per tornare alla home</h6>"
    document.querySelector(".visiover").style.display = "flex"
    messaggio(y,"#518c38")
    document.querySelector(".areagioco").style.filter = "blur(10px)"
    document.querySelector(".avviso").addEventListener("click",function(){
        if(avviato == true)
        {
            avviato = false
            spawnato = false
            scambio = undefined
            let kj = [punteggio,player]
            classifica.push(kj)
            localStorage.setItem("classifica",JSON.stringify(classifica))
            transizioneavanzata(document.querySelector(".areagioco"),document.querySelector(".homescreen"),"sfondo")
            setTimeout(function(){
                document.querySelector(".visiover").style.display = "none"
                document.querySelector(".avviso").style.display = "none"
                resetta()
                player = ""
                statoattuale = "homescreen"
            },300)
        }
    })
}
function lose()
{
    let y = "<h2>Hai Perso</h2><h6>Tocca per tornare alla home</h6>"
    document.querySelector(".visiover").style.display = "flex"
    messaggio(y,"#833920")
    document.querySelector(".areagioco").style.filter = "blur(10px)"
    document.querySelector(".avviso").addEventListener("click",function(){
        if(avviato == true)
        {
            avviato = false
            spawnato = false
            scambio = undefined
            transizioneavanzata(document.querySelector(".areagioco"),document.querySelector(".homescreen"),"sfondo")
            setTimeout(function(){
                document.querySelector(".visiover").style.display = "none"
                document.querySelector(".avviso").style.display = "none"
                resetta()
                player = ""
                statoattuale = "homescreen"
            },300)
        }
    })
}
function resetta()
{
    document.querySelector(".areagioco").removeAttribute("style")
    document.querySelector(".chiedinome").removeAttribute("style")
    document.querySelector(".appiglio").removeAttribute("style")
    document.querySelector(".appiglio").innerHTML = ""
    mosse = 0
    arrabbiatura = mosse
}
function tuttipunti(array)
{
    let passo = true
    for(let i = 0; i<array.length;i++)
    {
        if(passo == true && array[i] >= 50)
        {
            passo = true
        }
        else
        {
            passo = false
        }
    }
    return passo
}
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
        document.querySelector(".blocco").style.display = "block"
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
function messaggio(n,p)
{
    document.body.style.setProperty("--esito",p)
    document.getElementById("avvisu").innerHTML = n
    document.querySelector(".avviso").style.animation = "se 0.6s ease"
    document.querySelector(".avviso").style.display = "flex"
}
function avviso(n)
{
    document.body.style.setProperty("--esito","#833920")
    document.getElementById("avvisu").innerHTML = n
    transizione(document.querySelector(".chiedinome"),document.querySelector(".avviso"))
    setTimeout(function(){
        transizione(document.querySelector(".avviso"),document.querySelector(".chiedinome"))        
    },800)
}
function chiedinome(e)
{
    document.querySelector(".ok").addEventListener("click",()=>{
        if(document.getElementById("nome").value != "")
        {
            player = document.getElementById("nome").value
            let d = generazione(e)
            avviato = true
            transizione(document.querySelector(".chiedinome"),document.querySelector(".areagioco"))
            setTimeout(function(){
                document.querySelector(".chiedinome").style.display = "none"
                stampaggiorna(d)
            },300)
        }
        else
        {
            avviso("Inserisci un nome")
        }
    })
}
giocabutton.addEventListener("click", () => {
    transizione(document.querySelector(".homescreen"),document.querySelector(".selezione"))
})
regolebutton.addEventListener("click",()=>{
    transizione(document.querySelector(".homescreen"),document.querySelector(".regole"))
})
classificabutton.addEventListener("click",()=>{
    transizione(document.querySelector(".homescreen"),document.querySelector(".classifica"))
})
backtohomebutton.forEach(button => {
    button.addEventListener("click", ()=>{
        transizione(document.querySelector("."+statoattuale),document.querySelector(".homescreen"))
    })
})
x5button.addEventListener("click", ()=>{
    document.body.style.setProperty("--sfondotabella",colori.x5+"d5")
    chiedinome(5)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".chiedinome"),"x5")
})
x6button.addEventListener("click", ()=>{
    document.body.style.setProperty("--sfondotabella",colori.x6+"d5")
    chiedinome(6)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".chiedinome"),"x6")
})
x7button.addEventListener("click", ()=>{
    document.body.style.setProperty("--sfondotabella",colori.x7+"d5")
    chiedinome(7)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".chiedinome"),"x7")
})
xcasualebutton.addEventListener("click",()=>{
    let num = Math.round(Math.random()*(10-5)+5)
    document.body.style.setProperty("--sfondotabella",colori.xcasuale)
    chiedinome(num)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".chiedinome"),"xcasuale")
})
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
    else if(document.querySelector(".classifica").style.display == "flex")
    {
        statoattuale = "classifica"
    }
    else if (document.querySelector(".chiedinome").style.display == "flex")
    {
        statoattuale = "chiedinome"
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
    if(avviato == true)
    {
        history.pushState(null, null, document.URL);
    }
    else
    {
        history.pushState(null, null, document.URL);
        transizioneavanzata(document.querySelector(".areagioco"),document.querySelector(".selezione"),"sfondo");
        statoattuale = "selezione";
    }
  }
  else if(statoattuale == "classifica")
  {
    history.pushState(null, null, document.URL);
    transizione(document.querySelector(".classifica"),document.querySelector(".homescreen"));
    statoattuale = "homescreen";
  }
  else if(statoattuale == "chiedinome")
  {
    history.pushState(null, null, document.URL);
    transizioneavanzata(document.querySelector(".chiedinome"),document.querySelector(".selezione"),"sfondo");
    statoattuale = "selezione";
  }
})
window.addEventListener("beforeunload",(e) => {
    if(statoattuale == "areagioco")
    {
        e.preventDefault()
    }
})