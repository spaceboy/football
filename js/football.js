var selectedPlayer;

// Oživ tlačítko pro přidání hráčů do formulářů:
Evnt.onAll("table.players tfoot .add", "click", Events.clickPlayerAdd);

// Vlož první řádek do formuláře hráčů vlastních i soupeře:
Evnt.trigger("#club-players tfoot .add", "click");
Evnt.trigger("#partner-players tfoot .add", "click");

// Vlož na hřiště figuru brankáře:
Events.addPlayerFigure(document.querySelector("#lineup .line-gol"));

// Inicializuj Color pickery:
Each.all("form input[data-type='color']").do((el) => new ColorPicker(el));

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
    "form#jersey-field",
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
    "form#jersey-goalie",
    "change",
    (e) => {
        Events.jerseyChange(e, goalieField);
    }
);

// Nastav defaultní hodnoty:
Each.all("form *[data-default-value]").do((el) => el.value = el.getAttribute("data-default-value"));

// Zpropaguj výchozí hodnoty z formulářů pro dresy do zobrazení dresu:
Each
    .all("#jersey-field select, #jersey-field input, #jersey-goalie select, #jersey-goalie input")
    .do((el) => Evnt.trigger(
        el,
        new Event(
            "change",
            {
                "bubbles": true,
                "currentTarget": el.closest("form"),
                "target": el
            }
        )
    ));

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
//Evnt.onAll("#block-flyers-lineup .lineup .lineup-list", "click", Events.clickPlayerLineup);

// Formulář pro vkládání událostí:
Evnt.on('form[name="event-editor"]', "change", Events.changeEventForm);
Evnt.on('form[name="event-editor"] #events-close', "click", Events.eventFormClear);
Evnt.on('form[name="event-editor"] input[name="submit"]', "click", Events.submitEventForm);

function penaltiesCountScore () {
    var scoreHome = 0;
    var scoreAway = 0;
    Each.all("#block-flyers-penalties .events .event").do((el) => {
        if (Elem.from(el, ".home .ico .ico").hasClass("goal")) {
            ++scoreHome;
        }
        if (Elem.from(el, ".away .ico .ico").hasClass("goal")) {
            ++scoreAway;
        }
    });
    Elem.sel("#block-flyers-penalties .score").innerText = `${scoreHome}:${scoreAway}`;
}

function penaltiesEditRow (e) {
    let form = Elem.from('form[name="penalties-editor"]');
    let row = Elem.from(e.currentTarget);

    form.qs("th.number").innerText = row.attr("data-number");
    Elem.from(form, 'select[name="home-player"]').val(row.qs(".home .comment").innerText);
    form.qs('input[name="home-success"]').checked = Elem.from(row, ".home .ico .ico").hasClass("goal");
    Elem.from(form, 'select[name="away-player"]').val(row.qs(".away .comment").innerText);
    form.qs('input[name="away-success"]').checked = Elem.from(row, ".away .ico .ico").hasClass("goal");
    form.addClass("edit-mode");
}

function penaltiesSetRow (rowNum, data) {
    var row = Elem.from(`#block-flyers-penalties .events .event[data-number="${rowNum}"]`);
    if (!row) {
        row = Elem.from("#template-event-show").clone(true).attrRemove("id");
        row.appendTo(Elem.sel("#block-flyers-penalties .events"));
        Evnt.on(row, "click", penaltiesEditRow);
    }

    row.qs(".home .comment").innerText = data["home-player"];
    row.qs(".home .ico").innerHTML = "";
    row.qs(".away .ico").innerHTML = "";
    if (data["home-success"]) {
        Elem.from("#template-penalities-goal").clone(true).attrRemove("id").appendTo(row.qs(".home .ico"));
    } else {
        Elem.from("#template-penalities-miss").clone(true).attrRemove("id").appendTo(row.qs(".home .ico"));
    }

    row.qs(".away .comment").innerText = data["away-player"];
    if (data["away-success"]) {
        Elem.from("#template-penalities-goal").clone(true).attrRemove("id").appendTo(row.qs(".away .ico"));
    } else {
        Elem.from("#template-penalities-miss").clone(true).attrRemove("id").appendTo(row.qs(".away .ico"));
    }

    row.qs(".time").innerText = rowNum;
    row.attr("data-number", rowNum);

    penaltiesCountScore();
}

