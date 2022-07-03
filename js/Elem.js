class Elem {

    element;

    constructor (el) {
        if (Elem.isDomObject(el)) {
            this.element = el;
            return this;
        }
        el = document.querySelector(el);
        if (!el) {
            return;
        }
        this.element = el;
        return this;
    }

    static create (name) {
        return new Elem(document.createElement(name));
    }

    get () {
        return this.element;
    }

    // Set attribute(s);
    // when called with one string parameter, return attribute value.
    // ELEMENT.attr("attribute", "value")
    // ELEMENT.attr({
    //   "attribute1": "value1",
    //   ..
    //   "attributeN": "valueN",
    // })
    attr (name, value) {
        if (name && value !== undefined) {
            this.element.setAttribute(name, value);
            return this;
        }
        if (name) {
            if (typeof name === "string" || name instanceof String) {
                return this.element.getAttribute(name);
            }
            for (var i in name) {
                this.element.setAttribute(i, name[i]);
            }
        }
        return this;
    }

    // Remove attribute on active element.
    attrRemove (name) {
        this.element.removeAttribute(name);
        return this;
    }

    // Set/get active element's innerHTML.
    html (value) {
        if (value === undefined) {
            return this.element.innerHTML;
        }
        this.element.innerHTML = value;
        return this;
    }

    // Set/get active element's innerText.
    text (value) {
        if (value === undefined) {
            return this.element.innerText;
        }
        this.element.innerText = value;
        return this;
    }

    // Create and return active element's clone.
    clone (deep) {
        this.element = this.element.cloneNode(deep);
        return this;
    }

    // Find closest element.
    closest (query) {
        return this.element.closest(query);
    }

    // Place active element AFTER given element.
    after (el) {
        if (el instanceof Elem) {
            el = el.get();
        }
        el.parentNode.insertBefore(this.element, el.nextSibling);
        return this;
    }

    // Place active element BEFORE given element.
    before (el) {
        if (el instanceof Elem) {
            el = el.get();
        }
        el.parentNode.insertBefore(this.element, el);
        return this;
    }

    // Append active element to given element.
    appendTo (el) {
        if (Elem.isDomObject(el)) {
            el.appendChild(this.element);
            return this;
        }
        if (el instanceof Elem) {
            el.get().appendChild(this.element);
            return this;
        }
        document.querySelector(el).appendChild(this.element);
        return this;
    }

    // Append given element to active element.
    append (el) {
        this.element.appendChild(el instanceof Elem ? el.get() : el);
        return this;
    }

    // Get previous sibling of active element.
    prev () {
        return this.element.previousSibling;
    }

    // Get Elem object based on previous sibling of active element.
    elemPrev () {
        return new Elem(this.element.previousSibling);
    }

    // Get previous sibling of active element.
    prevElement () {
        return this.element.previousElementSibling;
    }

    // Get Elem object based on previous sibling of active element.
    elemPrevElement () {
        return new Elem(this.element.previousElementSibling);
    }

    // Get next sibling of active element.
    next () {
        return this.element.nextSibling;
    }

    // Get Elem object based on next sibling of active element.
    elemNext () {
        return new Elem(this.element.nextSibling);
    }

    // Get next element sibling of active element.
    nextElement () {
        return this.element.nextElementSibling;
    }

    // Get Elem object based on next element sibling of active element.
    elemNextElement () {
        return new Elem(this.element.nextElementSibling);
    }

    // Get parent of active element.
    parent () {
        return this.element.parentNode;
    }

    // Get Elem object based on parent of active element.
    elemParent () {
        return new Elem(this.element.parentNode);
    }

    // Remove active element from DOM.
    remove () {
        return Elem.removeElement(this.element);
    }

    // Remove given element from DOM.
    // Return bool:
    // TRUE element removed
    // FALSE element not removed
    static removeElement (el) {
        if (Elem.isDomObject(el)) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
            return true;
        }
        if (el instanceof Elem) {
            var e = el.get();
            if (e.parentNode) {
                e.parentNode.removeChild(e);
            }
            return true;
        }
        var e = document.querySelector(el);
        if (e.parentNode) {
            e.parentNode.removeChild(e);
            return true;
        }
        return false;
    }

    // Wrap given element by active element.
    wrap (el) {
        if (el instanceof Elem) {
            el = el.get();
        }
        el.parentNode.insertBefore(this.element, el).appendChild(el.cloneNode(true));
        el.remove();
        return this;
    }

    // Set HTML class on active element.
    class (className) {
        this.element.setAttribute("class", className);
        return this;
    }
    // Add HTML class to active element.
    addClass (className) {
        var a = this.#getClassArray();
        if (false === this.#inArray(className, a)) {
            a.push(className);
        }
        this.element.setAttribute("class", a.join(" "));
        return this;
    }

    // Remove CSS class from active element.
    removeClass (className) {
        var a = this.#getClassArray();
        var i = this.#inArray(className, a);
        if (false !== i) {
            a.splice(i, 1);
        }
        this.element.setAttribute("class", a.join(" "));
        this.clearClass();
        return this;
    }

    // Toggle CSS class on active element.
    toggleClass (className) {
        var a = this.#getClassArray();
        var i = this.#inArray(className, a);
        if (false === i) {
            a.push(className);
        } else {
            a.splice(i, 1);
        }
        this.element.setAttribute("class", a.join(" "));
        this.clearClass();
        return this;
    }

    // Clear attribute "class" on active element.
    clearClass () {
        if (this.element.hasAttribute("class") && !this.element.getAttribute("class")) {
            this.element.removeAttribute("class");
        }
        return this;
    }

    // Detect whether active element has given CSS class or not.
    hasClass (className) {
        return this.#inArray(className, this.#getClassArray());
    }

    // Return count of child nodes.
    // When query is set, return count of matching querySelectorAll nodes.
    childCount (query) {
        if (query) {
            return this.element.querySelectorAll(query).length;
        }
        return this.element.childNodes.length;
    }

    // Return value of active element;
    // when value is set, set value to ective element and return this.
    val (value) {
        if (value === undefined) {
            return this.element.value;
        }
        this.element.value = value;
        return this;
    }

    // Swap with given node
    swapWithNode (node) {
        if (node instanceof Elem) {
        }
        Elem.swapNodes(this.element, node);
        return this;
    }

    // Return node matching query on active element.
    qs (query) {
        return this.element.querySelector(query);
    }

    // Return node list matching query on active element.
    qsAll (query) {
        return this.element.querySelectorAll(query);
    }

    // Return Elem object based on node matching query on active element.
    qsElem (query) {
        return new Elem(this.element.querySelector(query));
    }

    // Triggers event on active element.
    // When event is instance of Event, triggers event,
    // otherwise creates new Event on event name (event) and parameters (params).
    trigger (event, params) {
        console.log("trigger");
        console.log(this.element);
        console.log(event);
        this.element.dispatchEvent(
            event instanceof Event
            ? event
            : new Event(event, params)
        );
    }

    // Detect whether given object is a DOM object.
    static isDomObject (obj) {
        if (obj instanceof HTMLElement) {
            return true;
        }
        return typeof obj === "object"
            && obj.nodeType === 1
            && typeof obj.style === "object"
            && typeof obj.ownerDocument === "object";
    }

    // TOOL: Swap given nodes (DOM elements) positions in DOM.
    static swapNodes (n1, n2) {
        // Find parents:
        var p1 = n1.parentNode;
        var p2 = n2.parentNode;
        if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) {
            return;
        }
        // Create placeholders:
        var ph1 = document.createElement("span");
        p1.insertBefore(ph1, n1);
        var ph2 = document.createElement("span");
        p2.insertBefore(ph2, n2);
        // Move nodes:
        p1.insertBefore(n2, ph1);
        p2.insertBefore(n1, ph2);
        // Remove placeholders:
        p1.removeChild(ph1);
        p2.removeChild(ph2);
    }

    // TOOL: Return HTML element (not instance of Elem!) by context (when given) and id.
    // When not given explicit context, document is used as default context.
    static byId (context, id) {
        return (
            id
            ? context.getElementById(id)
            : document.getElementById(context)
        );
    }

    // TOOL: Return HTML element (not instance of Elem!) by context (when given) and query selector.
    // When not given explicit context, document is used as default context.
    static sel (context, query) {
        return (
            query
            ? context.querySelector(query)
            : document.querySelector(context)
        );
    }

    // TOOL: Return HTML element's (selected by context (when given) and id) value.
    // When not given explicit context, document is used as default context.
    static valueById (context, id) {
        return Elem.byId(context, id).value;
    }

    #getClassArray () {
        return (
            this.element && this.element.hasAttribute("class") && this.element.getAttribute("class")
            ? this.element.getAttribute("class").trim().replace(/\s+/, " ").split(" ")
            : []
        );
    }

    #inArray (needle, haystack) {
        for (var i = 0, l = haystack.length; i < l; ++i) {
            if (haystack[i] === needle) {
                return i;
            }
        }
        return false;
    }
}