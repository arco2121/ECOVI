let giocabutton = document.getElementById("gioca")
let backtohomebutton = document.querySelectorAll(".backtohome")
let regolebutton = document.getElementById("regole")
let backtoclassifica = document.querySelectorAll(".backtoclassifica")
let pausabutton = document.getElementById("pausa")
let x5button = document.getElementById("x5")
let x6button = document.getElementById("x6")
let x7button =  document.getElementById("x7")
let view = true
let xcasualebutton = document.getElementById("xcasuale")
let classificabutton = document.getElementById("classici")
let statoattuale = ""
let audio = document.getElementById("sottofondo")
let sonori = document.getElementById("effetti")
let siaudio = false
let siaudiof = false
let avviato = false
let strike = document.getElementById("strike")
let scambio = undefined
let mosse = 0
let possible = true
let player = ""
let noteseguendo = true
let eliminaegenerata = []
const colori = {"x5":"#518c38","x6":"#b1670c","x7":"#b10c0c","xcasuale":"#00000075"}
const punti = [1,2,3,5]
const esplosioni = ["30% 70% 70% 30% / 47% 30% 70% 53% ","70% 30% 84% 16% / 20% 80% 20% 80%","83% 17% 34% 66% / 81% 80% 20% 19%","83% 17% 34% 66% / 81% 38% 62% 19%", "83% 17% 55% 45% / 29% 38% 62% 71%"]
const oggetti = [["secco.png","#4d2083"],["carta.png","#948923"],["plastica.png","#245b19"],["vetro.png","#206283"],["poterericiclo.png","white"],["amorenatura.png","white"],["rifiutotossico.png","#810404"]]
let punteggio = [0,0,0,0]
let spawnato = false
let livello = ""
let classifica = []
let matrixprov = []
if(localStorage.getItem("classifica"))
{
    classifica = JSON.parse(localStorage.getItem("classifica"))
}
if(localStorage.getItem("player"))
{
    player = localStorage.getItem("player")
}
if(localStorage.getItem("audio"))
{
    audio.value = localStorage.getItem("audio")
}
else
{
    localStorage.setItem("audio","2")
    audio.value = localStorage.getItem("audio")
}
if(localStorage.getItem("sonori"))
{
    sonori.value = localStorage.getItem("sonori")
}
else
{
    localStorage.setItem("sonori","2")
    sonori.value = localStorage.getItem("sonori")
}

window.addEventListener("DOMContentLoaded",()=>{
    setTimeout(function(){
        document.querySelector(".loadscreen").addEventListener("click",()=>{
            setTimeout(()=>{
                if(localStorage.getItem("backup") == "" || !localStorage.getItem("backup"))
                {
                    transizione(document.querySelector(".loadscreen"),document.querySelector(".homescreen"))
                    statoattuale = "homescreen"
                }
                else
                {
                    let now = JSON.parse(localStorage.getItem("backup"))
                    player = now[1]
                    punteggio = now[0]
                    livello = now[2]
                    mosse = now[3]
                    if(livello == "x5")
                    {
                        document.body.style.setProperty("--sfondotabella",colori.x5+"d5")
                    }
                    else if(livello == "x6")
                    {
                        document.body.style.setProperty("--sfondotabella",colori.x6+"d5")
                    }
                    else if (livello == "x7")
                    {
                        document.body.style.setProperty("--sfondotabella",colori.x7+"d5")
                    }
                    else if(livello == "xcasuale")
                    {
                        document.body.style.setProperty("--sfondotabella",colori.xcasuale+"d5")
                    }
                    localStorage.setItem("player",player)
                    avviato = true
                    transizioneavanzata(document.querySelector(".loadscreen"),document.querySelector(".areagioco"),livello)
                    statoattuale = "areagioco"
                    setTimeout(function(){
                        stampaggiorna(now[4])
                    },400)
                }
            },25)
            setInterval(function(){
                if(localStorage.getItem("audio") == "1")
                {
                    siaudiof = false
                    document.getElementById("main").pause()
                }
                else
                {
                    if(view == true)
                    {
                        siaudiof = true
                        document.getElementById("main").play()
                    }
                }
                if(localStorage.getItem("sonori") == "1")
                {
                    siaudio = false
                }
                else
                {
                    siaudio = true
                }
            },0)
        })
    },1625)
})

let bottonia = document.querySelectorAll("button")
bottonia.forEach(qw => {
    qw.addEventListener("click",function(e){
        let au = e.currentTarget
        if(siaudio == true)
        {
            if(au.id == "pausa" || au.id == "impostazionibutton" || au.id == "riprendi")
            {
                document.getElementById("esplodiaudio").play()
            }
            else if(au.classList.contains("backtohome") || au.classList.contains("backtoclassifica") || au.id == "termina")
            {
                document.getElementById("backaudio").play()
            }
            else
            {
                document.getElementById("clickaudio").play()
            }
        }
    })
})

