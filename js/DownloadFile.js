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
}
