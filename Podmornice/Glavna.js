var tabla = {
    velTable: 9,
    brBrodova: 6,
    brPotopljenih: 0,

    podmornice : [
        { lokacije: [0, 0], pogodci: ["", ""], velicina: 2 },
        { lokacije: [0, 0, 0], pogodci: ["", "", ""], velicina: 3 },
        { lokacije: [0, 0, 0], pogodci: ["", "", ""], velicina: 3 },
        { lokacije: [0, 0, 0], pogodci: ["", "", ""], velicina: 3 },
        { lokacije: [0, 0, 0, 0], pogodci: ["", "", "", ""], velicina: 4 },
        { lokacije: [0, 0, 0, 0, 0], pogodci: ["", "", "","",""], velicina: 5 }
    ],
    //funkcija za pucanje
    pucaj: function(pokusaj) {

        for(var i = 0; i < this.brBrodova; i++) {
            var podmornica = this.podmornice[i];
            var index = podmornica.lokacije.indexOf(pokusaj);

            //provera da li je već pogođena
            if ( podmornica.pogodci[index] === "pogodak" ) {
                view.prikazPoruke("Koordinata već pogođena");
                return true;

            } else if ( index >= 0 ) {
                podmornica.pogodci[index] = "pogodak";
                view.prikazPogotka(pokusaj);
                view.prikazPoruke("Pogodak!");

                if ( this.potopljena(podmornica) ) {
                    view.prikazPoruke("Podmornica potopljena!");
                    this.brPotopljenih++;
                }
                return true;
            }
        }
        view.prikazPromasaja(pokusaj);
        view.prikazPoruke("Promašaj!");
        return false;
    },

    // f-ja za proveru da li je podmornica potopljena
    potopljena: function(podmornica) {
        for (var i = 0; i < podmornica.velicina; i++) {
            if (podmornica.pogodci[i] !== "pogodak") {
                return false;
            }
        }
        return true;
    },

    generisiLokacije: function() {
        var lokacije;
        for (var i = 0; i < this.podmornice.length; i++) {
            var podmornica = this.podmornice[i];
            do {
                lokacije = this.generisiPodmornice(podmornica.velicina);
            } while (this.sudar(lokacije));
            this.podmornice[i].lokacije = lokacije;
        }
         //lokacije u konzoli
        console.log(this.podmornice);
    },

    generisiPodmornice: function(x) {
        //plus 1 kako bi se osiguralo da ne postavi podmornice u kolone koje sadrze slova
        var smer = Math.floor(Math.random() * 2);
        var red, kol;
        if (smer === 1) { //horizontalno
            red = Math.floor(Math.random() * this.velTable);
            kol = Math.floor(Math.random() * (this.velTable - x + 1))+1;
        } else { // vertikalno
            red = Math.floor(Math.random() * (this.velTable - x + 1));
            kol = Math.floor((Math.random() * this.velTable)+1);
        }


        var noveLokacije = [];

        for (var i = 0; i < x; i++) {
            if (smer === 1) {
                noveLokacije.push(red + "" + (kol + i));
            } else {
                noveLokacije.push((red + i) + "" + kol);
            }
            //console.log(noveLokacije);
        }
        return noveLokacije;

    },
    //f-ja za proveru da li je došlo do sudara
    sudar: function(lokacije) {
        for (var i = 0; i < this.brBrodova; i++) {
            var podmornica = this.podmornice[i];
            for (var j = 0; j < lokacije.length; j++) {
                if (podmornica.lokacije.indexOf(lokacije[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};
//zvukovi za promašaj i pogodak
var zvuk1 = new Audio("promasaj.wav");
var zvuk2 = new Audio("pogodak.wav");

//podsetnik za broj brodova
var flag = 1;
function otkri() {
  if(flag === 1){
      flag = 0;
      plava();
  }
  else{
      flag = 1;
      bela();
  }
}
//pomoćne f-je koje da bi se omogućio ponovni klik na dugme za podsetnik
function plava() {
    aa = document.getElementById("spisak");
    aa.style.color = "cornflowerblue";
}
function bela() {
    aa = document.getElementById("spisak");
    aa.style.color = "white";
}

//poruke korisniku
var view = {
    prikazPoruke: function(msg) {
        var poruke = document.getElementById("poruke");
        poruke.innerHTML = msg;
    },
    prikazPogotka: function(uneto) {
        var polje = document.getElementById(uneto);
        polje.setAttribute("class", "hit");
        zvuk2.play();
    },
    prikazPromasaja: function(uneto) {
        var polje = document.getElementById(uneto);
        polje.setAttribute("class", "miss");
        zvuk1.play();
    }
};

//provera da li je igra gotova
var kontroler = {
    torpeda: 0,

    kontrola: function(pokusaj) {
        var uneto = proveraUnosa(pokusaj);

        if (uneto) {
            this.torpeda++;
            var hit = tabla.pucaj(uneto);
            if (hit && tabla.brPotopljenih === tabla.brBrodova) {
                function pobeda(){ document.location.href = "Pobeda.html"; }
                //pauza od sekundu i po
                setTimeout(pobeda, 1500);
                //stavljanje vrednosti u lokalnu mem, kako bi se povukla na drugoj html stranici
                localStorage.setItem("vrednost", this.torpeda);
            }
        }
    }
};

// Ograničenje unosa
function proveraUnosa(pokusaj) {
    var slova = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    if (pokusaj === null || pokusaj.length !== 2) {
        alert("Neispravan unos!");
    } else {
        var prvi = pokusaj.charAt(0);
        var red = slova.indexOf(prvi);
        var kolona = pokusaj.charAt(1);
        if (isNaN(red) || isNaN(kolona)) {
            alert("Neispravan unos!");}
        else if (red < 0 || red > tabla.velTable || kolona <= 0 || kolona > tabla.velTable) {
            alert("Neispravan unos!");
        } else {
            return red + kolona;
        }
    }
    return null;
}

//event handlers-i
function dugmeZaPucaj() {
    var pokusajUnos = document.getElementById("unos");
    var pokusaj = pokusajUnos.value.toUpperCase();
    kontroler.kontrola(pokusaj);
    pokusajUnos.value = "";
}
//za prihvatanje unosa preko entera
function enterDugme(e) {
    var dugmePucaj = document.getElementById("dugme");
    //keyCode 13 predstavlja enter dugme na tastaturi
    e = e || window.event;
    if (e.keyCode === 13) {
        dugmePucaj.click();
        return false;
    }
}
// init - pozvan na otvaranju stranice
window.onload = init;

function init() {
    // pucaj! button onclick handler
    var dugmePucaj = document.getElementById("dugme");
    dugmePucaj.onclick = dugmeZaPucaj;
    // handle "return" key press
    var pokusajUnos = document.getElementById("unos");
    pokusajUnos.onkeypress = enterDugme;
    // place the podmornice on the game board
    tabla.generisiLokacije();
}