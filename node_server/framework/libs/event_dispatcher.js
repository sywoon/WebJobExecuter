const Handler = require("./handler")


class EventDispatcher {
    constructor() {
        this._events = {}
    }

    on(type, caller, method, offBefore=true, args=null) {
        return this._createListener(type, caller, method, false, offBefore, args)
    }

    once(type, caller, method, offBefore=true, args=null) {
        return this._createListener(type, caller, method, true, offBefore, args)
    }

    _createListener(type, caller, method, once, offBefore, args) {
        offBefore && this.off(type, caller, method)

        let handler = Handler.create(caller, method, once, args)
        if (!this._events[type]) {
            this._events[type] = []
        }

        this._events[type].push(handler)
        return this
    }


    off(type, caller, method) {
        if (!this._events[type])
            return

        let arr = this._events[type]
        for (let i = arr.length-1; i >= 0; i--) {
            let event = arr[i]
            if (event && event.equalTo(caller, method)) {
                event.recycle()
                arr.splice(i, 1)
            }
        }
    }

    offAllCaller(caller, type=null) {
        if (type && !this._events[type])
            return

        if (type && caller) {
            let arr = this._events[type]
            for (let i = arr.length-1; i >= 0; i--) {
                let event = arr[i]
                if (event && event.caller === caller) {
                    event.recycle()
                    arr.splice(i, 1)
                }
            }
            return
        }
        
        if (caller && !type) {
            for (let t in this._events) {
                let arr = this._events[t]
                for (let i = arr.length-1; i >= 0; i--) {
                    let event = arr[i]
                    if (event && event.caller === caller) {
                        event.recycle()
                        arr.splice(i, 1)
                    }
                }
            }
            return
        }
    }

    offAll(type) {
        if (!this._events[type])
            return

        let arr = this._events[type]
        for (let event of arr) {
            event.recycle()
        }
        delete this._events[type]
    }

    //支持数组直接作为参数  接收的回调参数和他一致
    //fire("evt", [11, 22], 33, 44)
    //fire("evt", 11, 22, 33)
    fire(type, ...args) {
        if (!this._events[type])
            return

        let arr = this._events[type]
        let count = 0
        for (let i = 0; i < arr.length; i++) {
            let event = arr[i]
            if (event == null) {
                count++
            } else {
                if (event.once) {
                    arr[i] = null
                    count++
                }
                event.runWith(...args)
            }
        }

        if (count === arr.length) {
            delete this._events[type]
        }
    }
    
}

module["exports"] = EventDispatcher