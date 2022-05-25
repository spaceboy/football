class Evnt {

    // Attach event listener to DOM element:
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

    // Add event(s) listener to ONE element:
    static on (el, event, listener) {
        // Determine element
        if (!(el instanceof HTMLElement)) {
            el = document.querySelector(el);
            if (!el) {
                return false;
            }
        }
        Evnt.#attachEvent(el, event, listener);
        return Evnt;
    }

    // Add event(s) listener to multiple elements:
    // el: string query-selector | array array of elements | ...
    // event: string event name | object
    // listener: function event listener
    static onAll (el, event, listener) {
        // el is string (el is querySelector):
        if (typeof el === "string" || el instanceof String) {
            for (var element of document.querySelectorAll(el)) {
                Evnt.#attachEvent(element, event, listener);
            }
            return;
        }
        // el has length (el is probably array):
        if (el.hasOwnProperty("length")) {
            for (var i = 0, l = el.length; i < l; ++i) {
                Evnt.#attachEvent(el[i], event, listener);
            }
            return;
        }
        // el is JSON or something:
        for (var element in el) {
            Evnt.#attachEvent(element, event, listener);
        }
        return Evnt;
    }

    // Fire event on DOM element:
    // el: string query-selector (eg. #id, div > p.class ...) | HTMLElement DOM element
    // event: string event name | Event event
    static trigger (el, event) {
        // Element or query string?
        if (!(el instanceof HTMLElement)) {
            el = document.querySelector(el);
            if (!el) {
                return false;
            }
        }
        el.dispatchEvent(event instanceof Event ? event : new Event(event));
        return Evnt;
    }

    static triggerAll (el, event) {
        // Create event:
        if (!(event instanceof Event)) {
            event = new Event(event);
        }

        // el is string (el is querySelector):
        if (typeof el === "string" || el instanceof String) {
            for (var element of document.querySelectorAll(el)) {
                element.dispatchEvent(event);
            }
            return;
        }
        // el has length (el is probably array):
        if (el.hasOwnProperty("length")) {
            for (var i = 0, l = el.length; i < l; ++i) {
                element.dispatchEvent(event);
            }
            return;
        }
        // el is JSON or something:
        for (var element in el) {
            element.dispatchEvent(event);
        }
        return Evnt;
    }

    // Alias for Evnt.trigger
    static fire (el, event) {
        return Evnt.trigger(el, event);
    }

    // Alias for Evnt.triggerAll
    static fireAll (el, event) {
        return Evnt.triggerAll(el, event);
    }

    // Post event on DOM element:
    // el: string query-selector (eg. #id, div > p.class ...) | HTMLElement DOM element
    // event: string event name | Event event
    static post (el, event) {
        window.setTimeout(() => {
            Evnt.trigger(el, event);
        });
        return Evnt;
    }

    // Post event on DOM elements:
    // el: string query-selector (eg. #id, div > p.class ...) | HTMLElement DOM element
    // event: string event name | Event event
    static postAll (el, event) {
        window.setTimeout(() => {
            Evnt.triggerAll(el, event);
        });
        return Evnt;
    }
}