class Menu {

    static init (menuQuery) {

        // Aktivace menu:
        Evnt.onAll(`${menuQuery} [data-menu-target]`, "click", (e) => {
            let menuItem = e.currentTarget;
            let menu = menuItem.closest(menuQuery);

            // Pokud neexistuje cílový panel, zruš akci:
            var panel = (
                menuItem.hasAttribute("data-menu-target")
                ? Elem.sel(menuItem.getAttribute("data-menu-target"))
                : false
            );
            if (!panel) {
                return;
            }

            // Skrýt panely navázané na menu:
            Each
                .all(
                    menu.hasAttribute("data-menu-name")
                    ? `div.block[data-menu-name="${menu.getAttribute("data-menu-name")}"]`
                    : "div.block"
                )
                .do((el) => el.setAttribute("class", "block"));

            // Skrýt položky menu:
            Each.all(menu, "[data-menu-target]").do((el) => el.removeAttribute("class"));

            // Kliknuté položce manu nastavit class active:
            menuItem.setAttribute("class", "active");

            // Zobrazit content navázaný na aktivní položku:
            panel.setAttribute("class", "block active");

            // Provést akci navázanou na data-menu-onclick (na položce menu):
            if (menuItem.hasAttribute("data-menu-onclick")) {
                if (typeof eval(this.name)[menuItem.getAttribute("data-menu-onclick")] === "function") {
                    eval(this.name)[menuItem.getAttribute("data-menu-onclick")]();
                }
            }

            // Provést akci navázanou na data-menu-onselect (na panelu):
            if (panel.hasAttribute("data-menu-onselect")) {
                if (typeof eval(this.name)[panel.getAttribute("data-menu-onselect")] === "function") {
                    eval(this.name)[mepanelnuItem.getAttribute("data-menu-onselect")]();
                }
            }
        });

        // Menu: Otvírání defaultních panelů:
        Each.all(menuQuery).do((el) => {
            if (el.hasAttribute("data-menu-default")) {
                Evnt.trigger(el.querySelector(`li[data-menu-target="${el.getAttribute("data-menu-default")}"]`), "click");
            }
        });

    }
}

class FootballMenu extends Menu {
    static showFlyerInvitation () {
        Elem.byId("block-flyer-editor-datetitme").setAttribute("class", "block active");
        Elem.byId("block-flyer-editor-events").setAttribute("class", "block")
        Elem.byId("block-flyer-editor-penalties").setAttribute("class", "block")
    }

    static showFlyerEvents () {
        Elem.byId("block-flyer-editor-datetitme").setAttribute("class", "block");
        Elem.byId("block-flyer-editor-events").setAttribute("class", "block active")
        Elem.byId("block-flyer-editor-penalties").setAttribute("class", "block")
    }

    static showFlyerPenalties () {
        Elem.byId("block-flyer-editor-datetitme").setAttribute("class", "block");
        Elem.byId("block-flyer-editor-events").setAttribute("class", "block")
        Elem.byId("block-flyer-editor-penalties").setAttribute("class", "block active")
    }
}