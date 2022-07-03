class UploadFile {

    callbackOnStart;

    callbackOnLoad;

    callbackOnError;

    fileUpload;

    acceptStart;

    // Additional parameter for "onLoad"
    param;

    constructor (accept, params) {
        this.acceptStart = accept;
        var fu = document.createElement("input");
        fu.type = "file";
        fu.style.display = "none";
        for (var i in params) {
            fu.setAttribute(i, params[i]);
        }
        fu.onchange = this.onChange.bind(this);
        this.fileUpload = fu;
    }

    onLoad (callback) {
        this.callbackOnLoad = callback;
        return this;
    }

    onStart (callback) {
        this.callbackOnStart = callback;
        return this;
    }

    onError (callback) {
        this.callbackOnError = callback;
        return this;
    }

    upload (param) {
        this.param = param;
        if (this.callbackOnStart) {
            this.callbackOnStart().bind(this);
        }
        this.fileUpload.click();
    }

    static getFileExt (fileName) {
        var ext = fileName.split(".");
        return (
            ext.length
            ? ext.pop()
            : fileName
        );
    }

    onChange (e) {
        e.preventDefault();
        if (e.target.files.length < 1) {
            return;
        }
        if (this.acceptStart && !e.target.files[0].type.startsWith(this.acceptStart)) {
            if (this.callbackOnError) {
                this.callbackOnError().bind(this);
            }
            throw Error(`File type mismatch; (${this.acceptStart}) expected, (${e.target.files[0].type}) get.`);
        } else {
            this.processFile(e.target.files[0]);//.bind(this);
        }
    }

    processFile (file) {
    }
}

class UploadFileText extends UploadFile {
    processFile (file) {
        file.text()
            .then((text) => {
                if (this.callbackOnLoad) {
                    this.callbackOnLoad(text, file, this.param);
                }
            })
            .catch((e) => {
                if (this.callbackOnError) {
                    this.callbackOnError(e);
                }
            })
        ;
    }
}
