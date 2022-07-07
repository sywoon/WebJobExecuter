(function() {
    var debug = true;

    function HttpRequest() {
        this.http = new XMLHttpRequest();
        this.http.timeout = 0;
        this.responseType = "text";
    }

    HttpRequest.prototype.setCallback = function (cbk) {
        this.cbk = cbk;
    }

    // method: "get"、"post"、"head"
    HttpRequest.prototype.send = function (url, data, method, responseType, headers) {
        var http = this.http;
        http.open(method, url, true);

        var isJson = false;
        if (headers) {
            for (var i = 0; i < headers.length; i++) {
                http.setRequestHeader(headers[i++], headers[i]);
            }
        } else {
            if (!data || typeof (data) == 'string') 
                http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			else{ 
				http.setRequestHeader("Content-Type", "application/json");
				isJson = true;
			}
        }

        this.responseType = responseType;

        let restype = responseType !== "arraybuffer" ? "text" : "arraybuffer";
        http.responseType = restype;

        var _this_ = this;
        http.onerror = function (e) {
            _this_._onError(e);
        }
        http.onabort = function (e) {
            _this_._onAbort(e);
        }
        http.onprogress = function (e) {
            _this_._onProgress(e);
        }
        http.onload = function (e) {
            _this_._onLoad(e);
        }
        http.send( isJson ? JSON.stringify(data) : data);
    }


    HttpRequest.prototype._onProgress = function (e) {
        debug && console.log("onProgress", e.loaded, e.total);
        this.cbk && this.cbk("onprogress", e.loaded, e.total);
    }

    HttpRequest.prototype._onAbort = function (e) {
        debug && console.log("Request was aborted by user");
        this.cbk && this.cbk("onabort");
    }

    HttpRequest.prototype._onError = function (e) {
        console.error("Request failed Status:" + this.http.status 
                + " text:" + this.http.statusText);
        this.cbk && this.cbk("onerror");
    }

    HttpRequest.prototype._onLoad = function () {
        var http = this.http;
        var status = http.status !== undefined ? http.status : 200;

        if (status === 200 || status === 204 || status === 0) {
            this.complete();
        } else {
            console.error("[" + http.status + "]" + http.statusText + ":" + http.responseURL);
        }
    }


    HttpRequest.prototype.complete = function () {
        var data;
        if (this.responseType === "json") {
            data = JSON.parse(this.http.responseText);
        } else {
            data = this.http.response || this.http.responseText;
        }
        debug && console.log("complete", data);
        this.cbk && this.cbk("complete", data);
    }

    window.HttpRequest = HttpRequest;
})();