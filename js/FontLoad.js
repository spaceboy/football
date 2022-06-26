class FontLoad {
    scriptNode;
    constructor () {
        this.scriptNode = document.currentScript;
        if (this.scriptNode.hasAttribute('data-url-googlefonts')) {
            this.load.call(this, this.scriptNode.getAttribute('data-url-googlefonts'));
        }
    }
    createStyleNodeBefore (content) {
        let s = document.createElement('style');
        s.innerHTML = content;
        this.scriptNode.parentNode.insertBefore(s, this.scriptNode);
    }
    load (url) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = () => {
            if (ajax.readyState == 4 && ajax.status == 200) {
                this.createStyleNodeBefore(ajax.responseText);
            }
        }
        ajax.open("GET", url, true);
        ajax.send();
        return this;
    }
}
new FontLoad();