function penaltiesEditorReset () {
    let form = Elem.from('form[name="penalties-editor"]');
    form.removeClass("edit-mode");
    form.get().reset();
    form.qs("th.number").innerText = Elem.sel("#block-flyers-penalties .events").childElementCount + 1;
}

Evnt.onAll('form[name="penalties-editor"] button', "click", (e) => {
    e.preventDefault();
    switch (e.currentTarget.getAttribute("class")) {
        case "submit":
            let form = Elem.from(e.currentTarget.closest("form"));
            let err = false;

            var playerHomeSel = Elem.from(form, 'select[name="home-player"]');
            if (!playerHomeSel.value()) {
                err = true;
                playerHomeSel.addClass("form-error");
            } else {
                playerHomeSel.removeClass("form-error");
            }

            var playerAwaySel = Elem.from(form, 'select[name="away-player"]');
            if (!playerAwaySel.value()) {
                err = true;
                playerAwaySel.addClass("form-error");
            } else {
                playerAwaySel.removeClass("form-error");
            }

            if (err) {
                return;
            }

            penaltiesSetRow(
                parseInt(form.qs("th.number").innerText),
                {
                    "home-player": playerHomeSel.value(),
                    "home-success": form.qs('input[name="home-success"]').checked,
                    "away-player": playerAwaySel.value(),
                    "away-success": form.qs('input[name="away-success"]').checked
                }
            );

            penaltiesEditorReset();
            break;
        case "cancel":
            break;
    }
});

// Download and upload:
Evnt.onAll("span.download", "click", Download.clickDownload);
Evnt.onAll("span.upload", "click", Download.clickUpload);

FootballMenu.init("ul.menu");
//FootballMenu.test();

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
Each.all("#club-players tbody tr").do((el) => {
    Elem.sel(el, ".player-name").value = players[i];
    Elem.sel(el, ".player-number").value = ++i;
});

// Vyvolání události, aby se hráči zpropagovali do zápasové sestavy:
Evnt.trigger("#club-players input", "change");

// Mock: Hráč Nádeník ke dnešnímu zápasu nenastupuje:
(new Elem(document.querySelectorAll('#our-players input[name="player-number"]')[8].closest("tr"))).qs('input[name="player-on"]').checked = false;

// Mock naplnění hráčů soupeře:
for (var i = 1; i <= 10; i++) {
    Evnt.trigger("#partner-players tfoot .add", "click");
}
var i = 1;
Each.all("#partner-players tbody tr").do((el) => {
    Elem.sel(el, ".player-number").value = i;
    Elem.sel(el, ".player-name").value = `Protihráč ${i}`;
    i++;
});

// Vypíšeme názvy týmů, rozhodčí, vytvoříme seznamy hráčů, místo a čas hry:
Events.setCanvasTitle();
Events.setReferee();
Events.createPlayerLists();
Events.setMatchTimespace();

// Vložení buttonů pro stažení obrázků:
let button = (new Elem("#template-make-image")).clone(true).attrRemove("id");
//button.appendTo("#canvas");
button.clone(true).appendTo("#block-flyers-lineup div.result");
button.clone(true).appendTo("#block-flyers-1st-half div.result");
button.clone(true).appendTo("#block-flyers-2nd-half div.result");
button.clone(true).appendTo("#block-flyers-extended div.result");
//button.appendTo("#block-flyers-penalties div.result");

// Stáhnout obrázek:
Evnt.onAll("div.result div.make-image", "click", Events.clickImageDownloadButton);