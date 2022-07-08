class Download {
    static dataDefault = {
        "about": [
            "========================================================================================================================",
            "                                                                                                                        ",
            "  '||''''|                 ||    '||             '||` '||`    .|'''''|                        '||                       ",
            "   ||  .                   ||     ||              ||   ||     || .                             ||      ''               ",
            "   ||''|   .|''|, .|''|, ''||''   ||''|,  '''|.   ||   ||     || |''|| '||''|  '''|.  '||''|,  ||''|,  ||  .|'', (''''  ",
            "   ||      ||  || ||  ||   ||     ||  || .|''||   ||   ||     ||    ||  ||    .|''||   ||  ||  ||  ||  ||  ||     `'')  ",
            "  .||.     `|..|' `|..|'   `|..' .||..|' `|..||. .||. .||.    `|....|' .||.   `|..||.  ||..|' .||  || .||. `|..' `...'  ",
            "                                                                                       ||                               ",
            "                                                                                      .||                               ",
            "                                                                                                                        ",
            "========================================================================================================================",
            " Football Graphics data file                                                       https://spaceboy.github.io/football/ ",
            "                                                                           free to use FOOTBALL infograpshics generator ",
            "========================================================================================================================",
            " Warning: ",
            " This is Football Graphics data file. ",
            " Don't edit it, unless you are sure you know what are you doing. ",
            " Frankly, you have no idea. Admit it. "
        ],
        "application": {
            "name": "Footbal Graphics",
            "version": "0.1",
            "url": "https://spaceboy.github.io/football/",
            "author": "spaceboy",
            "credits": [
                "This site uses:",
                "- DOM to Image (https://github.com/tsayen/dom-to-image)",
                "- Data-uri-to-img-url (http://aminariana.github.io/data-uri-to-img-url/), (https://github.com/aminariana/data-uri-to-img-url)",
                "- Font awesome",
                "- Google fonts",
                "- Text to ASCII art generator (https://patorjk.com/software/taag/)",
                "",
                "Thank you all!"
            ]
        },
        "data": {}
    }

    static data = {};

    static getJson () {
        return JSON.stringify(Download.data, null, 4);
    }

    static getUploader () {
        if (!Download.uploader) {
            Download.uploader = (new UploadFileText("application/json", {})).onLoad(Download.onUpload);
        }
        return Download.uploader;
    }

    // Naplnění informací o klubu:
    static getClubData () {
        let form = Elem.sel('form[name="club-info"]');
        var data = {};
        Each.in(["name", "chairman", "manager"]).do((name) => data[name] = Elem.sel(form, `[name="${name}"]`).value);
        var players = [];
        Each.all("#club-players tbody tr").do((tr) => {
            players.push({
                "number": Elem.sel(tr, 'input[name="player-number"]').value,
                "name": Elem.sel(tr, 'input[name="player-name"]').value
            });
        });
        data["players"] = players;
        Download.data["data"]["club-info"] = data;
    }

    // Naplnění informací o dresech:
    static getJerseyData () {
        Each
            .for(["jersey-field", "jersey-goalie"])
            .do(function (id) {
                var data = {};
                Each.all(Elem.sel(`#${id}`), "input, select").do((el) => {
                    if (el.hasAttribute("data-skip")) {
                        return;
                    }
                    data[el.name] = el.value;
                });
                Download.data["data"][id] = data;
            });
    }

    // Naplnění informací o zápasu:
    static getMatchData () {
        var data = {};
        Each
            .all(Elem.sel('form[name="match-info"]'), "input, select")
            .do((el) => {
                if (el.hasAttribute("data-skip")) {
                    return;
                }
                data[el.name] = el.value;
            });
        data["our-players"] = [];
        Each.all("#our-players tbody tr").do((tr) => {
            data["our-players"].push({
                "player-on": Elem.sel(tr, 'input[name="player-on"]').checked,
                "player-number": Elem.sel(tr, 'input[name="player-number"]').value,
                "player-name": Elem.sel(tr, 'input[name="player-name"]').value
            });
        });
        data["partner-players"] = [];
        Each.all("#partner-players tbody tr").do((tr) => {
            data["partner-players"].push({
                "player-number": Elem.sel(tr, 'input[name="player-number"]').value,
                "player-name": Elem.sel(tr, 'input[name="player-name"]').value
            });
        });
        Download.data["data"]["match-info"] = data;
    }

    // Naplnění informací o rozestavení:
    static getLineupData () {
        // Players in lines:
        var lineup = {};
        Each.for(["line-gol", "line-def", "line-mid", "line-str"]).do((className) => {
            lineup[className] = [];
            Each.all(`#canvas div.${className} figure > div`).do((el) => {
                lineup[className].push({
                    "position": (el.style.alignSelf ?? "center_"),
                    "number": Elem.sel(el, ".number").innerText,
                    "name": Elem.sel(el, "figcaption").innerText
                })
            });
        });
        Download.data["data"]["lineup"] = {
            "lineup": lineup,
        }

        // Date and place info:
        var data = {};
        Each.all("#info-place-time ul li").do((el) => data[el.getAttribute("class")] = el.innerText);
        Download.data["data"]["lineup"]["info-place-time"] = data;

        // Substituties:
        var data = {};
        Each.all("#info-substituties ul li").do((el) => data[el.getAttribute("data-number")] = el.innerText);
        Download.data["data"]["lineup"]["info-substituties"] = data;

        // Referees:
        var data = [];
        Each.all("#info-referees ul li").do((el) => data.push(el.innerHTML));
        Download.data["data"]["lineup"]["info-referees"] = data;

        // Data from form:
        let form = Elem.sel('form[name="formation"]');
        Each.all(form, "select, input").do((el) => {
            Download.data["data"]["lineup"][el.getAttribute("id")] = el.value;
        });
    }

    // Naplnění informací o zápasových událostech:
    static getEventsData () {
        Download.data["data"]["match-events"] = [];
        Each.all("#event-line tbody tr").do(
            (tr) => Download.data["data"]["match-events"].push({
                "team": tr.getAttribute("data-team"),
                "time": tr.getAttribute("data-time"),
                "type": tr.getAttribute("data-type"),
                "player1": tr.getAttribute("data-player1"),
                "player2": tr.getAttribute("data-player2"),
                "comment": tr.getAttribute("data-comment")
            })
        );

        // Penalty shootout:
        Download.data["data"]["penalty-shootout"] = [];
        Each.all("#block-flyers-penalties .events .event").do((row) => {
            Download.data["data"]["penalty-shootout"].push({
                "home-player": Elem.sel(row, ".home .comment").innerText,
                "home-success": Elem.from(row, ".home .ico .ico").hasClass("goal"),
                "away-player": Elem.sel(row, ".away .comment").innerText,
                "away-success": Elem.from(row, ".away .ico .ico").hasClass("goal")
            });
        });
    }

    // Download informací o klubu:
    static downloadClub () {
        Download.data = Download.dataDefault;
        Download.getClubData();
        DownloadFile.downloadText("datafile.club.json", Download.getJson());
    }

    // Download informací o dresech:
    static downloadJersey () {
        Download.data = Download.dataDefault;
        Download.getJerseyData();
        DownloadFile.downloadText("datafile.jersey.json", Download.getJson());
    }

    // Download rozestavení:
    static downloadLineup () {
        Download.data = Download.dataDefault;
        Download.getLineupData();
        DownloadFile.downloadText("datafile.lineup.json", Download.getJson());
    }

    // Download informací o zápasu:
    static downloadMatch () {
        Download.data = Download.dataDefault;
        Download.getMatchData();
        DownloadFile.downloadText("datafile.match.json", Download.getJson());
    }

    // Download informací o zápasových událostech:
    static downloadEvents () {
        Download.data = Download.dataDefault;
        Download.getEventsData();
        DownloadFile.downloadText("datafile.events.json", Download.getJson());
    }

    // Download celkových informací:
    static downloadGlobal () {
        Download.data = Download.dataDefault;
        Download.getClubData();
        Download.getJerseyData();
        Download.getMatchData();
        Download.getLineupData();
        Download.getEventsData();
        DownloadFile.downloadText("datafile.json", Download.getJson());
    }

    // Test required data fields:
    static #checkData (data, required) {
        if (!data.hasOwnProperty("data")) {
            alert("V souboru chybí datová sekce.");
            return false;
        }
        if (!data["data"].hasOwnProperty(required)) {
            alert(`V souboru chybí datová sekce (${required}).`);
            return false;
        }
        return true;
    }

    // Upload club info:
    static uploadClub (data) {
        if (!Download.#checkData(data, "club-info")) {
            return;
        }

        // Basic info load:
        let form = Elem.sel('form[name="club-info"]');
        Each.in(data["data"]["club-info"]).do((val, name) => {
            if (name === "players") {
                return;
            }
            Elem.sel(form, `[name="${name}"]`).value = val;
        });

        // Player list load:
        let buttonAdd = Elem.sel("#club-players tfoot .add");
        let table = Elem.sel("#club-players tbody");
        table.innerHTML = "";
        Each.for(data["data"]["club-info"]["players"]).do((player) => {
            Evnt.trigger(buttonAdd, "click");
            var row = Elem.sel(table, "tr:last-child");
            Elem.sel(row, 'input[name="player-number"]').value = player["number"];
            Elem.sel(row, 'input[name="player-name"]').value = player["name"];
        });
        Evnt.trigger("#club-players input", "change");
    }

    // Upload jerseys:
    static uploadJersey (data) {
        if (!Download.#checkData(data, "jersey-field")) {
            return;
        }
        if (!Download.#checkData(data, "jersey-goalie")) {
            return;
        }

        // Apply jersey colours:
        Each.for(["jersey-field", "jersey-goalie"]).do((section) => {
            var form = Elem.byId(section);
            Each.in(data["data"][section]).do((val, name) => {
                var el = Elem.sel(form, `[name="${name}"]`);
                el.value = val;
                Evnt.trigger(el, "change", true);
            });
        });
    }

    // Upload match info:
    static uploadMatch (data) {
        if (!Download.#checkData(data, "match-info")) {
            return;
        }
        let form = Elem.sel('form[name="match-info"]');
        Each.in(data["data"]["match-info"]).do((val, name) => {
            if (name === "our-players" || name === "partner-players") {
                return;
            }
            Elem.sel(form, `[name="${name}"]`).value = val;
        });

        // Načteme hráče našeho týmu:
        Elem.sel("#our-players tbody").innerHTML = "";
        Each.for(data["data"]["match-info"]["our-players"]).do((player) => {
            Events.addPlayerToMatchInfo(player);
        });

        // Načteme hráče soupeře:
        Elem.sel("#partner-players tbody").innerHTML = "";
        let buttonAdd = Elem.sel("#partner-players tfoot .add");
        Each.for(data["data"]["match-info"]["partner-players"]).do((player) => {
            Evnt.trigger(buttonAdd, "click");
            var row = Elem.sel("#partner-players tbody tr:last-child");
            Elem.sel(row, '[name="player-number"]').value = player["player-number"];
            Elem.sel(row, '[name="player-name"]').value = player["player-name"];
        });

        // Zpropagujeme hráče do seznamů:
        Events.createPlayerLists();
    }

    // Upload lineup:
    static uploadLineup (data) {
        if (!Download.#checkData(data, "lineup")) {
            return;
        }

        // Upload form settings:
        let form = Elem.sel('form[name="formation"]');
        Each.in(data["data"]["lineup"]).do((val, id) => {
            if (id === "lineup") {
                return;
            } else if (id === "info-place-time") {
                Elem.sel("#info-place-time li.day").innerHTML = val["day"];
                Elem.sel("#info-place-time li.time").innerHTML = val["time"];
                Elem.sel("#info-place-time li.place").innerHTML = val["place"];
            } else if (id === "info-substituties") {
                var ul = Elem.from("#info-substituties ul");
                ul.html("");
                Each.in(val).do((name, number) => {
                    Elem
                        .create("li")
                        .attr("data-number", number)
                        .html(name)
                        .appendTo(ul);
                });
            } else if (id === "info-referees") {
                var ul = Elem.from("#info-referees ul");
                ul.html("");
                Each.for(val).do((name) => {
                    Elem
                        .create("li")
                        .html(name)
                        .appendTo(ul);
                });
            }
            var el = Elem.byId(id);
            el.value = val;
            Evnt.trigger(el, "change");
        });

        Each.in(data["data"]["lineup"]["lineup"]).do((line, id) => {
            var playerElem = Elem.sel(`#lineup .line.${id} figure`);
            Each.for(line).do((playerData) => {
                playerElem.querySelector("figcaption").innerText = playerData["name"];
                playerElem.querySelector(".number").innerText = playerData["number"];
                playerElem.querySelector("div").style.alignSelf = playerData["position"];
                playerElem = playerElem.nextElementSibling;
            });
        });

    }

    // Upload match events:
    static uploadEvents (data) {
        if (!Download.#checkData(data, "match-events")) {
            return;
        }
        Elem.sel("div.result div.events").innerHTML = "";
        Elem.sel("#event-line tbody").innerHTML = "";
        Events.eventFormClear();
        Each.for(data["data"]["match-events"]).do((data) => {
            Events.fillEventListItem(Events.appendEventListItem(data), data);
        });

        Elem.sel("#block-flyers-penalties .events").innerHTML = "";
        if (data["data"].hasOwnProperty("penalty-shootout")) {
            Each.for(data["data"]["penalty-shootout"]).do((row, i) => Events.penaltiesSetRow(i + 1, row));
        }
    }

    static uploadGlobal (data) {
        Download.uploadClub(data);
        Download.uploadJersey(data);
        Download.uploadMatch(data);
        Download.uploadLineup(data);
        Download.uploadEvents(data);
    }

    // Download button click event handler:
    static clickDownload (e) {
        Download.#runMethod(e.currentTarget.getAttribute("data-method"));
    }

    static onUpload (content, file, method) {
        Download[method](JSON.parse(content));
    }

    // Upload button click event handler:
    static clickUpload (e) {
        Download.getUploader().upload(e.currentTarget.getAttribute("data-method"));
    }

    // Run method if exists:
    static #runMethod (methodName) {
        if (!methodName) {
            return;
        }
        if (!Download.hasOwnProperty(methodName)) {
            return;
        }
        Download[methodName]();
    }

}