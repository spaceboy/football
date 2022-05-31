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

// Přidáme jméno brankáře:
Evnt.trigger("#players-gol tfoot .add", "click");

// Nastavíme základní sestavu:
Evnt.trigger("#positions-preset", "change");

// Ovládání výběru hráče do rozestavení:
Evnt.on("#player-name-select .close", "click", (e) => {
    document.getElementById("player-name-select").style.display = "none";
});
Evnt.on("#player-name-select select", "change", (e) => {
    var n = e.currentTarget.value.split(":");
    selectedPlayer.querySelector(".number").innerText = n.shift();
    selectedPlayer.querySelector("figcaption").innerText = n.join(":");
    document.getElementById("player-name-select").style.display = "none";
});

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

function setCanvasTitle () {
    let teamWe = document.getElementById("club-info-name").value;
    let teamThem = document.getElementById("match-info-partner").value;
    document.getElementById("canvas-title").innerHTML = (
        document.getElementById("match-info-home").value === "home"
        ? `<span class="home bold">${teamWe}</span> vs. <span class="away">${teamThem}</span>`
        : `<span class="home">${teamThem}</span> vs. <span class="away bold">${teamWe}</span>`
    );
}

function setReferee () {
    var ref = [];
    if (document.getElementById("match-info-referee").value) {
        ref.push(`<b>${document.getElementById("match-info-referee").value} (hlavní)</b>`);
    }
    for (var i = 0; i <= 2; i++) {
        let v = document.getElementById(["match-info-referee2", "match-info-referee3", "match-info-referee4"][i]).value;
        if (v) {
            ref.push(v);
        }
    }
    if (document.getElementById("match-info-var").value) {
        ref.push(`${document.getElementById("match-info-var").value} (VAR)`);
    }
    document.querySelector("#info-referees ul").innerHTML = "<li>" + ref.join("</li><li>") + "</li>";
    for (var el of document.querySelectorAll("#block-result .events-referee")) {
        el.innerHTML = "<p><b>Rozhodči:</b> " + ref.join(", ") + "</p>";
    }
}

Evnt.onAll("form input, form, select", "change", (e) => {
    let t = e.currentTarget;
    let val = t.value;
    switch (t.id) {
        case "club-info-name":
            setCanvasTitle();
            document.querySelector("#lineup-match-club h3").innerText = `Soupiska ${val}`;
            break;
        case "match-info-home":
            setCanvasTitle();
            break;
        case "match-info-partner":
            setCanvasTitle();
            document.querySelector("#lineup-match-partner h3").innerText = `Soupiska ${val}`;
            break;
        case "match-info-referee":
        case "match-info-referee2":
        case "match-info-referee3":
        case "match-info-referee4":
        case "match-info-var":
        case "match-info-delegate":
            setReferee();

    }
})

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



Evnt.on("form[name=\"events\"] select[name=\"type\"]", "change", (e) => {
    var t = e.currentTarget;
    var f = t.closest("form");
    var o = t.querySelector(`option[value="${t.value}"]`)

    // Vypnout/zapnout hráče:
    var p = (o.hasAttribute("data-players") ? parseInt(o.getAttribute("data-players")) : 1);
    var i = 0;
    for (el of document.querySelectorAll("form[name=\"events\"] select.events-player")) {
        if (++i <= p) {
            el.disabled = false;
        } else {
            el.disabled = true;
            el.value = "";
        }
    }

    // Vypnout/zapnout textový komentář:
    var c = f.querySelector("input[name=\"comment\"]");
    if (o.hasAttribute("data-comment")) {
        c.disabled = false;
    } else {
        c.disabled = true;
        c.value = "";
    }
});
Evnt.on("form[name=\"events\"]", "change", (e) => {
    var f = e.currentTarget.closest("form");
    var comment = "";
    switch (f.querySelector("select[name=\"type\"]").value) {
        case "goal":
            comment = f.querySelector("select[name=\"player1\"]").value;
            break;
        case "substitution":
            comment = `${f.querySelector("select[name=\"player1\"]").value} (${f.querySelector("select[name=\"player2\"]").value})`;
            break;
        case "card-yellow-1st":
            comment = f.querySelector("select[name=\"player1\"]").value;
            break;
        case "card-yellow-2nd":
            comment = f.querySelector("select[name=\"player1\"]").value;
            break;
        case "card-red":
            comment = f.querySelector("select[name=\"player1\"]").value;
            break;
        case "penalty-succ":
            comment = `${f.querySelector("select[name=\"player1\"]").value} (P)`;
            break;
        case "penalty-uns":
            comment = f.querySelector("select[name=\"player1\"]").value;
            break;
        case "other":
            comment = f.querySelector("input[name=\"comment\"]").value.trim();
            break;
    }
    f.querySelector("input[name=\"comment\"]").value = comment;
});
// Vyhodnocení formuláře událostí:
Evnt.on("form[name=\"events\"] input[name=\"submit\"]", "click", (e) => {
    e.preventDefault();
    var form = e.currentTarget.closest("form");
    var data = {};
    for (var el of form.querySelectorAll("select:not([disabled]), input:not([name=\"submit\"])")) {
        if (!el.value) {
            return;
        }
        data[el.name] = el.value;
    }
    data["team"] = form.querySelector("input[name=\"team\"]:checked").value;

    console.log(data);
    // Vložíme řádek do pracovního seznamu událostí:
    var row = (new Elem(document.getElementById("template-event-work")))
        .clone(true)
        .attrRemove("id")
        .class(data["team"]);
    row.qs(".ico").setAttribute("class", "ico " + data["type"]);
    row.qs(".time").innerText = data["time"] + '"';
    row.qs(".comment").innerText = data["comment"];
    row.appendTo(document.querySelector("#event-line tbody"));

    //console.log(form.querySelector("input[name=\"events-team\"]:checked").value);
})
// Validace:
Evnt.on("form[name=\"events\"] input[name=\"time\"]", "change", (e) => {
    var val = e.currentTarget.value.replace(/\s+/g, "");
    if (!val.match(/[0-9]+(\+[0-9]+)?$/)) {
        val = parseInt(val);
    }
    e.currentTarget.value = val;
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

// Mock naplnění vlastních hráčů:
for (var i = 1; i <= 10; i++) {
    Evnt.trigger("#club-players tfoot .add", "click");
}
var i = 1;
for (var el of document.querySelectorAll("#club-players tbody tr")) {
    el.querySelector(".player-number").value = i;
    el.querySelector(".player-name").value = `Hráč ${i}`;
    i++;
}
// Vyvolání události, aby se hráči zpropagovali do zápasové sestavy:
Evnt.trigger("#club-players input", "change");

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

Trenér (manažer):
Bohumír Zenkl
*/