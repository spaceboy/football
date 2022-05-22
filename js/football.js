// Oživ tlačítko pro přidání hráčů do formulářů:
Evnt.onAll("table.players tfoot .add", "click", Events.clickPlayerAdd);

// Vlož první řádek do formuláře hráčů vlastních i soupeře:
Evnt.trigger("#club-players tfoot .add", "click");
Evnt.trigger("#partner-players tfoot .add", "click");

// Vlož na hřiště figuru brankáře:
Events.addPlayerFigure(document.querySelector("#lineup .line-gol"));

// Inicializuj Color pickery:
for (var el of document.querySelectorAll("form input[data-type='color']")) {
    new ColorPicker(el);
}

// Inicializuj zobrazování dresů:
let shirtTypeList = {
    "compact": "Jednobarevné",
    "halfVertical": "Půlené (svisle)",
    "halfHorizontal": "Půlené (vodorovně)",
    "halfSides": "Půlené (boky)",
    "stripesVertical": "Pruhované (svisle)",
    "stripesHorizontal": "Pruhované (vodor.)"
};

// Dresy hráčů v poli:
let jerseyField = (new Jersey())
    .setShirtTypeList(shirtTypeList)
    .createOptions(document.getElementById("jersey-field-type"));
Evnt.on(
    "form#form-field",
    "change",
    (e) => {
        Events.jerseyChange(e, jerseyField);
    }
);

// Dres brankáře:
let goalieField = (new Jersey())
    .setShirtTypeList(shirtTypeList)
    .createOptions(document.getElementById("jersey-goalie-type"));
Evnt.on(
    "form#form-goalie",
    "change",
    (e) => {
        Events.jerseyChange(e, goalieField);
    }
);

// Nastav defaultní hodnoty:
for (var el of document.querySelectorAll("form *[data-default-value]")) {
    el.value = el.getAttribute("data-default-value");
}

// Zpropaguj výchozí hodnoty z formulářů pro dresy do zobrazení dresu:
for (var el of document.querySelectorAll("#form-field select, #form-field input, #form-goalie select, #form-goalie input")) {
    Evnt.trigger(
        el,
        new Event(
            "change",
            {
                "bubbles": true,
                "currentTarget": el.closest("form"),
                "target": el
            }
        )
    );
}

// Posunutí hráče vpřed/vzad:
Evnt.onAll("#lineup .line .player", "click", Events.clickPlayer);

// Změna rozestavení: standardy
Evnt.on('#positions-preset', "change", Events.changePositionsPreset);

// Změna rozestavení: počet hráčů v řadě:
Evnt.on("#positions-def", "change", Events.changePositionsDef);
Evnt.on("#positions-mid", "change", Events.changePositionsMid);
Evnt.on("#positions-str", "change", Events.changePositionsStr);

// Změna rozestavení: rozestavení řadě:
Evnt.on("#horizontal-def", "change", Events.changeHorizontalDef);
Evnt.on("#horizontal-mid", "change", Events.changeHorizontalMid);
Evnt.on("#horizontal-str", "change", Events.changeHorizontalStr);

// Přidáme jméno brankáře:
Evnt.trigger("#players-gol tfoot .add", "click");

// Nastavíme základní sestavu:
Evnt.trigger("#positions-preset", "change");

// Oživ tlačítko pro přidání náhradníka do formuláře:
/*
Evnt.on("table.players tfoot .add", "click",
function (e) {
    var el = document.getElementById("template-lineup-substitute").cloneNode(true);
    document.querySelector("#substitute-players table tbody").appendChild(el);
    Evnt.on(el.querySelector(".remove"), "click", (e) => {
        console.log(e.currentTarget);
    });
}
);
*/

// Aktivace menu:
Evnt.onAll("ul.menu > li", "click", (e) => {
    var t = e.currentTarget;
    for (var el of t.closest("ul.menu").querySelectorAll("li")) {
        el.removeAttribute("class");
    }
    t.setAttribute("class", "active");
    for (var el of document.querySelectorAll("div.block")) {
        el.setAttribute("class", "block");
    }
    document.getElementById(t.getAttribute("data-target")).setAttribute("class", "block active");
});


// Mock naplnění vlastních hráčů:
for (var i = 1; i <= 10; i++) {
    Evnt.trigger("#club-players tfoot .add", "click");
}
var i = 1;
for (var el of document.querySelectorAll("#club-players tbody tr")) {
    el.querySelector(".player-number").value = i;
    el.querySelector(".player-name").value = "Player #" + i;
    i++;
}

// Mock naplnění hráčů soupeře:
for (var i = 1; i <= 10; i++) {
    Evnt.trigger("#partner-players tfoot .add", "click");
}
var i = 1;
for (var el of document.querySelectorAll("#partner-players tbody tr")) {
    el.querySelector(".player-number").value = i;
    el.querySelector(".player-name").value = "Protivník #" + i;
    i++;
}

// Mock pro předvyplnění formulářových polí:
Data.load({
    "club-info": {
        "name": "TJ Slavoj Houslice",
        "chairman": "Václav Orel",
        "manager": "Jirka Luňák"
    },
    "match-info": {
        "type": "ligové utkání",
        "partner": "FC Real Horní Lhota",
        "place": "Dřevona arena Dolní Lhota",
        "day": "sobotu 7.6.",
        "time": "17:00",
        "match-info-referee": "Roman Berbr",
        "match-info-referee2": "Roman Rogoz",
        "match-info-referee3": "Dagmar Damková",
        "match-info-referee4": "Karel Přecechtěl",
        "match-info-var": "Josef Musel",
        "match-info-delegate": "Václav Jebavý"
    }
});




Events.copyJerseyColors();

class Data {
    static load (data) {
        for (var i in data) {
            var f = document.querySelector(`form[name="${i}"]`);
            if (!f) {
                continue;
            }
            for (var j in data[i]) {
                var el = document.getElementById(j);
                if (!el) {
                    el = f.querySelector(`[name="${j}"]`);
                }
                if (!el) {
                    continue;
                }
                el.value = data[i][j];
                Evnt.trigger(el, "change");
            }
        }
    }
}
/*

https://okresniprebor.fandom.com/cs/wiki/TJ_Slavoj_Houslice

TJ Slavoj Houslice

https://okresniprebor.fandom.com/cs/wiki/TJ_Slavoj_Houslice?file=Slavoj_14_hr%25C3%25A1%25C4%258D%25C5%25AF.jpg

na fotce horní řada zleva doprava:

Jirka Luňák (Ondřej Vetchý) - kapitán a trenér
Láďa Křivánek (Petr Růžička)
Jarda Kužel (David Novotný) - útočník
Kája Vachopulos (Jakub Kohák) - brankář
František Mažňák (Petr Franěk) - obránce
Jindra Konipásek (Karel Wiencek)
Tonda Nádeník (Lukáš Langmajer)
Jarmil Hubáček (Ladislav Hampl)

na fotce dolní řada zleva doprava

Jan Provazník (Karel Čech) - stoper
Jirka Mazánek (Jiří Petříš) - záložník
Norbert Kott (Jarmil Škvrňa)
Čeněk Pazdera (Milan Štróbl)
Phun Ding Dung (Doan Gia Bao)
Jaroslav Veselý (Lukáš Jambor)

Brankář:
1 Vachopulos

Obrana:
16 Ding Dung
Kott
Provazník
4 Mažňák

Záloha:
6 Mazánek
Luňák

Útok:
10 Kužel
*/