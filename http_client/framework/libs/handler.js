(function (exports) {

    class Handler {
        static _pool = []

        static create(caller, method, once, args=null) {
            let handler
            if (Handler._pool.length > 0) {
                handler = Handler._pool.pop()
                handler.inpool = false
            } else {
                handler = new Handler()
            }

            handler.setTo(caller, method, once, args)
            return handler
        }

        constructor(caller, method, once, args=null) {
            this.setTo(caller, method, once, args)
        }

        setTo(caller, method, once, args=null) {
            this.caller = caller
            this.method = method
            this.args = args
            this.once = once
        }

        equalTo(caller, method) {
            return this.caller === caller && this.method === method
        }

        recycle() {
            if (this.inpool)
                return
                
            this.setTo(null, null, false)
            this.inpool = true

            Handler._pool.push(this)
        }

        run() {
            if (this.method == null) {
                this.once && this.recycle()
                return
            }

            let rtn = this.method.apply(this.caller, this.args)
            this.once && this.recycle()
            return rtn
        }

        //采用...args 而非args 避免数组参数 额外再套一层数组
        //支持数组直接作为参数  接收的回调参数和他一致
        //fire("evt", [11, 22], 33, 44)
        //fire("evt", 11, 22, 33)
        runWith(...args) {
            if (this.method == null) {
                this.once && this.recycle()
                return
            }

            if (args.length === 0) {
                return this.run()
            }

            let argsAll = this.args || []
            argsAll = argsAll.concat(args)

            let rtn = this.method.apply(this.caller, argsAll)
            this.once && this.recycle()
            return rtn
        }
    }

    exports.Handler = Handler
   
})(window)