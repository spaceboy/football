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

    // Posune hráče v rozestavení vpřed/vzad/na střed:
    static clickPlayer (e) {
        var t = e.currentTarget.querySelector("div");
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
        el.setAttribute("class", "player new");
        el.removeAttribute("style");
        targetEl.appendChild(el);
        Evnt.on(el, "click", Events.clickPlayer);
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

        // Nastavíme formulářové prvky:
        /*
        Events.createChildElements(
            count,
            document.getElementById("player-names").querySelector(line),
            Events.addPlayerForm
            *//*
            (targetEl) => {
                console.log(targetEl.closest("form"));
                for (var el of targetEl.closest("form").querySelectorAll("tr")) {
                    el.setAttribute("class", "")
                }
                el.setAttribute("class", "")
                //var el = targetEl.lastElementChild;
                //el.parentNode.removeChild(el);
            }
            */
        /*);*/
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
