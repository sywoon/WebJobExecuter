export class Browser {
    static getBaseUrl() {
        // host: "192.168.30.40:9100"
        // hostname: "192.168.30.40"
        // href: "http://192.168.30.40:9100/http_client/index.html"
        // origin: "http://192.168.30.40:9100"
        // pathname: "/http_client/index.html"
        // search: "?admin=1"
        // port: "9100"
        // protocol: "http:"
        return window.location.origin
    }
}