/*Gestione Tabella*/
function genid()
{
    let caratteri = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890!£$%&/"
    caratteri = caratteri.split("")
    let volte = Math.floor(Math.random()*(20-5)+5)
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
            let codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
            valo = [p,codice,idunivoco,false]
            if(j!=0 || i!=0)
            {
                while(valo[0] == (j!=0 ? riga[j-1][0] : -1) || valo[0] == (i!=0 ? matrice[i-1][j][0] : -1))
                {
                    p = Math.round(Math.random() * (3))
                    idunivoco = genid()
                    codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
                    valo = [p,codice,idunivoco,false]
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
    if(tipo != undefined && tipo != "no")
    {
        let valo = []
        let idunivoco = genid()
        let codice = "<div style='background:" + oggetti[tipo][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + tipo +"'><img class='immaginecella' src='img/" + oggetti[tipo][0] +"'></div>"
        valo = [tipo,codice,idunivoco,false]
        return valo
    }
    else if(tipo == "no")
    {
        let valo = []
        let idunivoco = genid()
        let codice = "<div style='opacity:0%;' idunivoco='" + idunivoco + "' class='cella' id='" + undefined +"'><img class='immaginecella'></div>"
        valo = [undefined,codice,idunivoco,false]
        return valo
    }
    else
    {
        let valo = []
        let p = Math.round(Math.random() * (3))
        let idunivoco = genid()
        let codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
        valo = [p,codice,idunivoco,false]
        if(posizioni[0]+1<matrice.length && matrice[posizioni[0]+1][posizioni[1]] != undefined)
        {
            while(matrice[posizioni[0]+1][posizioni[1]][0] == p)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
                valo = [p,codice,idunivoco,false]
            }
        }
        if(posizioni[0]-1>=0 && matrice[posizioni[0]-1][posizioni[1]] != undefined)
        {
            while(matrice[posizioni[0]-1][posizioni[1]][0] == p)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
                valo = [p,codice,idunivoco,false]
            }
        }
        if(posizioni[1]+1 < matrice[posizioni[0]].length && matrice[posizioni[0]][posizioni[1]+1] != undefined)
        {
            while(matrice[posizioni[0]][posizioni[1]+1][0] == p)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
                valo = [p,codice,idunivoco,false]
            }
        }
        if(posizioni[1]-1 >=0 && matrice[posizioni[0]][posizioni[1]-1] != undefined)
        {
            while(matrice[posizioni[0]][posizioni[1]-1][0] == p)
            {
                idunivoco = genid()
                p = Math.round(Math.random() * (3))
                codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
                valo = [p,codice,idunivoco,false]
            }
        }
        let ono = 0
        for(let i = 0; i<matrice.length;i++)
        {
            for(let j = 0;j<matrice[i].length;j++)
            {
                if(matrice[i][j][0] == 6)
                {
                    ono = ono + 1
                }
            }
        }
        if(ono >= matrice.length - 2)
        {}
        else
        {
            if(livello == "x5")
            {
                if(possible == true)
                {
                    let urai = Math.round(Math.random() * (80 - 0) + 0)
                    if(urai <= 1)
                    {
                        idunivoco = genid()
                        p = 6
                        codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
                        valo = [p,codice,idunivoco,false]
                        possible = false
                    }
                }
            }
            else if(livello == "x6")
            {
                if(possible == true)
                {
                    let urai = Math.round(Math.random() * (50 - 0) + 0)
                    if(urai <= 1)
                    {
                        idunivoco = genid()
                        p = 6
                        codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
                        valo = [p,codice,idunivoco,false]
                        possible = false
                    }
                }
            }
            else if(livello == "x7")
            {
                if(possible == true)
                {
                    let urai = Math.round(Math.random() * (25 - 0) + 0)
                    if(urai <= 1)
                    {
                        idunivoco = genid()
                        p = 6
                        codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
                        valo = [p,codice,idunivoco,false]
                        possible = false
                    }
                }
            }
            else if(livello == "xcasuale")
            {
                if(possible == true)
                {
                    let urai = Math.round(Math.random() * ((Math.random()*(80-25)+25) - 0) + 0)
                    if(urai <= 1)
                    {
                        idunivoco = genid()
                        p = 6
                        codice = "<div style='background:" + oggetti[p][1] + ";' idunivoco='" + idunivoco + "' class='cella' id='" + p +"'><img class='immaginecella' src='img/" + oggetti[p][0] +"'></div>"
                        valo = [p,codice,idunivoco,false]
                        possible = false
                    }
                }
            }
        }
        return valo
    }
}
function stamparidotta(matrix)
{
    let stringa = ""
    for(let i = 0;i<matrix.length;i++)
    {
        let r = "<div class='riga'>"
        for(let j = 0;j<matrix[i].length;j++)
        {
            r = r + matrix[i][j][1]
        }
        r = r + "</div>"
        stringa = stringa + r
    }
    document.querySelector(".appiglio").innerHTML = stringa
    document.querySelectorAll(".cella").forEach(cella => {
        let pos = individua(cella.getAttribute("idunivoco"),matrix)
        let posizioni = [pos.i,pos.j]
        if(matrix[posizioni[0]][posizioni[1]][0] != undefined && matrix[posizioni[0]][posizioni[1]][3] == false)
        {
            cella.style.animation = "compari 0.3s ease-in-out"
            matrix[posizioni[0]][posizioni[1]][3] = true
            if(siaudio == true && view == true)
            {
                document.getElementById("esplodiaudio").play()
            }
        }
        else
        {
        }
        cella.style.display = "flex"
    })
    if(spawnato == false)
    {
        setTimeout(()=>{
            document.querySelector(".appiglio").style.animation = "ser 0.3s ease-out"
            document.querySelector(".appiglio").style.display = "flex"
        },100)
    }
    spawnato = true
}
function stampaggiorna(matrix)
{
    matrixprov = matrix
    localStorage.setItem("backup",JSON.stringify([punteggio,player,livello,mosse,matrix]))
    possible = true
    noteseguendo = true
    let stringa = ""
    for(let i = 0;i<matrix.length;i++)
    {
        let r = "<div class='riga'>"
        for(let j = 0;j<matrix[i].length;j++)
        {
            r = r + matrix[i][j][1]
        }
        r = r + "</div>"
        stringa = stringa + r
    }
    document.querySelector(".appiglio").innerHTML = stringa
    document.querySelectorAll(".cella").forEach(cella => {
        let pos = individua(cella.getAttribute("idunivoco"),matrix)
        let posizioni = [pos.i,pos.j]
        if(matrix[posizioni[0]][posizioni[1]][0] != undefined && matrix[posizioni[0]][posizioni[1]][3] == false)
        {
            cella.style.animation = "compari 0.3s ease-in-out"
            if(siaudio == true && view == true)
            {
                document.getElementById("esplodiaudio").play()
            }
            matrix[posizioni[0]][posizioni[1]][3] = true
        }
        else
        {
        }
        cella.style.display = "flex"
    })
    if(spawnato == false)
    {
        setTimeout(()=>{
            document.querySelector(".appiglio").style.animation = "ser 0.3s ease-out"
            document.querySelector(".appiglio").style.display = "flex"
        },100)
    }
    spawnato = true
    setTimeout(()=>{
        if(tuttipunti(punteggio) == true)
        {
            document.querySelector(".griglia").style.animation = "blur 0.3s ease-out forwards"
                   document.querySelector(".jklh").style.animation = "blur 0.3s ease-out forwards"
            win()
        }
        if(mosse > 3)
        {
            document.querySelector(".griglia").style.animation = "blur 0.3s ease-out forwards"
            document.querySelector(".jklh").style.animation = "blur 0.3s ease-out forwards"
            lose()
        }
    },25)
    let celle = document.querySelectorAll(".cella")
    celle.forEach(cella => {
        cella.addEventListener("click",(e)=>{
            if(noteseguendo == true)
            {
                if(siaudio)
                {
                    document.getElementById("clickaudio").play()
                }
                noteseguendo = false
                let attuale = e.currentTarget
                if(attuale.id == 'undefined')
                {
                }
                else if(attuale.id == '4' || attuale.id == '5')
                {
                    noteseguendo = false
                    let posatu = individua(attuale.getAttribute('idunivoco'),matrix)
                    if(posatu != false)
                    {
                        let posizioni = [posatu.i,posatu.j]
                        let k = effettospeciale(attuale.id,posizioni,matrix)
                        setTimeout(function(){
                            matrix = k[0]
                            stamparidotta(matrix)
                            for(let i = 0; i<k[1].length;i++)
                            {
                                if(k[1][i][0] < 4)
                                {
                                    punteggio[k[1][i][0]] = parseInt(punteggio[k[1][i][0]]) + 1
                                }
                            }
                            setTimeout(()=>{
                                matrix = shift(matrix)
                            },25)
                        },425)
                        scambio = undefined
                        mosse = 0
                        if(tuttipunti(punteggio) == true)
                        {
                            document.querySelector(".griglia").style.animation = "blur 0.3s ease-out forwards"
                            document.querySelector(".jklh").style.animation = "blur 0.3s ease-out forwards"
                            win()
                        }
                        if(mosse > 3)
                        {
                            document.querySelector(".griglia").style.animation = "blur 0.3s ease-out forwards"
                            document.querySelector(".jklh").style.animation = "blur 0.3s ease-out forwards"
                            lose()
                        }
                    }
                }
                else if (attuale.id == '6')
                {
                    noteseguendo = true
                }
                else if(scambio == undefined)
                {
                    scambio = attuale
                    cella.style.border = "solid #c9b27d 5px"
                    cella.style.filter =  "brightness(80%)"
                    noteseguendo = true
                }
                else if(scambio.getAttribute('idunivoco') == attuale.getAttribute('idunivoco'))
                {
                    scambio = undefined
                    cella.style.border = ""
                    cella.style.filter = ""
                    noteseguendo = true
                }
                else if(scambio.getAttribute('idunivoco') != attuale.getAttribute('idunivoco') && attuale.id != "undefined" && scambio != undefined && (scambio.id != '5' || scambio.id != '4'))
                {
                    let idunivocoattuale = attuale.getAttribute('idunivoco')
                    let idunivocoscambiare = scambio.getAttribute('idunivoco')
                    let posizioneelemento = individua(idunivocoattuale,matrix)
                    let  posizioneelemento2 = individua(idunivocoscambiare,matrix)
                    if(posizioneelemento != false && posizioneelemento2 != false)
                    {
                        if(vicino(posizioneelemento,posizioneelemento2))
                        {
                            noteseguendo = false
                            matrix = swap(posizioneelemento,posizioneelemento2,matrix)
                            swapanimation(idunivocoattuale,idunivocoscambiare)
                            let posizioni = [posizioneelemento.i,posizioneelemento.j]
                            attuale.style.filter =  ""
                            scambio.style.filter =  ""
                            let posizioni2 = [posizioneelemento2.i,posizioneelemento2.j]
                            eliminaegenerata = [controllocontrollo(matrix[posizioni[0]][posizioni[1]][0],posizioni,matrix),controllocontrollo(matrix[posizioni2[0]][posizioni2[1]][0],posizioni2,matrix)]
                            if(eliminaegenerata[0] != false || eliminaegenerata[1] != false)
                            {
                                setTimeout(()=>{
                                    stamparidotta(matrix)
                                    if(eliminaegenerata[0] != false)
                                    {
                                        for(let i = 0; i<eliminaegenerata[0][0].length;i++)
                                        {
                                            punteggio[eliminaegenerata[0][0][i][0]] = parseInt(punteggio[eliminaegenerata[0][0][i][0]]) + 1
                                        }
                                        lampeggio(eliminaegenerata[0][0])
                                        setTimeout(()=>{
                                            matrix = elimina(eliminaegenerata[0][0],matrix)
                                        },400)
                                    }
                                    if(eliminaegenerata[1] != false)
                                    {
                                        for(let i = 0; i<eliminaegenerata[1][0].length;i++)
                                        {
                                            punteggio[eliminaegenerata[1][0][i][0]] = parseInt(punteggio[eliminaegenerata[1][0][i][0]]) + 1
                                        }
                                        lampeggio(eliminaegenerata[1][0])
                                        setTimeout(()=>{
                                            matrix = elimina(eliminaegenerata[1][0],matrix)
                                        },400)
                                    }
                                    setTimeout(function(){
                                        if(eliminaegenerata[0] == eliminaegenerata[1])
                                        {
                                            creaelementocondizionale(eliminaegenerata[0][1],posizioni,matrix)   
                                        } 
                                        else
                                        {
                                            creaelementocondizionale(eliminaegenerata[0][1],posizioni,matrix)
                                            creaelementocondizionale(eliminaegenerata[1][1],posizioni2,matrix)   
                                        }
                                        stamparidotta(matrix)
                                        setTimeout(function(){
                                            matrix = shift(matrix)
                                        },425)
                                    },525)
                                    scambio = undefined
                                },425)
                                mosse = 0
                                if(tuttipunti(punteggio) == true)
                                {
                                    document.querySelector(".griglia").style.animation = "blur 0.3s ease-out forwards"
                                    document.querySelector(".jklh").style.animation = "blur 0.3s ease-out forwards"
                                    win()
                                }
                                if(mosse > 3)
                                {
                                    document.querySelector(".griglia").style.animation = "blur 0.3s ease-out forwards"
                                    document.querySelector(".jklh").style.animation = "blur 0.3s ease-out forwards"
                                    lose()
                                }
                            }
                            else
                            {
                                matrix = swap(posizioneelemento2,posizioneelemento,matrix)
                                navigator.vibrate(250)
                                setTimeout(function(){
                                    attuale.style.filter =  ""
                                    scambio.style.filter =  ""
                                    reverse(idunivocoattuale,idunivocoscambiare)
                                    scambio.style.border = ""
                                    attuale.style.border = ""
                                    scambio = undefined
                                },400)
                                mosse = mosse + 1
                                if(tuttipunti(punteggio) == true)
                                {
                                    document.querySelector(".griglia").style.animation = "blur 0.3s ease-out forwards"
                                    document.querySelector(".jklh").style.animation = "blur 0.3s ease-out forwards"
                                    win()
                                }
                                if(mosse > 3)
                                {
                                    document.querySelector(".griglia").style.animation = "blur 0.3s ease-out forwards"
                                    document.querySelector(".jklh").style.animation = "blur 0.3s ease-out forwards"
                                    lose()
                                }
                                noteseguendo = true
                            }
                        }
                        else
                        {
                            scambio.style.border = ""
                            scambio.style.filter =  ""
                            scambio = attuale
                            cella.style.border = "solid #c9b27d 5px"
                            cella.style.filter =  "brightness(80%)"
                            noteseguendo = true
                        }
                    }
                    else
                    {
                        scambio.style.border = ""
                        scambio.style.filter =  ""
                        scambio = attuale
                        cella.style.border = "solid #c9b27d 5px"
                        cella.style.filter =  "brightness(80%)"
                        noteseguendo = true
                    }
                }
            }
        })
    })
}
function controlloricorsivo(matrice)
{
    for(let i = 0; i<matrice.length;i++)
    {
        for(let j = 0; j<matrice[i].length;j++)
        {
            let posizioni = [i,j]
            let eleminarea = controllocontrollo(matrice[i][j][0],posizioni,matrice)
            if(eleminarea != false)
            {
                for(let i = 0; i<eleminarea[0].length;i++)
                {
                    punteggio[eleminarea[0][i][0]] = parseInt(punteggio[eleminarea[0][i][0]]) + 1
                }
                lampeggio(eleminarea[0])
                setTimeout(()=>{
                    matrix = elimina(eleminarea[0],matrix)
                },400)
                setTimeout(function(){
                    creaelementocondizionale(eleminarea[1],posizioni,matrice)
                    stamparidotta(matrix)
                    setTimeout(function(){
                        matrice = shift(matrice)
                    },425)
                },525)
                return matrice
            }
            else
            {

            }
        }
    }
    setTimeout(function(){
        stampaggiorna(matrice)
    },400)
    noteseguendo = true
    return matrice
}
function controllocontrollo(tipo,posizioni,matrice)
{
    let uio = controllosmonco(tipo,posizioni,matrice)
    if(uio != false)
    {
        return uio
    }
    else
    {
        uio = controlloterziario(tipo,posizioni,matrice)
        if(uio != false)
        {
            return uio
        }
        else
        {
            uio = controllosecondario(tipo,posizioni,matrice)
            if(uio != false)
            {
                return uio
            }
            else
            {
                return false
            }
        }
    }
}
function individua(id1, matrice)
{
    let pos1
    let ok = false
    for(let onkai = 0; onkai < matrice.length; onkai++) {
        for(let onka = 0; onka < matrice[onkai].length; onka++) {
            if(matrice[onkai][onka] != undefined && matrice[onkai][onka][2] == id1) {
                pos1 = {i: onkai, j: onka}
                ok = true
            }
        }
    }
    if(ok == true)
    {
        return pos1
    }
    else
    {
        return false
    }
}
function swap(pos1,pos2,matrice) {
    if(pos1 && pos2) {
        let temp = matrice[pos1.i][pos1.j]
        matrice[pos1.i][pos1.j] = matrice[pos2.i][pos2.j]
        matrice[pos2.i][pos2.j] = temp
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
function controllosmonco(tipo,posizioni,matrice)
{
    let adiacenti = []

    let riga = posizioni[0]
    let colonna = posizioni[1]

    for (let j = colonna; j >= 0; j--) 
    {
        if (matrice[riga][j] && tipo == matrice[riga][j][0]) 
        {
            adiacenti.push(matrice[riga][j])
        } 
        else 
        {
            break
        }
    }

    for (let j = colonna + 1; j < matrice[riga].length; j++) 
    {
        if (matrice[riga][j] && tipo == matrice[riga][j][0]) 
        {
            adiacenti.push(matrice[riga][j])
        }
        else 
        {
            break
        }
    }

    for (let i = riga; i >= 0; i--) 
    {
        if (matrice[i][colonna] && tipo == matrice[i][colonna][0]) 
        {
            adiacenti.push(matrice[i][colonna])
        } 
        else 
        {
            break
        }
    }

    for (let i = riga + 1; i < matrice.length; i++)
    {
        if (matrice[i][colonna] && tipo == matrice[i][colonna][0]) 
        {
            adiacenti.push(matrice[i][colonna])
        } 
        else 
        {
            break
        }
    }

    let elemdaeliminare = [];
    for (let i = 0; i < adiacenti.length; i++) 
    {
        if (elemdaeliminare.indexOf(adiacenti[i]) == -1 && adiacenti[i][0] != 6 && adiacenti[i][0] != 4 && adiacenti[i][0] != 5)
        {
            elemdaeliminare.push(adiacenti[i])
        }
    }
    if(elemdaeliminare.indexOf(matrice[posizioni[0]][posizioni[1]]) == -1)
    {
        elemdaeliminare.push(matrice[posizioni[0]][posizioni[1]]);
    }
    if (elemdaeliminare.length > 5) 
    {
        return [elemdaeliminare, elemdaeliminare.length]
    } 
    else
    {
        return false
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
    let adiacenti = []

    let riga = posizioni[0]
    let colonna = posizioni[1]

    for (let j = colonna; j >= 0; j--) 
    {
        if (matrice[riga][j] && tipo == matrice[riga][j][0]) 
        {
            adiacenti.push(matrice[riga][j])
        } 
        else 
        {
            break 
        }
    }

    for (let j = colonna + 1; j < matrice[riga].length; j++) 
    {
        if (matrice[riga][j] && tipo == matrice[riga][j][0]) 
        {
            adiacenti.push(matrice[riga][j])
        }
        else 
        {
            break
        }
    }

    let elemdaeliminare = [];
    for (let i = 0; i < adiacenti.length; i++) 
    {
        if (elemdaeliminare.indexOf(adiacenti[i]) == -1 && adiacenti[i][0] != 6 && adiacenti[i][0] != 4 && adiacenti[i][0] != 5) 
        {
            elemdaeliminare.push(adiacenti[i])
        }
    }
    if(elemdaeliminare.indexOf(matrice[posizioni[0]][posizioni[1]]) == -1)
    {
        elemdaeliminare.push(matrice[posizioni[0]][posizioni[1]])
    }
    if(elemdaeliminare.length > 2 && elemdaeliminare.length <= 5)
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
    let adiacenti = []

    let riga = posizioni[0]
    let colonna = posizioni[1] 

    for (let i = riga; i >= 0; i--) 
    {
        if (matrice[i][colonna] && tipo == matrice[i][colonna][0]) 
        {
            adiacenti.push(matrice[i][colonna])
        } 
        else 
        {
            break
        }
    }

    for (let i = riga + 1; i < matrice.length; i++)
    {
        if (matrice[i][colonna] && tipo == matrice[i][colonna][0]) 
        {
            adiacenti.push(matrice[i][colonna])
        } 
        else 
        {
            break
        }
    }
    
    let elemdaeliminare = []
    for (let i = 0; i < adiacenti.length; i++) 
    {
        if (elemdaeliminare.indexOf(adiacenti[i]) == -1 && adiacenti[i][0] != 6 && adiacenti[i][0] != 4 && adiacenti[i][0] != 5) 
        {
            elemdaeliminare.push(adiacenti[i])
        }
    }
    if(elemdaeliminare.indexOf(matrice[posizioni[0]][posizioni[1]]) == -1)
    {
        elemdaeliminare.push(matrice[posizioni[0]][posizioni[1]])
    }
    if(elemdaeliminare.length > 2 && elemdaeliminare.length <= 5)
    {
        return [elemdaeliminare,elemdaeliminare.length]
    }
    else
    {
        return false
    }
}
function controlloterziario(tipo,posizioni,matrice)
{
    let ui = controlloal(tipo,posizioni,matrice)
    if(ui != false)
    {
        return ui
    } 
    else
    {
        ui = controlloriga(tipo,posizioni,matrice)
        if(ui != false)
        {
            return ui
        }
        else
        {
            ui = controllocolonna(tipo,posizioni,matrice)
            if(ui != false)
            {
                return ui
            }
            else 
            {
                return false
            }
        }
    }
}
function elimina(elemdaeliminare,matrice)
{
    for(let i = 0; i<matrice.length;i++)
    {
        for(let j = 0;j<matrice[i].length;j++)
        {
            if(elemdaeliminare.indexOf(matrice[i][j]) != -1 && matrice[i][j][0]!=6)
            {
                let posizioni = [i,j]
                esplosione(matrice[i][j][2])
                matrice[i][j] = generaelemento(posizioni,"no",matrice)
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
    let darestituire = []
    let i = posizioni[0]
    let j = posizioni[1]
    esplosione(matrice[i][j][2])
    darestituire.push(matrice[i][j])
    matrice[i][j] = generaelemento([i,j],"no",matrice)
    if (i > 0 && matrice[i-1][j] != undefined) 
    {
        if( matrice[i-1][j][0] == 4 || matrice[i-1][j][0] == 5)
        {
            let g = [i-1,j]
            esplosione(matrice[g[0]][g[1]][2])
            let k = effettospeciale(matrice[i-1][j][0],g,matrice)
            matrice = k[0]
            darestituire = k[1]
            
        }
        else if (matrice[i-1][j][0] == 6 && tipo == 5)
        {
            esplosione(matrice[i-1][j][2])
            matrice[i-1][j] = generaelemento([i-1,j],"no",matrice)
        }
        else if(matrice[i-1][j][0] == 6 && tipo == 4)
        {
        }
        else
        {
            esplosione(matrice[i-1][j][2])
            darestituire.push(matrice[i-1][j])
            matrice[i-1][j] = generaelemento([i-1,j],"no",matrice)
        }
    }
    if (i < matrice.length - 1 && matrice[i+1][j] != undefined) 
    {
        if( matrice[i+1][j][0] == 4 ||matrice[i+1][j][0] == 5)
        {
            let g = [i+1,j]
            esplosione(matrice[g[0]][g[1]][2])
            let k = effettospeciale(matrice[i+1][j][0],g,matrice)
            matrice = k[0]
            darestituire = k[1]
            
        }
        else if (matrice[i+1][j][0] == 6 && tipo == 5)
        {
            esplosione(matrice[i+1][j][2])
            matrice[i+1][j] = generaelemento([i+1,j],"no",matrice)
        }
        else if(matrice[i+1][j][0] == 6 && tipo == 4)
        {
        }
        else
        {
            esplosione(matrice[i+1][j][2])
            darestituire.push(matrice[i+1][j])
            matrice[i+1][j] = generaelemento([i+1,j],"no",matrice)
        }
    }
    if (j > 0 && matrice[i][j-1] != undefined) 
    {
        if( matrice[i][j-1][0] == 4 ||matrice[i][j-1][0] == 5)
        {
            let g = [i,j-1]
            esplosione(matrice[g[0]][g[1]][2])
            let k = effettospeciale(matrice[i][j-1][0],g,matrice)
            matrice = k[0]
            darestituire = k[1]
            
        }
        else if (matrice[i][j-1][0] == 6 && tipo == 5)
        {
            esplosione(matrice[i][j-1][2])
            matrice[i][j-1] = generaelemento([i,j-1],"no",matrice)
        }
        else if(matrice[i][j-1][0] == 6 && tipo == 4)
        {
        }
        else
        {
            esplosione(matrice[i][j-1][2])
            darestituire.push(matrice[i][j-1])
            matrice[i][j-1] = generaelemento([i,j-1],"no",matrice)
        }
    }
    if (j < matrice[i].length - 1 && matrice[i][j+1] != undefined) 
    {
        if( matrice[i][j+1][0] == 4 ||matrice[i][j+1][0] == 5)
        {
            let g = [i,j+1]
            esplosione(matrice[g[0]][g[1]][2])
            let k = effettospeciale(matrice[i][j+1][0],g,matrice)
            matrice = k[0]
            darestituire = k[1]
            
        }
        else if (matrice[i][j+1][0] == 6 && tipo == 5)
        {
            esplosione(matrice[i][j+1][2])
            matrice[i][j+1] = generaelemento([i,j+1],"no",matrice)
        }
        else if(matrice[i][j+1][0] == 6 && tipo == 4)
        {
        }
        else
        {
            esplosione(matrice[i][j+1][2])
            darestituire.push(matrice[i][j+1])
            matrice[i][j+1] =generaelemento([i,j+1],"no",matrice)
        }
    }
    if (tipo == 5) 
    {
        if (i > 0 && j > 0 && matrice[i-1][j-1] != undefined) 
        {
            if( matrice[i-1][j-1][0] == 4 ||matrice[i-1][j-1][0] == 5)
            {
                let g = [i-1,j-1]
                esplosione(matrice[g[0]][g[1]][2])
                let k = effettospeciale(matrice[i-1][j-1][0],g,matrice)
                matrice = k[0]
                darestituire = k[1]
                
            }
            else if (matrice[i-1][j-1][0] == 6)
            {
                esplosione(matrice[i-1][j-1][2])
                matrice[i-1][j-1] = generaelemento([i-1,j-1],"no",matrice)
            }
            else
            {
                esplosione(matrice[i-1][j-1][2])
                darestituire.push(matrice[i-1][j-1])
                matrice[i-1][j-1] = generaelemento([i-1,j-1],"no",matrice)
            }
        }
        if (i > 0 && j < matrice[i].length - 1 && matrice[i-1][j+1] != undefined) 
        {
            if( matrice[i-1][j+1][0] == 4 ||matrice[i-1][j+1][0] == 5)
            {
                let g = [i-1,j+1]
                esplosione(matrice[g[0]][g[1]][2])
                let k = effettospeciale(matrice[i-1][j+1][0],g,matrice)
                matrice = k[0]
                darestituire = k[1]
                
            }
            else if (matrice[i-1][j+1][0] == 6)
            {
                esplosione(matrice[i-1][j+1][2])
                matrice[i-1][j+1] = generaelemento([i-1,j+1],"no",matrice)
            }
            else
            {          
                esplosione(matrice[i-1][j+1][2])  
                darestituire.push(matrice[i-1][j+1])
                matrice[i-1][j+1] = generaelemento([i-1,j+1],"no",matrice)
            }
        }
        if (i < matrice.length - 1 && j > 0 && matrice[i+1][j-1] != undefined) 
        {
            if( matrice[i+1][j-1][0] == 4 ||matrice[i+1][j-1][0] == 5)
            {
                let g = [i+1,j-1]
                esplosione(matrice[g[0]][g[1]][2])
                let k = effettospeciale(matrice[i+1][j-1][0],g,matrice)
                matrice = k[0]
                darestituire = k[1]
                
            }
            else if (matrice[i+1][j-1][0] == 6)
            {
                esplosione(matrice[i+1][j-1][2])
                matrice[i+1][j-1] = generaelemento([i+1,j-1],"no",matrice)
            }
            else
            {
                esplosione(matrice[i+1][j-1][2])
                darestituire.push(matrice[i+1][j-1])
                matrice[i+1][j-1] = generaelemento([i+1,j-1],"no",matrice)
            }
        }
        if (i < matrice.length - 1 && j < matrice[i].length - 1 && matrice[i+1][j+1] != undefined) 
        {
            if( matrice[i+1][j+1][0] == 4 ||matrice[i+1][j+1][0] == 5)
            {
                let g = [i+1,j+1]
                esplosione(matrice[g[0]][g[1]][2])
                let k = effettospeciale(matrice[i+1][j+1][0],g,matrice)
                matrice = k[0]
                darestituire = k[1]
                
            }
            else if (matrice[i+1][j+1][0] == 6)
            {
                esplosione(matrice[i+1][j+1][2])
                matrice[i+1][j+1] = generaelemento([i+1,j+1],"no",matrice)
            }
            else
            {
                esplosione(matrice[i+1][j+1][2])
                darestituire.push(matrice[i+1][j+1])
                matrice[i+1][j+1] = generaelemento([i+1,j+1],"no",matrice)
            }
        }
    }
    return [matrice, darestituire]
}
function controlloal(tipo, posizioni, matrice)
{
    const riga = posizioni[0]
    const colonna = posizioni[1]

    let comboDb = []
    if (colonna + 2 < matrice[riga].length && riga + 2 < matrice.length) 
    {
        if (matrice[riga][colonna][0] == tipo && matrice[riga][colonna + 1][0] == tipo && matrice[riga][colonna + 2][0] == tipo && matrice[riga + 1][colonna][0] == tipo && matrice[riga + 2][colonna][0] == tipo) 
        {
            comboDb = [matrice[riga][colonna], matrice[riga][colonna + 1], matrice[riga][colonna + 2], matrice[riga + 1][colonna], matrice[riga + 2][colonna]]
        }
    }
    let comboDa = []
    if (colonna + 2 < matrice[riga].length && riga - 2 >= 0) 
    {
        if (matrice[riga][colonna][0] == tipo && matrice[riga][colonna + 1][0] == tipo && matrice[riga][colonna + 2][0] == tipo && matrice[riga - 1][colonna][0] == tipo && matrice[riga-2][colonna][0] == tipo) 
        {
            comboDa = [matrice[riga][colonna], matrice[riga][colonna + 1], matrice[riga][colonna + 2], matrice[riga - 1][colonna], matrice[riga - 2][colonna]]
        }
    }
    let comboSb = []
    if (colonna - 2 >= 0 && riga + 2 < matrice.length) 
    {
        if (matrice[riga][colonna][0] == tipo && matrice[riga][colonna - 1][0] == tipo && matrice[riga][colonna - 2][0] == tipo && matrice[riga + 1][colonna][0] == tipo && matrice[riga + 2][colonna][0] == tipo) 
        {
            comboSb = [matrice[riga][colonna], matrice[riga][colonna - 1], matrice[riga][colonna - 2], matrice[riga + 1][colonna], matrice[riga + 2][colonna]]
        }
    }
    let comboSa = []
    if (colonna - 2 >= 0 && riga - 2 >= 0) 
    {
        if (matrice[riga][colonna][0] == tipo && matrice[riga][colonna - 1][0] == tipo && matrice[riga][colonna - 2][0] == tipo && matrice[riga - 1][colonna][0] == tipo && matrice[riga - 2][colonna][0] == tipo) 
        {
            comboSa = [matrice[riga][colonna], matrice[riga][colonna - 1], matrice[riga][colonna - 2], matrice[riga - 1][colonna], matrice[riga - 2][colonna]]
        }
    }

    if (comboDb.length == 5) 
    {
        return [comboDb,comboDb.length]
    } 
    else if (comboDa.length == 5) 
    {
        return [comboDa,comboDa.length]
    } 
    else if (comboSb.length == 5) 
    {
        return [comboSb,comboSb.length]
    } 
    else if (comboSa.length == 5) 
    {
        return [comboSa,comboSa.length]
    } 
    else 
    {
        return false
    }
}
function shift(matrice) 
{
    for (let i = matrice.length - 2; i >= 0; i--) 
    {
        for (let j = 0; j < matrice[i].length; j++) 
        {
            if (matrice[i][j][0] != undefined && matrice[i + 1][j][0] == undefined) 
            {
                let pos1 = { i: i, j: j }
                let pos2 = { i: i + 1, j: j }
                matrice = swap(pos1, pos2, matrice)
                let id1 = matrice[pos1.i][pos1.j][2]
                let id2 = matrice[pos2.i][pos2.j][2]
                swapanimation(id1, id2)
                setTimeout(function () {
                    stamparidotta(matrice)
                    matrice = shift(matrice)
                },200)
                return matrice
            }
        }
    }
    matrix = rigenera(matrice)
    stamparidotta(matrice)
    setTimeout(function(){
        matrice = controlloricorsivo(matrice)
    },200)
    return matrice
}
function lampeggio(array)
{
    array.forEach(eleme => {
        let jk = eleme[2]
        let gh = document.querySelector("[idunivoco='"+ jk +"']")
        gh.style.animation = "lampo 0.4s ease-out"
    })
}
function rigenera(matrice)
{
    for(let i = 0;i<matrice.length;i++)
    {
        for(let j = 0;j<matrice[i].length;j++)
        {
            if(matrice[i][j][0]==undefined)
            {
                let y = [i,j]
                matrice[i][j] = generaelemento(y,undefined,matrice)
            }
        }
    }
    return matrice
}
function swapanimation(idunin, idunout)
{
    let elementoIn = document.querySelector('[idunivoco="' + idunin + '"]')
    let elementoOut = document.querySelector('[idunivoco="' + idunout + '"]')

    let rectIn = elementoIn.getBoundingClientRect()
    let rectOut = elementoOut.getBoundingClientRect()
    let dx = rectIn.left - rectOut.left
    let dy = rectIn.top - rectOut.top
    elementoIn.style.transform = 'translate(' + -dx + 'px, ' + -dy + 'px)'
    elementoOut.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)'
}
function reverse(idunin, idunout)
{
    let elementoIn = document.querySelector('[idunivoco="' + idunin + '"]')
    let elementoOut = document.querySelector('[idunivoco="' + idunout + '"]')

    elementoIn.style.transform = ''
    elementoOut.style.transform = ''
}
function esplosione(idunivoco)
{
    let o = Math.round(Math.random() * ((esplosioni.length-1) - 0) + 0)
    document.body.style.setProperty("--esplosione",esplosioni[o])
    let elemento = document.querySelector('[idunivoco="' + idunivoco + '"]')
    let src = document.getElementById("backaudio")
    if(siaudio == true && view == true)
    {
        src.play()
    }
    if(elemento != null)
    {
        elemento.style.animation = "esplosione 0.4s ease-out forwards"
    }
    else
    {

    }
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
},0)
function win()
{
    localStorage.setItem("backup","")
    let y = "<h2>Hai Vinto</h2><h6>Tocca per tornare alla home</h6>"
    document.querySelector(".visiover").style.display = "flex"
    messaggio(y)
    document.querySelector(".avviso").addEventListener("click",function(){
        if(avviato == true)
        {
            let j = 0
            punteggio.forEach((fg,index) => {
                j = j + (fg * punti[index])
            })
            let kj = [punteggio,player,livello,j]
            let trovato = false
            classifica.forEach((elemento,index)=>{
                if(elemento[1] == kj[1])
                {
                    classifica[index] = kj
                    trovato = true
                }
            })
            if(trovato == false)
            {
                classifica.push(kj)
            }
            let certo = []
            classifica.forEach(elem => {
                if(certo.indexOf(elem) <= -1)
                {
                    certo.push(elem)
                }
            })
            classifica = certo
            classifica = classifica.sort((a,b) => b[3] - a[3])
            localStorage.setItem("classifica",JSON.stringify(classifica))
            document.querySelector(".avviso").style.animation = "scompari 0.6s ease-out"
            transizioneavanzata(document.querySelector(".areagioco"),document.querySelector(".homescreen"),"sfondo")
            statoattuale = "homescreen"
            setTimeout(function(){
                document.querySelector(".visiover").style.display = "none"
                document.querySelector(".avviso").style.display = "none"
                statoattuale = "homescreen"
                resetta()
            },400)
        }
    })
}
function lose()
{
    let y = "<h2>Hai Perso</h2><h6>Tocca per tornare alla home</h6>"
    localStorage.setItem("backup","")
    document.querySelector(".visiover").style.display = "flex"
    messaggio(y)
    document.querySelector(".avviso").addEventListener("click",function(){
        if(avviato == true)
        {
            transizioneavanzata(document.querySelector(".areagioco"),document.querySelector(".homescreen"),"sfondo")
            statoattuale = "homescreen"
            setTimeout(function(){
                document.querySelector(".visiover").style.display = "none"
                document.querySelector(".avviso").style.display = "none"
                resetta()
                statoattuale = "homescreen"
            },400)
        }
    })
}
function resetta()
{
    document.querySelector(".areagioco").removeAttribute("style")
    document.querySelector(".griglia").removeAttribute("style")
    document.querySelector(".jklh").removeAttribute("style")
    document.querySelector(".chiedinome").removeAttribute("style")
    document.querySelector(".appiglio").removeAttribute("style")
    document.querySelector(".appiglio").innerHTML = ""
    mosse = 0
    player = ""
    avviato = false
    spawnato = false
    noteseguendo = false
    punteggio = [0,0,0,0]
    scambio = undefined
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
function stampaclassifica(classifica,dove)
{
    let html = ""
    if(classifica != "")
    {
        document.querySelector(".fg").style.justifyContent = ""
        classifica.forEach((giocatore,index) => {
            let riga = "<div dati='" + JSON.stringify(giocatore) + "' class='giocatore levelbutton'><div class='posizioneclass'>" + (index+1) +"</div><div class='player'>" + giocatore[1] + "</div><div class='punteggio'>"+ giocatore[3] +"</div><img src='img/" + giocatore[2] + ".jpg' class='imglivello posizioneabso'></div>"
            html = html + riga
        })
        dove.innerHTML = html
        let giocatori = document.querySelectorAll(".giocatore")
        giocatori.forEach(oggetto => {
            oggetto.addEventListener("click",function(e){
                let attuale = e.currentTarget
                let dati = JSON.parse(attuale.getAttribute("dati"))
                costruisciclassifica(dati,document.querySelector(".classiview"),true)
                transizione(document.querySelector(".classifica"),document.querySelector(".areaclassifica"))
                statoattuale = "areaclassifica"
            })
        })
    }
    else
    {
        dove.innerHTML = "<h3>Attualmente vuota</h3>"
        document.querySelector(".fg").style.justifyContent = "center"
    }
}
function costruisciclassifica(dati,dove,si) 
{
    let html = ""
    if(si == false)
    {
        html = "<div class='classi-box levelbutton'><div class='sinistra'><div class='classi-prog'><img src='img/secco-general.png' class='classi-img'><progress class='secco' max='50' value='"+ dati[0][0] + "'></progress><h4>"+dati[0][0]+"/50</h4></div><div class='classi-prog'><img src='img/carta-general.png' class='classi-img'><progress class='carta' max='50' value='"+dati[0][1]+"'></progress><h4>"+dati[0][1]+"/50</h4></div><div class='classi-prog'><img src='img/plastica-general.png'  class='classi-img'><progress class='plastica' max='50' value='"+dati[0][2]+"'></progress><h4>"+ dati[0][2] +"/50</h4></div><div class='classi-prog'><img src='img/vetro-general.png' class='classi-img'><progress class='vetro' max='50' value='"+ dati[0][3] +"'></progress><h4>" + dati[0][3] + "/50</h4></div></div><div class='destra'><div class='classi-nome'><h3>" + dati[1] + "</h3></div><div class='classi-tot'><h3>" + dati[3] + "</h3></div></div></div>"
    }
    else
    {
        html = "<div class='classi-box levelbutton'><div class='sinistra'><div class='classi-prog'><img src='img/secco-general.png' class='classi-img'><progress class='secco' max='50' value='"+ dati[0][0] + "'></progress><h4>"+dati[0][0]+"/50</h4></div><div class='classi-prog'><img src='img/carta-general.png' class='classi-img'><progress class='carta' max='50' value='"+dati[0][1]+"'></progress><h4>"+dati[0][1]+"/50</h4></div><div class='classi-prog'><img src='img/plastica-general.png'  class='classi-img'><progress class='plastica' max='50' value='"+dati[0][2]+"'></progress><h4>"+ dati[0][2] +"/50</h4></div><div class='classi-prog'><img src='img/vetro-general.png' class='classi-img'><progress class='vetro' max='50' value='"+ dati[0][3] +"'></progress><h4>" + dati[0][3] + "/50</h4></div></div><div class='destra'><div class='classi-nome'><h3>" + dati[1] + "</h3></div><div class='classi-tot'><h3>" + dati[3] + "</h3></div></div><img class='imglivello posizioneabso' src='img/" + dati[2] + ".jpg'></div>"
    }
    dove.innerHTML = html
}
function transizione(inn,outt)
{
    setTimeout(()=>{
        document.querySelector(".blocco").style.display = "block"
        inn.style.animation = "transitionout 0.6s ease-out forwards"
        outt.style.animation = "transitionin 0.6s ease-out forwards"
        outt.style.display = "flex"
        setTimeout(function(){
            inn.style.display  ="none"
            document.querySelector(".blocco").style.display = "none"
        },600)
    },25)
}
function transizioneavanzata(inn,outt,w)
{
    setTimeout(()=>{
        document.querySelector(".blocco").style.display = "block"
        inn.style.animation = "transitionout 0.6s ease-out forwards"
        outt.style.animation = "transitionin 0.6s ease-out forwards"
        document.querySelector(".generalover").style.display = "block"
        document.querySelector(".generalover").style.animation = "transitionover 0.6s ease-out forwards"
        setTimeout(function(){
            document.getElementById("sfondo").src = "img/"+w+".jpg"
        },200)
        outt.style.display = "flex"
        setTimeout(function(){
            inn.style.display  ="none"
            document.querySelector(".generalover").style.display = "none"
            document.querySelector(".blocco").style.display = "none"
        },600)
        
    },25)
}
function messaggio(n)
{
    document.getElementById("avvisu").innerHTML = n
    document.querySelector(".avviso").style.animation = "se 0.6s ease-out"
    document.querySelector(".avviso").style.display = "flex"
}
function avviso(n)
{
    document.body.style.setProperty("--esito","#833920")
    document.getElementById("avvisu").innerHTML = n
    transizione(document.querySelector(".chiedinome"),document.querySelector(".avviso"))
    statoattuale = "avviso"
    setTimeout(function(){
        transizione(document.querySelector(".avviso"),document.querySelector(".chiedinome"))  
        statoattuale = "chiedinome"      
    },800)
}
function chiedinome(e)
{
    if(localStorage.getItem("player"))
    {
        document.getElementById("nome").value = localStorage.getItem("player")
    }
    else
    {

    }
    document.querySelector(".ok").addEventListener("click",()=>{
        if(document.getElementById("nome").value != "")
        {
            player = document.getElementById("nome").value
            localStorage.setItem("player",player)
            let d = generazione(e)
            avviato = true
            transizione(document.querySelector(".chiedinome"),document.querySelector(".areagioco"))
            statoattuale = "areagioco"
            setTimeout(function(){
                document.querySelector(".chiedinome").style.display = "none"
                stampaggiorna(d)
            },400)
        }
        else
        {
            avviso("Inserisci un nome")
        }
    })
}
giocabutton.addEventListener("click", () => {
    transizione(document.querySelector(".homescreen"),document.querySelector(".selezione"))
    statoattuale = "selezione"
})
regolebutton.addEventListener("click",()=>{
    transizione(document.querySelector(".homescreen"),document.querySelector(".regole"))
    statoattuale = "regole"
})
classificabutton.addEventListener("click",()=>{
    stampaclassifica(classifica,document.querySelector(".classi-view"))
    setTimeout(function(){
        transizione(document.querySelector(".homescreen"),document.querySelector(".classifica"))
        statoattuale = "classifica"
    },25)
})
backtohomebutton.forEach(button => {
    button.addEventListener("click", ()=>{
        transizione(document.querySelector("."+statoattuale),document.querySelector(".homescreen"))
        statoattuale = "homescreen"
    })
})
backtoclassifica.forEach(bottone => {
    bottone.addEventListener("click",function(){
        transizione(document.querySelector("."+statoattuale),document.querySelector(".classifica"))
        statoattuale = "classifica"
    })
})
x5button.addEventListener("click", ()=>{
    document.body.style.setProperty("--sfondotabella",colori.x5+"d5")
    livello = "x5"
    chiedinome(5)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".chiedinome"),"x5")
    statoattuale = "chiedinome"
})
x6button.addEventListener("click", ()=>{
    document.body.style.setProperty("--sfondotabella",colori.x6+"d5")
    livello = "x6"
    chiedinome(6)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".chiedinome"),"x6")
    statoattuale = "chiedinome"
})
x7button.addEventListener("click", ()=>{
    document.body.style.setProperty("--sfondotabella",colori.x7+"d5")
    livello = "x7"
    chiedinome(7)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".chiedinome"),"x7")
    statoattuale = "chiedinome"
})
xcasualebutton.addEventListener("click",()=>{
    let num = Math.round(Math.random()*(10-5)+5)
    document.body.style.setProperty("--sfondotabella",colori.xcasuale)
    livello = "xcasuale"
    chiedinome(num)
    transizioneavanzata(document.querySelector(".selezione"),document.querySelector(".chiedinome"),"xcasuale")
    statoattuale = "chiedinome"
})
pausabutton.addEventListener("click",()=>{
    let tot = 0
    punteggio.forEach((attuale,index) => {
        tot = tot + (attuale*punti[index])
    })
    costruisciclassifica([punteggio,player,"",tot],document.querySelector(".puntiview"),false)
    setTimeout(function(){
        document.querySelector(".areagioco").style.animation = "sevabo 0.6s ease-out forwards"
        document.querySelector(".pausa").style.animation = "se 0.6s ease-out forwards"
        document.querySelector(".pausa").style.display = "flex"
    },100)
    statoattuale = "pausa"
})
document.getElementById("termina").addEventListener("click",function(){
    resetta()
    transizioneavanzata(document.querySelector(".pausa"),document.querySelector(".homescreen"),"sfondo")
    statoattuale = "homescreen"
})
document.getElementById("riprendi").addEventListener("click",function(){
    setTimeout(function(){
        document.querySelector(".areagioco").style.animation = "sevabow 0.6s ease-out forwards"
        document.querySelector(".pausa").style.animation = "seinverso 0.6s ease-out forwards"
        setTimeout(function(){
            document.querySelector(".pausa").style.display = "none"
        },600)
    },25)
})
document.getElementById("impostazionibutton").addEventListener("click",function(){
    transizione(document.querySelector(".homescreen"),document.querySelector(".impostazioni"))
    statoattuale = "impostazioni"
})

