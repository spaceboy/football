class Jersey {

    colorBody = "#ccc";

    colorShirt1 = "green";

    colorShirt2 = "white";

    colorShorts = "darkgreen";

    shirtType = "compact";

    shirtTypeList = {
        "compact": "Compact color",
        "halfVertical": "Half colors (V)",
        "halfHorizontal": "Half colors (H)",
        "halfSides": "Half (sides)",
        "stripesVertical": "Stripes (V)",
        "stripesHorizontal": "Stripes (H)"
    };

    setColorBody (colorBody) {
        this.colorBody = colorBody;
        return this;
    };

    setColorShirt1 (colorShirt1) {
        this.colorShirt1 = colorShirt1;
        return this;
    }

    setColorShirt2 (colorShirt2) {
        this.colorShirt2 = colorShirt2;
        return this;
    }

    setColorShorts (colorShorts) {
        this.colorShorts = colorShorts;
        return this;
    }

    setShirtType (shirtType) {
        this.shirtType = shirtType;
        return this;
    }

    setShirtTypeList (shirtTypeList) {
        this.shirtTypeList = shirtTypeList;
        return this;
    }

    getShirtTypeList () {
        return this.shirtTypeList;
    }

    getShirtStyle () {
        switch (this.shirtType) {
            case "halfVertical":
                return `linear-gradient(to right, ${this.colorShirt1} 50%, ${this.colorShirt2} 50%)`;
            case "halfHorizontal":
                return `linear-gradient(to bottom, ${this.colorShirt1} 50%, ${this.colorShirt2} 50%)`;
            case "halfSides":
                return `linear-gradient(to right, ${this.colorShirt2} 20%, ${this.colorShirt1} 20%, ${this.colorShirt1} 80%, ${this.colorShirt2} 80%)`;
            case "stripesVertical":
                return `linear-gradient(to right, ${this.colorShirt1} 0%, ${this.colorShirt1} 20%, ${this.colorShirt2} 20%, ${this.colorShirt2} 40%, ${this.colorShirt1} 40%, ${this.colorShirt1} 60%, ${this.colorShirt2} 60%, ${this.colorShirt2} 80%, ${this.colorShirt1} 80%, ${this.colorShirt1} 100%)`;
            case "stripesHorizontal":
                return `linear-gradient(to bottom, ${this.colorShirt1} 33%, ${this.colorShirt2} 33%, ${this.colorShirt2} 39%, ${this.colorShirt1} 39%, ${this.colorShirt1} 45%, ${this.colorShirt2} 45%, ${this.colorShirt2} 51%, ${this.colorShirt1} 51%, ${this.colorShirt1} 57%, ${this.colorShirt2} 57%, ${this.colorShirt2} 63%, ${this.colorShirt1} 63%`;
            case "compact":
            default:
                return `linear-gradient(${this.colorShirt1}, ${this.colorShirt1})`;
        }
    }

    getStyle () {
        return `linear-gradient(to bottom, ${this.colorBody} 27%, transparent 27%, transparent 69%, ${this.colorShorts} 69%, ${this.colorShorts} 83%, ${this.colorBody} 83%), ${this.getShirtStyle()}`;
    }

    /**
     * Create <option> fields with translated jersey type names for given <select> element.
     * @param {DOMElement} el | <select> element to fill with options
     */
    createOptions (el) {
        for (var i in this.shirtTypeList) {
            var o = document.createElement("option");
            o.value = i;
            o.text = this.shirtTypeList[i];
            el.appendChild(o);
        }
        return this;
    }
}
