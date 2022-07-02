var selectedPlayer;

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
    "stripesHorizontal": "Pruhované (vodor.)",
    "thinStripesHorizontal": "Tenké linky (vodor.)"
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
Evnt.triggerAll(
    "#form-field select, #form-field input, #form-goalie select, #form-goalie input",
    new Event(
        "change",
        {
            "bubbles": true,
            "currentTarget": el.closest("form"),
            "target": el
        }
    )
);

// Posunutí hráče vpřed/vzad:
Evnt.onAll("#lineup .line .player .position", "click", Events.clickPlayerPosition);
// Klinkutí na hráče
Evnt.onAll("#lineup .line .player", "click", Events.clickPlayer)

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

// Přidáme do sestavy brankáře:
Evnt.trigger("#players-gol tfoot .add", "click");

// Nastavíme základní sestavu:
Evnt.trigger("#positions-preset", "change");

// Ovládání výběru hráče do rozestavení:
Evnt.on("#player-name-select .close", "click", (e) => {
    document.getElementById("player-name-select").style.display = "none";
});
Evnt.on("#player-name-select select", "change", Events.changePlayerNameOnLineup);

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
// Zpropagujeme barvy dresů na upoutávku:
Events.copyJerseyColors();

// Formulář informací o zápasu:
Evnt.on('form[name="match-info"]', "change", Events.changeMatchInfoForm);

// Manipulace se základní sestavou (malou):
//Evnt.onAll("#block-result-lineup .lineup .lineup-list", "click", Events.clickPlayerLineup);

// Formulář pro vkládání událostí:
Evnt.on('form[name="events"]', "change", Events.changeEventForm);
Evnt.on('form[name="events"] #events-close', "click", Events.eventFormClear);
Evnt.on('form[name="events"] input[name="submit"]', "click", Events.submitEventForm);

// Aktivace menu:
Evnt.onAll("ul.menu > li[data-target]", "click", (e) => {
    var t = e.currentTarget;
    var menu = t.closest("ul.menu");

    // Pokud neexistuje cílový panel, zruš akci:
    var panel = document.getElementById(t.getAttribute("data-target"));
    if (!panel) {
        return;
    }

    // Skrýt panely navázané na menu:
    for (var el of document.querySelectorAll(
        menu.hasAttribute("data-name")
        ? `div.block[data-name=\"${menu.getAttribute("data-name")}\"]`
        : "div.block"
    )) {
        el.setAttribute("class", "block");
    }
    // Skrýt položky menu:
    for (var el of menu.querySelectorAll("li")) {
        el.removeAttribute("class");
    }

    // Kliknuté položce manu nastavit class active:
    t.setAttribute("class", "active");

    // Zobrazit content navázaný na aktivní položku:
    panel.setAttribute("class", "block active");
});

// Menu: Otvírání defaultních panelů:
for (var el of document.querySelectorAll("ul.menu")) {
    if (!el.hasAttribute("data-default")) {
        continue;
    }
    Evnt.trigger(el.querySelector(`li[data-target=\"${el.getAttribute("data-default")}\"]`), "click");
}


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

// Mock pro předvyplnění formulářových polí:
Data.load({
    "club-info": {
        "name": "TJ Slavoj Houslice",
        "chairman": "Václav Orel",
        "manager": "Bohumír Zenkl"
    },
    "match-info": {
        "type": "ligové utkání",
        "partner": "FC Real Horní Lhota",
        "place": "hřiště Dolní Lhota",
        "day": "v sobotu 7.6.",
        "time": "17:00",
        "match-info-referee": "Roman Berbr",
        "match-info-referee2": "Roman Rogoz",
        "match-info-referee3": "Dagmar Damková",
        "match-info-referee4": "Karel Přecechtěl",
        "match-info-var": "Josef Musel",
        "match-info-delegate": "Václav Jebavý"
    }
});

// Mock naplnění vlastních hráčů:
for (var i = 1; i <= 13; i++) {
    Evnt.trigger("#club-players tfoot .add", "click");
}
var i = 0;
var players = [
    "Vachopulos",
    "Mažňák",
    "Provazník",
    "Kott",
    "Pazdera",
    "Ding Dung",
    "Veselý",
    "Hubáček",
    "Mazánek",
    "Nádeník",
    "Konipásek",
    "Kužel",
    "Luňák",
    "Křivánek"
];
for (var el of document.querySelectorAll("#club-players tbody tr")) {
    el.querySelector(".player-name").value = players[i];
    el.querySelector(".player-number").value = ++i;
}
// Vyvolání události, aby se hráči zpropagovali do zápasové sestavy:
Evnt.trigger("#club-players input", "change");

// Mock: Hráč Nádeník ke dnešnímu zápasu nenastupuje:
(new Elem(document.querySelectorAll('#our-players input[name="player-number"]')[8].closest("tr"))).qs('input[name="player-on"]').checked = false;

// Mock naplnění hráčů soupeře:
for (var i = 1; i <= 10; i++) {
    Evnt.trigger("#partner-players tfoot .add", "click");
}
var i = 1;
for (var el of document.querySelectorAll("#partner-players tbody tr")) {
    el.querySelector(".player-number").value = i;
    el.querySelector(".player-name").value = `Protihráč ${i}`;
    i++;
}

// Vypíšeme názvy týmů, rozhodčí, vytvoříme seznamy hráčů:
Events.setCanvasTitle();
Events.setReferee();
Events.createPlayerLists();


let button = (new Elem("#template-make-image")).clone(true).attrRemove("id");
//button.appendTo("#canvas");
button.clone(true).appendTo("#block-result-lineup div.result");
button.clone(true).appendTo("#block-result-1st-half div.result");
button.clone(true).appendTo("#block-result-2nd-half div.result");
button.clone(true).appendTo("#block-result-extended div.result");
//button.appendTo("#block-result-penalties div.result");

Evnt.onAll("div.result div.make-image", "click", Events.clickImageDownloadButton);
