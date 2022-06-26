class Evnt {

    // Attach event listener to DOM element.
    static #attachEvent (el, event, listener) {
        // One event or JSON of events?
        if (typeof event === "string" || event instanceof String) {
            el.addEventListener(event, listener);
            return;
        }
        for (var eventName in event) {
            el.addEventListener(eventName, event[eventName]);
        }
    }

    // Add event(s) listener to ONE element.
    static on (el, event, listener) {
        // Determine element
        if (!(el instanceof HTMLElement)) {
            el = (
                el instanceof Elem
                ? el.get()
                : document.querySelector(el)
            );
            if (!el) {
                return false;
            }
        }
        Evnt.#attachEvent(el, event, listener);
        return Evnt;
    }

    // Add event(s) listener to multiple elements.
    // el: string query-selector | array array of elements | ...
    // event: string event name | object
    // listener: function event listener
    static onAll (el, event, listener) {
        // el is string (el is querySelector):
        if (typeof el === "string" || el instanceof String) {
            for (var element of document.querySelectorAll(el)) {
                Evnt.#attachEvent(element, event, listener);
            }
            return Evnt;
        }
        // el is NodeList:
        if (el instanceof NodeList) {
            for (var element of el) {
                Evnt.#attachEvent(element, event, listener);
            }
            return Evnt;
        }
        // el has length (el is probably array):
        if (el.hasOwnProperty("length")) {
            for (var i = 0, l = el.length; i < l; ++i) {
                Evnt.#attachEvent(el[i], event, listener);
            }
            return Evnt;
        }
        // el is JSON or something:
        for (var element in el) {
            Evnt.#attachEvent(element, event, listener);
        }
        return Evnt;
    }

    // Fire event on DOM element.
    // el: string query-selector (eg. #id, div > p.class ...) | HTMLElement DOM element
    // event: string event name | Event event
    // bubbles: bool "bubbles" attribute for new event
    static trigger (el, event, bubbles) {
        // Element or query string?
        if (!(el instanceof HTMLElement)) {
            el = document.querySelector(el);
            if (!el) {
                return false;
            }
        }
        el.dispatchEvent(Evnt.#getEvent(event, bubbles));
        return Evnt;
    }

    // Fire event on DOM elements.
    // el: string query-selector (eg. #id, div > p.class ...) | HTMLElement DOM element
    // event: string event name | Event event
    // bubbles: bool "bubbles" attribute for new event
    static triggerAll (el, event, bubbles) {
        // Modify event:
        var e = Evnt.#getEvent(event, bubbles);

        // el is string (el is querySelector):
        if (typeof el === "string" || el instanceof String) {
            for (var element of document.querySelectorAll(el)) {
                element.dispatchEvent(e);
            }
            return Evnt;
        }
        // el is NodeList:
        if (el instanceof NodeList) {
            for (var element of el) {
                element.dispatchEvent(e);
            }
            return Evnt;
        }
        // el has length (el is probably array):
        if (el.hasOwnProperty("length")) {
            for (var i = 0, l = el.length; i < l; ++i) {
                element.dispatchEvent(e);
            }
            return;
        }
        // el is JSON or something:
        for (var element in el) {
            element.dispatchEvent(e);
        }
        return Evnt;
    }

    // Alias for Evnt.trigger.
    static fire (el, event, bubbles) {
        return Evnt.trigger(el, event, bubbles);
    }

    // Alias for Evnt.triggerAll.
    static fireAll (el, event, bubbles) {
        return Evnt.triggerAll(el, event, bubbles);
    }

    // Post event on DOM element.
    // el: string query-selector (eg. #id, div > p.class ...) | HTMLElement DOM element
    // event: string event name | Event event
    // bubbles: bool "bubbles" attribute for new event
    static post (el, event, bubbles) {
        window.setTimeout(() => {
            Evnt.trigger(el, event, bubbles);
        });
        return Evnt;
    }

    // Post event on DOM elements.
    // el: string query-selector (eg. #id, div > p.class ...) | HTMLElement DOM element
    // event: string event name | Event event
    // bubbles: bool "bubbles" attribute for new event
    static postAll (el, event, bubbles) {
        window.setTimeout(() => {
            Evnt.triggerAll(el, event, bubbles);
        });
        return Evnt;
    }

    // Return Event object from parameters or new Event instanced.
    // event: Event|string Event object or event name
    // bubbles: bool "bubbles" attribute for new event
    static #getEvent (event, bubbles) {
        return (
            event instanceof Event
            ? event
            : (
                bubbles === undefined
                ? new Event(event)
                : new Event(event, {"bubbles": bubbles})
            )

        );
    }
}