export class NetHttp {
    constructor() {
        this.xhr = new HttpRequest()
    }

    send(url, data, method, cbkComp, cbkError) {
        this.xhr.send(url, data, method)
    }
}


