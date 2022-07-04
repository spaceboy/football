class Each {

    // Array/list we are looping over.
    static source;

    // Method (for|in|of) used for loop.
    static method;

    // Set array for looping over (for (var i = 0, l = a.length; i < l; ++i)...).
    static for (array) {
        Each.source = array;
        Each.method = "for";
        return Each;
    }

    // Set list for looping over (for (var el in a)...).
    static in (list) {
        Each.source = list;
        Each.method = "in";
        return Each;
    }

    // Set list for looping over (for (var el of a)...).
    static of (list) {
        Each.source = list;
        Each.method = "of";
        return Each;
    }

    // Shortcut for Each.querySelectorAll.
    static all (context, query) {
        return Each.querySelectorAll(context, query);
    }

    // Set querySelectorAll for looping over (for var el of context.querySelectorAll(query))...)
    // When context is not set (method called with one parameter only), document is assumed.
    static querySelectorAll (context, query) {
        Each.source = (
            query
            ? context.querySelectorAll(query)
            : document.querySelectorAll(context)
        );
        Each.method = "of";
        return Each;
    }

    // Set callback and execute.
    static do (callback) {
        if (!Each.source || !Each.method) {
            throw Error("Undefined source and/or method; use Each.for, Each.in, Each.of or Each.all method.");
        }
        switch (Each.method) {
            case "for":
                for (var i = 0, l = Each.source.length; i < l; ++i) {
                    Each.#execute(callback, Each.source[i], i, Each.source);
                }
                break;
            case "in":
                for (var i in Each.source) {
                    Each.#execute(callback, Each.source[i], i, Each.source);
                }
                break;
            case "of":
                for (var i of Each.source) {
                    Each.#execute(callback, i, Each.source);
                }
                break;
        }
    }

    static #execute (callback, el, index, source) {
        var source = Each.source;
        var method = Each.method;
        callback(el, index, source);
        Each.method = method;
        Each.source = source;
    }
}