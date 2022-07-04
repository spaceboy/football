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
        Download.getEventsData();
        DownloadFile.downloadText("datafile.json", Download.getJson());
    }

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

    static uploadClub () {}

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
    }

    static uploadGlobal () {
        Download.uploadClub();
        Download.uploadJersey();
        Download.uploadMatch();
        Download.uploadEvents();
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