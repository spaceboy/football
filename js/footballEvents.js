class Events {

    // Změna barev dresu (obecná, pro všechny):
    static jerseyChange (e, jersey) {
        var t = e.target;
        switch (t.getAttribute("name")) {
            case "shirtType":
                jersey.setShirtType(t.value);
                break;
            case "colorShirt1":
                jersey.setColorShirt1(t.value);
                break;
            case "colorShirt2":
                jersey.setColorShirt2(t.value);
                break;
            case "colorShorts":
                jersey.setColorShorts(t.value);
                break;
            case "colorBody":
                jersey.setColorBody(t.value);
                break;
        }
        document.querySelector(t.closest("form").getAttribute("data-query")).style.backgroundImage = jersey.getStyle();
        Events.copyJerseyColors();
    }

    // Vyber jméno a číslo hráče:
    static clickPlayer (e) {
        selectedPlayer = e.currentTarget;
        document.getElementById("player-name-select").style.display = "block";
    }

    // Posune hráče v rozestavení vpřed/vzad/na střed:
    static clickPlayerPosition (e) {
        e.stopPropagation();
        var t = e.currentTarget.closest("figure").querySelector("div");
        switch (t.style.alignSelf) {
            case "flex-start":
                t.style.alignSelf = "flex-end";
                break;
            case "center":
                t.style.alignSelf = "flex-start";
                break;
            case "flex-end":
            default:
                t.style.alignSelf = "center";
                break;
        }
    }

    // Odstraní řádek z formuláře hráčů:
    static clickPlayerRemove (e) {
        var r = e.currentTarget.closest("tr");
        r.parentNode.removeChild(r);
    }

    // Vloží řádek do formuláře hráčů:
    static clickPlayerAdd (e) {
        var r = document.getElementById("template-lineup-name").cloneNode(true);
        r.removeAttribute("id");
        e.currentTarget.closest("table").querySelector("tbody").appendChild(r);
        Evnt.on(r.querySelector(".remove"), "click", Events.clickPlayerRemove);
        // Hlídej změny:
        Evnt.onAll(r.querySelectorAll("input"), "change", (e) => {
            var tbd = e.currentTarget.closest("table > tbody");
            var players = {};
            var pnl = document.getElementById("player-name-list");
            pnl.innerHTML = "";
            var opt = (new Elem("option"))
                .attr("value", "")
                .text("---")
                .appendTo(pnl);
            for (var row of tbd.querySelectorAll("tr")) {
                //console.log(row.querySelector("input.player-number"));
                //console.log(row.querySelector("input.player-name"));
                var opt = (new Elem("option"))
                    .attr("value", `${row.querySelector("input.player-number").value}:${row.querySelector("input.player-name").value}`)
                    .text(`${row.querySelector("input.player-number").value}: ${row.querySelector("input.player-name").value}`)
                    .appendTo(pnl);

                players[row.querySelector("input.player-number").value] = row.querySelector("input.player-name").value;
            }
            console.log(players);
            /*
            var cls = e.currentTarget.getAttribute("class");
            if (cls) {
                for (var el of tbl.querySelectorAll(`input[class="${cls}"]`)) {
                    console.log(el.value);
                }
            }
            console.log(tbl);
            if (r.closest("#club-players")) {
            }
            */
        });
    }

    // Změna rozestavaní: standardy
    static changePositionsPreset (e) {
        var l = e.currentTarget.value.split(":");
        if (l.length !== 3) {
            return;
        }
        var line = [
            document.getElementById("positions-def"),
            document.getElementById("positions-mid"),
            document.getElementById("positions-str")
        ];
        for (var i = 0; i < 3; ++i) {
            /*
            if (line[i].value == l[i]) {
                continue;
            }
            */
            line[i].value = l[i];
            Evnt.trigger(line[i], "change");
        }
    }

    // Změna rozestavení: v řadě
    static createChildElements (count, targetEl, onAdd, onRemove) {
        var diff = count - targetEl.childElementCount;
        while (diff !== 0) {
            switch (true) {
                case (diff > 0):
                    // Přidáme element:
                    if (onAdd) {
                        onAdd(targetEl);
                    }
                    --diff;
                    break;
                case (diff < 0):
                    // Odebereme element:
                    if (onRemove) {
                        onRemove(targetEl);
                    }
                    ++diff;
                    break;
            }
        }
    }

    // Přidání formulářových polí pro hráčovo číslo a jméno:
    static addPlayerForm () {
        var el = document.getElementById("template-lineup-name").cloneNode(true);
        el.removeAttribute("id");
        el.removeAttribute("style");
        document.getElementById("club-players").appendChild(el);
        /*
        Evnt.onAll(el.querySelectorAll("input"), "change", (e) => {
            console.log(e.currentTarget.value);
        });
        */
    }

    // Přidání figurky hráče do pole:
    static addPlayerFigure (targetEl) {
        var el = document.getElementById("template-position-player").cloneNode(true);
        el.removeAttribute("id");
        //el.setAttribute("class", "player new");
        el.removeAttribute("style");
        targetEl.appendChild(el);
        Evnt.on(el, "click", Events.clickPlayer);
        Evnt.on(el.querySelector(".position"), "click", Events.clickPlayerPosition);
    }

    // Odstranění posledního dítěte:
    static removeLastChild (parentEl) {
        var el = parentEl.lastElementChild;
        el.parentNode.removeChild(el);
    }

    // Změna počtu hráčů v řadě:
    static changePositionLine (count, line) {
        var t = document.getElementById("lineup").querySelector(line);

        // Nastavíme počet hráčů v řadě v poli rozestavení:
        Events.createChildElements(
            count,
            document.getElementById("lineup").querySelector(line),
            Events.addPlayerFigure,
            Events.removeLastChild
        );

        // Spočítáme, zda jich je 11:
        Events.checkLineCounts();
    }
    static changePositionsDef (e) {
        Events.changePositionLine(e.currentTarget.value, ".line-def");
    }
    static changePositionsMid (e) {
        Events.changePositionLine(e.currentTarget.value, ".line-mid");
    }
    static changePositionsStr (e) {
        Events.changePositionLine(e.currentTarget.value, ".line-str");
    }
    static checkLineCounts () {
        var c = 0;
        var p = [];
        for (var el of document.querySelectorAll("#lineup > div.line")) {
            var n = parseInt(el.childElementCount);
            c += n;
            p.push(n);
        }
        document.getElementById("lineup").setAttribute("class", (c === 11 ? "" : "error"));
        var pp = document.getElementById("positions-preset");
        if (c !== 11) {
            pp.value = "";
            return false;
        }
        p.shift();
        var pr = p.join(":");
        if (pp.querySelector(`[value='${pr}']`)) {
            pp.value = pr;
        }
        return true;
    }

    // Změna rozestavení - šířka:
    static changeHorizontalDef (e) {
        document.querySelector("#lineup div.line-def").style.justifyContent = e.currentTarget.value;
    }
    static changeHorizontalMid (e) {
        document.querySelector("#lineup div.line-mid").style.justifyContent = e.currentTarget.value;
    }
    static changeHorizontalStr (e) {
        document.querySelector("#lineup div.line-str").style.justifyContent = e.currentTarget.value;
    }

    // Zkopíruj rozložení barev do sestavy:
    static copyJerseyColors () {
        document.getElementById("style-jersey").textContent =
            "#lineup .player .jersey i {background-image: " + document.querySelector("#player-field .jersey i").style.backgroundImage + ";} " +
            "#lineup .line-gol .player .jersey i {background-image: " + document.querySelector("#player-goalie .jersey i").style.backgroundImage + ";}";
    }

}