audio.addEventListener("input",function(){
    localStorage.setItem("audio",audio.value)
})
sonori.addEventListener("input",function(){
    localStorage.setItem("sonori",sonori.value)
})
document.getElementById("resetta").addEventListener("click",function(){
    setTimeout(()=>{
        localStorage.clear()
        window.location.reload()
    },25)
})
history.pushState(null, null, document.URL)
window.addEventListener('popstate', () => {
  if (statoattuale == "selezione") 
  {
    history.pushState(null, null, document.URL)
    transizione(document.querySelector(".selezione"),document.querySelector(".homescreen"))
    statoattuale = "homescreen"
  } 
  else if (statoattuale == "homescreen") 
  {
    history.back()
  }
  else if(statoattuale == "regole")
  {
    history.pushState(null, null, document.URL)
    transizione(document.querySelector(".regole"),document.querySelector(".homescreen"))
    statoattuale = "homescreen"
  }
  else if(statoattuale == "areagioco")
  {
    history.pushState(null, null, document.URL)
  }
  else if(statoattuale == "classifica")
  {
    history.pushState(null, null, document.URL)
    transizione(document.querySelector(".classifica"),document.querySelector(".homescreen"))
    statoattuale = "homescreen"
  }
  else if (statoattuale == "pausa")
  {
    history.pushState(null, null, document.URL)
  }
  else if (statoattuale == "areaclassifica")
  {
    history.pushState(null, null, document.URL)
    transizione(document.querySelector(".areaclassifica"),document.querySelector(".classifica"))
    statoattuale = "classifica"
  }
  else if (statoattuale == "avviso")
  {
    history.pushState(null, null, document.URL)
  }
  else if(statoattuale == "chiedinome")
  {
    history.pushState(null, null, document.URL)
    transizioneavanzata(document.querySelector(".chiedinome"),document.querySelector(".selezione"),"sfondo")
    statoattuale = "selezione"
  }
  else if (statoattuale == "impostazioni")
  {
    history.pushState(null, null, document.URL)
    transizioneavanzata(document.querySelector(".chiedinome"),document.querySelector(".selezione"),"sfondo")
    statoattuale = "homescreen"
  }
})
window.addEventListener("beforeunload",() => {
    if(avviato == true)
    {
        localStorage.setItem("backup",JSON.stringify([punteggio,player,livello,mosse,matrixprov]))
    }
    else
    {
        localStorage.setItem("backup","")
    }
})
window.addEventListener("focus",function(){
    if(siaudiof==true)
    {
        document.getElementById("main").play()
    }
    view = true
})
window.addEventListener("blur",function(){
    view = false
    if(siaudiof==true)
    {
        document.getElementById("main").pause()
    }
})