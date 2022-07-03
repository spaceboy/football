class DownloadFile {
    static download (fileName, content) {
        (Elem.create("a"))
            .attr({
                "download": fileName,
                "href": content
            })
            .get()
            .click();
    }
    static downloadText (fileName, content) {
        (Elem.create("a"))
            .attr({
                "download": fileName,
                "href": "data:text/json;charset=utf-8," + encodeURIComponent(content)
            })
            .get()
            .click();
    }
}
