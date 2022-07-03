class Events {

    static eventId = 1;

    static optionListHome = "";

    static optionListAway = "";

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
        Elem.byId("player-name-select").style.display = "block";
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

    // Nastaví nadpisy informací o zápasu:
    static setCanvasTitle () {
        let teamWe = Elem.valueById("club-info-name");
        let teamThem = Elem.valueById("match-info-partner");
        let home = Elem.valueById("match-info-home");
        Elem.byId("canvas-title").innerHTML = (
            home === "home"
            ? `<span class="home bold">${teamWe}</span> vs. <span class="away">${teamThem}</span>`
            : `<span class="home">${teamThem}</span> vs. <span class="away bold">${teamWe}</span>`
        );
        Each.all(".result .club-name").do((el) => el.innerHTML = (home === "home" ? teamWe : teamThem));
        Each.all(".result .partner-name").do((el) => el.innerHTML = (home === "home" ? teamThem : teamWe));
    }

    // Nastaví rozhodčí:
    static setReferee () {
        var ref = [];
        if (Elem.valueById("match-info-referee")) {
            ref.push(`<b>${Elem.valueById("match-info-referee")} (hlavní)</b>`);
        }
        for (var i = 0; i <= 2; i++) {
            let v = Elem.valueById(["match-info-referee2", "match-info-referee3", "match-info-referee4"][i]);
            if (v) {
                ref.push(v);
            }
        }
        if (Elem.valueById("match-info-var")) {
            ref.push(`${Elem.valueById("match-info-var")} (VAR)`);
        }
        document.querySelector("#info-referees ul").innerHTML = "<li>" + ref.join("</li><li>") + "</li>";
        Each.all("#block-result .events-referee").do((el) => el.innerHTML = "<p><b>Rozhodčí:</b> " + ref.join(", ") + "</p>");
    }

    // Nastaví čas a místo zápasu:
    static setMatchTimespace () {
        let place = Elem.valueById("match-info-place");
        let timeDay = Elem.valueById("match-info-day");
        let timeTime = Elem.valueById("match-info-time");

        // Nastavení místa a času v plakátu rozestavení:
        let lineup = new Elem("#info-place-time");
        lineup.qsElem("ul li.day").text(timeDay);
        lineup.qsElem("ul li.time").text(timeTime);
        lineup.qsElem("ul li.place").text(place);

        // Nastavení místa a času v letácích:
        Each.all("div.result div.match-info div.day .info").do((el) => el.innerText = timeDay);
        Each.all("div.result div.match-info div.time .info").do((el) => el.innerText = timeTime);
        Each.all("div.result div.match-info div.place .info").do((el) => el.innerText = place);
    }

    static createPlayerLists () {
        // Vlastní tým:
        let target = document.querySelector("#block-result-lineup .lineup .lineup-base .lineup-list");
        target.innerHTML = "";
        let subs = document.querySelector("#info-substituties ul");
        subs.innerHTML = "";
        var opts = ['<option value="">-- Vyberte hráče --</option>'];
        var plrs = ['<option value="">-- Vyberte hráče --</option>'];
        for (var el of document.querySelectorAll("#our-players tbody tr")) {
            if (!el.querySelector('input[name="player-on"]').checked) {
                continue;
            }
            var name = el.querySelector('input[name="player-name"]').value;
            var numb = el.querySelector('input[name="player-number"]').value;
            opts.push(`<option value="${name}">${numb}: ${name}</option>`);
            plrs.push(`<option value="${numb}:${name}">${numb}: ${name}</option>`);
            // Vložíme hráče na zobrazení soupisky:
            (Elem.create("p"))
                .html(`<span class="number">${numb}</span><span class="name">${name}</span>`)
                .appendTo(target);
            // Vložíme hráče do seznamu náhradníků na rozestavení:
            (Elem.create("li"))
                .attr("data-number", numb)
                .text(name)
                .appendTo(subs);
        }
        if (Elem.valueById("match-info-home") === "home") {
            Events.optionListHome = opts.join("");
        } else {
            Events.optionListAway = opts.join("");
        }
        Elem.byId("player-name-list").innerHTML = plrs.join("");

        // Partnerský tým:
        var opts = ['<option value="">-- Vyberte hráče --</option>'];
        Each.all("#partner-players tbody tr").do((el) => {
            var name = el.querySelector('input[name="player-name"]').value;
            var numb = el.querySelector('input[name="player-number"]').value;
            opts.push(`<option value="${name}">${numb} ${name}</option>`);
        });
        if (Elem.valueById("match-info-home") === "home") {
            Events.optionListAway = opts.join("");
        } else {
            Events.optionListHome = opts.join("");
        }

        // Zpropagujeme seznamy hráčů na potřebná místa:
        Events.#propagatePlayersLists();
    }

    // Vloží do sestavy (nebo k náhradníkům) seznam hráčů:
    static #resultLineupShow(parent, list) {
        parent.html("");
        for (var i = 0, l = list.length; i <= l; i++) {
            if (!list[i]) {
                continue;
            }
            (Elem.create("p"))
                .html(`<span class="number">${i}</span><span class="name">${list[i]}</span>`)
                .appendTo(parent);
        }
    }

    // Vloží do sestavy seznam hráčů:
    static resultLineupBaseShow (list) {
        Events.#resultLineupShow(new Elem("#block-result-lineup .lineup-base .lineup-list"), list);
    }

    // Vloží k náhradníkům seznam hráčů:
    static resultLineupSubstitutesShow (list) {
        Events.#resultLineupShow(new Elem("#block-result-lineup .lineup-substitute .lineup-list"), list);
    }

    /*
    // Přehodí na malém displeji sestavy hráče mezi náhradníky a vice versa:
    static clickPlayerLineup (e) {
        let p = (e.target.tagName === "P" ? e.target : e.target.closest("p"));
        if (!p) {
            return;
        }
        if ((new Elem(p.closest("div.lineup-wrap"))).hasClass("lineup-base")) {
            (new Elem(p)).appendTo((new Elem(p.closest("div.lineup"))).qs("div.lineup-substitute div.lineup-list"));
        } else {
            (new Elem(p)).appendTo((new Elem(p.closest("div.lineup"))).qs("div.lineup-base div.lineup-list"));
        }
    }
    */

    // Obslouží změny formuláře informací o zápasu:
    static changeMatchInfoForm (e) {
        let t = e.target;
        let val = t.value;
        switch (t.id) {
            case "club-info-name":
                EventssetCanvasTitle();
                document.querySelector("#lineup-match-club h3").innerText = `Soupiska ${val}`;
                break;
            case "match-info-home":
                Events.setCanvasTitle();
                Events.createPlayerLists();
                Evnt.trigger(
                    'form[name="event-editor"] input[name="team"]',
                    new Event("change", {"bubbles": true})
                );
                break;
            case "match-info-partner":
                Events.setCanvasTitle();
                document.querySelector("#lineup-match-partner h3").innerText = `Soupiska ${val}`;
                break;
            case "match-info-day":
            case "match-info-place":
            case "match-info-time":
                Events.setMatchTimespace();
                break;
            case "match-info-referee":
            case "match-info-referee2":
            case "match-info-referee3":
            case "match-info-referee4":
            case "match-info-var":
            case "match-info-delegate":
                Events.setReferee();
            default:
                switch (t.name) {
                    case "player-on":
                    case "player-name":
                    case "player-number":
                        Events.createPlayerLists()
                        break;
                }
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
        var t = e.currentTarget.closest("table");

        // Vytvoř element:
        var r = (new Elem(Elem.byId(e.currentTarget.getAttribute("data-template"))))
            .clone(true)
            .attrRemove("id")
            .appendTo(t.querySelector("tbody"));
        r.qs("input.player-number").focus();

        // Hlídej změny:
        Evnt.on(r.qs(".remove"), "click", Events.clickPlayerRemove);
        Evnt.on(r.qs(".move-up"), "click", Events.clickPlayerMoveUp);
        Evnt.on(r.qs(".move-down"), "click", Events.clickPlayerMoveDown);
        if (t.hasAttribute("data-target")) {
            Evnt.onAll(r.qsAll("input"), "change", (e) => {
                // Zkopírujeme seznam hráčů:
                var tbd = e.currentTarget.closest("table > tbody");
                var target = document.querySelector(t.getAttribute("data-target"));
                target.innerHTML = "";
                Each.all(tbd, "tr").do((row) => {
                    var tr = (new Elem("#template-our-players"))
                        .clone(true)
                        .attrRemove("id");
                    tr.qs("input.player-number").value = row.querySelector("input.player-number").value;
                    tr.qs("input.player-name").value = row.querySelector("input.player-name").value;
                    tr.appendTo(target);
                });
                Events.createPlayerLists();
            });
        }
    }

    // Změna rozestavaní: standardy
    static changePositionsPreset (e) {
        var l = e.currentTarget.value.split(":");
        if (l.length !== 3) {
            return;
        }
        var line = [
            Elem.byId("positions-def"),
            Elem.byId("positions-mid"),
            Elem.byId("positions-str")
        ];
        for (var i = 0; i < 3; ++i) {
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
                        Events.propagatePlayersToLineup();
                    }
                    ++diff;
                    break;
            }
        }
    }

    // Přidání formulářových polí pro hráčovo číslo a jméno:
    static addPlayerForm () {
        var el = Elem.byId("template-lineup-name").cloneNode(true);
        el.removeAttribute("id");
        el.removeAttribute("style");
        Elem.byId("club-players").appendChild(el);
        /*
        Evnt.onAll(el.querySelectorAll("input"), "change", (e) => {
            console.log(e.currentTarget.value);
        });
        */
    }

    // Přidání figurky hráče do pole:
    static addPlayerFigure (targetEl) {
        var el = (new Elem("#template-position-player"))
            .clone(true)
            .attrRemove("id")
            .attrRemove("style")
            .appendTo(targetEl);
        Evnt.on(el.get(), "click", Events.clickPlayer);
        Evnt.on(el.qs(".position"), "click", Events.clickPlayerPosition);
    }

    // Odstranění posledního dítěte:
    static removeLastChild (parentEl) {
        var el = parentEl.lastElementChild;
        Events.#removePlayerFromLineup(el);
        el.parentNode.removeChild(el);
    }

    // Změna počtu hráčů v řadě:
    static changePositionLine (count, line) {
        var t = Elem.byId("lineup").querySelector(line);

        // Nastavíme počet hráčů v řadě v poli rozestavení:
        Events.createChildElements(
            count,
            Elem.byId("lineup").querySelector(line),
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
        Each.all("#lineup > div.line").do((el) => {
            var n = parseInt(el.childElementCount);
            c += n;
            p.push(n);
        });
        Elem.byId("lineup").setAttribute("class", (c === 11 ? "" : "error"));
        var pp = Elem.byId("positions-preset");
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

    // Odstranení jména hráče ze sestavy:
    static #removePlayerNameFromLineup (number, name) {
        Elem.create("li")
            .attr("data-number", number)
            .html(name)
            .appendTo("#info-substituties ul");
        Elem.create("option")
            .attr("value", `${number}:${name}`)
            .html(`${number}: ${name}`)
            .appendTo("#player-name-list");
    }

    // Odstranění figury hráče ze sestavy:
    static #removePlayerFromLineup (el) {
        if (el.hasAttribute("data-player") && el.getAttribute("data-player")) {
            var n = el.getAttribute("data-player").split(":");
            Events.#removePlayerNameFromLineup(n.shift(), n.join(":"));
        }
    }

    // Zpropagujeme hráče do letáku sestavy:
    static propagatePlayersToLineup () {
        var line = [];
        var subs = [];
        // V sestavě:
        Each.all("#lineup figure.player").do(el => {
            if (!el.hasAttribute("data-player")) {
                return;
            }
            var n = el.getAttribute("data-player").split(":");
            line[parseInt(n.shift())] = n.join(":");
        });
        Events.resultLineupBaseShow(line);

        // Náhradníci:
        Each.all("#info-substituties ul li").do((el) => subs[parseInt(el.getAttribute("data-number"))] = el.innerText);
        Events.resultLineupSubstitutesShow(subs);
    }

    // V selektu vybereme jméno hráče v sestavě:
    static changePlayerNameOnLineup (e) {
        var n = e.currentTarget.value.split(":");
        var numb = n.shift();
        var name = n.join(":");

        // Zpropagujeme jméno a číslo na figuru hráče:
        var oldPlayer = selectedPlayer.getAttribute("data-player");
        selectedPlayer.querySelector(".number").innerText = numb;
        selectedPlayer.querySelector("figcaption").innerText = name;
        selectedPlayer.setAttribute("data-player", e.currentTarget.value);

        // Odstraníme hráče ze selektu, select resetujeme, odstraníme hráče ze seznamu náhradníků:
        (new Elem(e.currentTarget)).qsElem(`option[value="${e.currentTarget.value}"]`).remove();
        Elem.byId("player-name-list").value = "";
        (new Elem(`#info-substituties ul li[data-number="${numb}"]`)).remove();

        // Pokud hráče měníme (nedáváme nového), vrátíme původního na seznam náhradníků i seznam hráčů:
        if (oldPlayer) {
            var n = oldPlayer.split(":");
            Events.#removePlayerNameFromLineup(n.shift(), n.join(":"));
        }

        // Skryjeme okno výběru hráče:
        Elem.byId("player-name-select").style.display = "none";

        Events.propagatePlayersToLineup();
    }

    // Zkopíruj rozložení barev do sestavy:
    static copyJerseyColors () {
        Elem.byId("style-jersey").textContent =
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
            Events.#eventLinesCopy();
        }
    }

    // List událostí -- down:
    static #clickedEventListDown (e) {
        e.stopPropagation();
        var t = e.currentTarget.closest("tr");
        if (t.nextElementSibling) {
            Elem.swapNodes(t, t.nextElementSibling);
            Events.#eventLinesCopy();
        }
    }

    // List událostí -- remove:
    static #clickedEventListRemove (e) {
        e.stopPropagation();
        Elem.removeElement(e.currentTarget.closest("tr"));
        Events.#eventLinesCopy();
    }

    // Zobrazí ve formuláři událostí seznamy aktuálních hráčů:
    static #propagatePlayersLists () {
        switch(Elem.sel('form[name="event-editor"]').elements["team"].value) {
            case "home":
                Elem.byId("events-player1").innerHTML = Events.optionListHome;
                Elem.byId("events-player2").innerHTML = Events.optionListHome;
                break;
            case "away":
                Elem.byId("events-player1").innerHTML = Events.optionListAway;
                Elem.byId("events-player2").innerHTML = Events.optionListAway;
            break;
        }
    }

    // List událostí -- edit:
    static #clickedEventListEdit (e) {
        e.stopPropagation();
        var t = e.currentTarget;
        var f = Elem.sel('form[name="event-editor"]');
        (new Elem(f)).addClass("edit-mode");
        f.elements["team"].value = t.getAttribute("data-team");
        Events.#propagatePlayersLists();
        f.elements["time"].value = t.getAttribute("data-time");
        f.elements["type"].value = t.getAttribute("data-type");
        f.elements["player1"].value = t.getAttribute("data-player1");
        f.elements["player2"].value = t.getAttribute("data-player2");
        f.elements["comment"].value = t.getAttribute("data-comment");
        f.elements["edit"].value = t.getAttribute("data-edit");
        Evnt.trigger("#events-type", "change", true);
    }

    // Změna na formuláři událostí:
    static changeEventForm (e) {
        switch (e.target.getAttribute("name")) {
            case "time":
                // Změna času:
                e.target.value = Events.#changeEventFormTime(e.target.value.replace(/\s+/g, ""));
                return;
                break;
            case "team":
                Events.#propagatePlayersLists();
                break;
            case "type":
                // Změna typu události (gól, ŽK, 2.ŽK...):
                var t = e.target;
                var f = t.closest("form");
                var o = t.querySelector(`option[value="${t.value}"]`);

                // Vypnout/zapnout hráče:
                var p = (o.hasAttribute("data-players") ? parseInt(o.getAttribute("data-players")) : 1);
                var i = 0;
                Each.all('form[name="event-editor"] select.events-player').do((el) => {
                    if (++i <= p) {
                        el.disabled = false;
                    } else {
                        el.disabled = true;
                        el.value = "";
                    }
                });

                // Vypnout/zapnout textový komentář:
                var c = f.querySelector('input[name="comment"]');
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
                switch (Elem.sel(f, 'select[name="type"]').value) {
                    case "goal":
                        comment = Elem.sel(f, 'select[name="player1"]').value;
                        break;
                    case "substitution":
                        comment = `${Elem.sel(f, 'select[name="player1"]').value} (${f.querySelector('select[name="player2"]').value})`;
                        break;
                    case "card-yellow-1st":
                        comment = Elem.sel(f, 'select[name="player1"]').value;
                        break;
                    case "card-yellow-2nd":
                        comment = Elem.sel(f, 'select[name="player1"]').value;
                        break;
                    case "card-red":
                        comment = Elem.sel(f, 'select[name="player1"]').value;
                        break;
                    case "penalty-succ":
                        comment = `${Elem.sel(f, 'select[name="player1"]').value} (P)`;
                        break;
                    case "penalty-uns":
                        comment = Elem.sel(f, 'select[name="player1"]').value;
                        break;
                    case "other":
                        comment = Elem.sel(f, 'input[name="comment"]').value.trim();
                        break;
                }
                Elem.sel(f, 'input[name="comment"]').value = comment;
        }
    }

    // Vytvoří nový řádek pracovního seznamu událostí:
    static #appendEventListItem (data) {
        var el = (new Elem("#template-event-work"))
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

    static #countScore (target) {
        var score = {
            "home": 0,
            "away": 0
        };
        Each.all(target, ".events .event").do ((el) => {
            if (el.getAttribute("data-type") === "goal" || el.getAttribute("data-type") === "penalty-succ") {
                score[el.getAttribute("data-team")]++;
            }
        });
        target.querySelector(".title .score").innerHTML = `${score["home"]}:${score["away"]}`;
    };

    static #eventLineShow (target, data) {
        var row = (new Elem("#template-event-show"))
            .clone(true)
            .attrRemove("id")
            .attr({
                "data-type": data["type"],
                "data-team": data["team"]
            });
        row.qs(".time").innerText = data["time"];
        var div = new Elem(row.qs(`.${data["team"]}`));
        div.qs(".comment").innerText = data["comment"];
        var ico = div.qs(".ico");
        ico.innerHTML = (new Elem(`#template-event-ico-${data["type"]}`)).html();
        (new Elem(ico)).addClass(data["type"]);
        row.appendTo(target);
    }

    static #eventLinesCopy () {
        let block1st = document.querySelector("#block-result-1st-half .events");
        let block2nd = document.querySelector("#block-result-2nd-half .events");
        let blockExt = document.querySelector("#block-result-extended .events");

        block1st.innerHTML = "";
        block2nd.innerHTML = "";
        blockExt.innerHTML = "";
        Each.all("#event-line tbody tr").do((t) => {
            var data = {
                "team": t.getAttribute("data-team"),
                "time": t.getAttribute("data-time"),
                "type": t.getAttribute("data-type"),
                "player1": t.getAttribute("data-player1"),
                "player2": t.getAttribute("data-player2"),
                "comment": t.getAttribute("data-comment"),
                "edit": t.getAttribute("data-edit")
            };
            var time = parseInt(data["time"].split("+")[0]);
            if (time <= 45) {
                Events.#eventLineShow(block1st, data);
            }
            if (time <= 90) {
                Events.#eventLineShow(block2nd, data);
            }
            Events.#eventLineShow(blockExt, data);
        });

        Events.#countScore(block1st.closest("div.result"));
        Events.#countScore(block2nd.closest("div.result"));
        Events.#countScore(blockExt.closest("div.result"));
    }

    // Vymazání formuláře událostí:
    static eventFormClear () {
        let form = document.querySelector('form[name="event-editor"]');
        Each.all(form, 'input:not([type="button"]):not([type="submit"]):not([type="radio"]), select').do((el) => el.value = "");
        (new Elem(form)).removeClass("edit-mode");
    }

    // Odeslání formuláře událostí:
    static submitEventForm (e) {
        e.preventDefault();
        let form = e.currentTarget.closest("form");
        let data = {};
        let valid = true;
        Each.all(form, 'select:not([disabled]), input:not([name="submit"]):not([type="hidden"]):not([type="radio"])').do((el) => {
            var element = new Elem(el);
            if (!el.value) {
                element.addClass("form-error");
                valid = false;
            } else {
                element.removeClass("form-error");
                data[el.name] = el.value;
            }
        });
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
            ? new Elem(`#event-line tbody tr[data-edit="${data["edit"]}"]`)
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

    // Stažení obrázku.
    static clickImageDownloadButton (e) {
        Splash.show();
        let el = (new Elem(e.currentTarget)).addClass("working");
        domtoimage.toJpeg(
            e.target.closest(".result"),
            {
                quality: 0.95
            }
        )
        .then((dataUrl) => {
            DownloadFile.download("footbal.jpg", dataUrl);
        })
        .catch((error) => {
            alert("ERROR\n" + error);
        })
        .finally(() => {
            el.removeClass("working");
            Splash.hide();
        });
    }

}
