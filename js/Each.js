class Each {

    static source;
    static method;

    static for (array) {
        Each.source = array;
        Each.method = "for";
        return Each;
    }

    static in (list) {
        Each.source = list;
        Each.method = "in";
        return Each;
    }

    static of (list) {
        Each.source = list;
        Each.method = "of";
        return Each;
    }

    static all (context, query) {
        return Each.querySelectorAll(context, query);
    }

    static querySelectorAll (context, query) {
        Each.source = (
            query
            ? context.querySelectorAll(query)
            : document.querySelectorAll(context)
        );
        Each.method = "of";
        return Each;
    }

    static do (callback) {
        if (!Each.source || !Each.method) {
            throw Error("Undefined source and/or method; use Each.for, Each.in, Each.of or Each.all method.");
        }
        switch (Each.method) {
            case "for":
                for (var i = 0, l = Each.source.length; i < l; ++i) {
                    callback(Each.source[i], i, Each.source);
                }
                break;
            case "in":
                for (var i in Each.source) {
                    callback(Each.source[i], i, Each.source);
                }
                break;
            case "of":
                for (var i of Each.source) {
                    callback(i, Each.source);
                }
                break;
        }
    }
}