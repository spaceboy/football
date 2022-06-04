class Events {

    static eventId = 1;

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

    static clickPlayerMoveUp (e) {
        var t = e.currentTarget.closest("tr");
        var p = t.previousElementSibling;
        if (p) {
            (new Elem(t)).swapWithNode(p);
        }
    }

    static clickPlayerMoveDown (e) {
        var t = e.currentTarget.closest("tr");
        var n = t.nextElementSibling;
        if (n) {
            (new Elem(t)).swapWithNode(n);
        }
    }

    // Vloží řádek do formuláře hráčů:
    static clickPlayerAdd (e) {
        var r = document.getElementById(e.currentTarget.getAttribute("data-template")).cloneNode(true);
        r.removeAttribute("id");
        e.currentTarget.closest("table").querySelector("tbody").appendChild(r);
        Evnt.on(r.querySelector(".remove"), "click", Events.clickPlayerRemove);
        Evnt.on(r.querySelector(".move-up"), "click", Events.clickPlayerMoveUp);
        Evnt.on(r.querySelector(".move-down"), "click", Events.clickPlayerMoveDown);
        // Hlídej změny:
        Evnt.onAll(r.querySelectorAll("input"), "change", (e) => {
            var tbd = e.currentTarget.closest("table > tbody");
            var players = {};

            var target = document.querySelector("#our-players tbody");
            // Uložíme
            // Vytvoříme nový seznam:
            target.innerHTML = "";
            for (var row of tbd.querySelectorAll("tr")) {
                var tr = new Elem(document.getElementById("template-our-players")).clone(true).attrRemove("id").get();
                tr.querySelector("input.player-number").value = row.querySelector("input.player-number").value;
                tr.querySelector("input.player-name").value = row.querySelector("input.player-name").value;
                (new Elem(tr)).appendTo(target);
            }
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

    // Formulář událostí -- manipulace input[name="time"]:
    static #changeEventFormTime (val) {
        if (!val.match(/[0-9]+(\+[0-9]+)?$/)) {
            val = parseInt(val).toString();
        }
        var s = val.split("+");
        if (s.length === 2) {
            switch (s[0]) {
                case "45":
                case "90":
                case "120":
                    break;
                default:
                    val = s[0];
            }
        }
        return val;
    }

    // List událostí -- up:
    static #clickedEventListUp (e) {
        e.stopPropagation();
        var t = e.currentTarget.closest("tr");
        if (t.previousElementSibling) {
            Elem.swapNodes(t, t.previousElementSibling);
            // TODO: vyvolat změnu v zobrazení náhledů
        }
    }

    // List událostí -- down:
    static #clickedEventListDown (e) {
        e.stopPropagation();
        var t = e.currentTarget.closest("tr");
        if (t.nextElementSibling) {
            Elem.swapNodes(t, t.nextElementSibling);
            // TODO: vyvolat změnu v zobrazení náhledů
        }
    }

    // List událostí -- remove:
    static #clickedEventListRemove (e) {
        e.stopPropagation();
        Elem.removeElement(e.currentTarget.closest("tr"));
        // TODO: vyvolat změnu v zobrazení náhledů
    }

    // List událostí -- edit:
    static #clickedEventListEdit (e) {
        e.stopPropagation();
        var t = e.currentTarget;
        var f = document.querySelector('form[name="events"]');
        f.elements["team"].value = t.getAttribute("data-team");
        f.elements["time"].value = t.getAttribute("data-time");
        f.elements["type"].value = t.getAttribute("data-type");
        f.elements["player1"].value = t.getAttribute("data-player1");
        f.elements["player2"].value = t.getAttribute("data-player2");
        f.elements["comment"].value = t.getAttribute("data-comment");
        f.elements["edit"].value = t.getAttribute("data-edit");
        (new Elem(f)).addClass("edit-mode");
    }

    // Změna na formuláři událostí:
    static changeEventForm (e) {
        switch (e.target.getAttribute("name")) {
            case "time":
                // Změna času:
                e.target.value = Events.#changeEventFormTime(e.target.value.replace(/\s+/g, ""));
                return;
                break;
            case "type":
                // Změna typu události (gól, ŽK, 2.ŽK...):
                var t = e.target;
                var f = t.closest("form");
                var o = t.querySelector(`option[value="${t.value}"]`);

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
            default:
                // Změna jiná:
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
        }
    }

    // Vytvoří nový řádek pracovního seznamu událostí:
    static #appendEventListItem (data) {
        var el = (new Elem(document.getElementById("template-event-work")))
            .clone(true)
            .attrRemove("id")
            .class(data["team"]);
        Evnt.on(el.qs(".ico-up"), "click", Events.#clickedEventListUp);
        Evnt.on(el.qs(".ico-down"), "click", Events.#clickedEventListDown);
        Evnt.on(el.qs(".ico-remove"), "click", Events.#clickedEventListRemove);
        Evnt.on(el.get(), "click", Events.#clickedEventListEdit);
        el.appendTo(document.querySelector("#event-line tbody"));
        return el;
    }

    static #eventLineShow (data) {
        var row = (new Elem(document.getElementById("template-event-show")))
            .clone(true)
            .attrRemove("id");
            //.attr("data-edit", data["edit"]);
        row.qs(".time").innerText = data["time"];
        var div = new Elem(row.qs(`.${data["team"]}`));
        div.qs(".comment").innerText = data["comment"];
        var ico = div.qs(".ico");
        ico.innerHTML = (new Elem(document.getElementById(`template-event-ico-${data["type"]}`))).html();
        (new Elem(ico)).addClass(data["type"]);
        row.appendTo(document.querySelector("#block-result-1st-half .events"));
    }

    static #eventLinesCopy () {
        document.querySelector("#block-result-1st-half .events").innerHTML = "";
        for (var t of document.querySelectorAll("#event-line tbody tr")) {
            Events.#eventLineShow({
                "team": t.getAttribute("data-team"),
                "time": t.getAttribute("data-time"),
                "type": t.getAttribute("data-type"),
                "player1": t.getAttribute("data-player1"),
                "player2": t.getAttribute("data-player2"),
                "comment": t.getAttribute("data-comment"),
                "edit": t.getAttribute("data-edit")
            });
        }
    }

    // Vymazání formuláře událostí:
    static eventFormClear () {
        let form = document.querySelector('form[name="events"]');
        for (var el of form.querySelectorAll('input:not([type="button"]):not([type="submit"]):not([type="radio"]), select')) {
            el.value = "";
        }
        (new Elem(form)).removeClass("edit-mode");
    }

    // Odeslání formuláře událostí:
    static submitEventForm (e) {
        e.preventDefault();
        var form = e.currentTarget.closest("form");
        var data = {};
        var valid = true;
        for (var el of form.querySelectorAll('select:not([disabled]), input:not([name="submit"]):not([type="hidden"]):not([type="radio"])')) {
            var element = new Elem(el);
            if (!el.value) {
                element.addClass("form-error");
                valid = false;
            } else {
                element.removeClass("form-error");
                data[el.name] = el.value;
            }
        }
        if (!valid) {
            return;
        }
        data["team"] = form.elements["team"].value;
        if (form.elements["edit"].value) {
            data["edit"] = form.elements["edit"].value;
        }

        // Vyčistíme formulář:
        Events.eventFormClear();

        // Vložíme/editujeme řádek do pracovního seznamu událostí:
        var row = (
            data.hasOwnProperty("edit")
            ? new Elem(document.querySelector(`#event-line tbody tr[data-edit="${data["edit"]}"]`))
            : Events.#appendEventListItem(data)
        );
        row.qs(".ico").setAttribute("class", "ico " + data["type"]);
        row.qs(".time").innerText = data["time"];
        row.qs(".comment").innerText = data["comment"];
        row.attr({
            "data-team": data["team"],
            "data-time": data["time"],
            "data-type": data["type"],
            "data-player1": data["player1"],
            "data-player2": (data["player2"] === undefined ? "" : data["player2"]),
            "data-comment": data["comment"],
            "data-edit": (data.hasOwnProperty("edit") ? data["edit"] : Events.eventId++)
        })
        .class(data["team"]);

        // Vložíme řádek na zobrazovací plochu:
        Events.#eventLinesCopy();
    }

}
