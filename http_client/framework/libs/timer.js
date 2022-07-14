(function(exports) {

    class TimerVo {
        static _pool = []
        static create() {
            if (TimerVo._pool.length > 0)
                return TimerVo._pool.pop()
            return new TimerVo()
        }

        constructor() {
            this.clear()
        }

        clear() {
            this.handler && this.handler.recycle()
            this.handler = null
            this.delay = 0
            this.timeStart = 0
        }

        recycle() {
            this.clear()
            TimerVo._pool.push(this)
        }
    }

    class Timer {
        get speed() {
            return this._speed;
        }
        set speed(v) {
            this._speed = v;
        }

        constructor() {
            this._timerVos = []
            this._curTime = Date.now()
            this._speedLast = 1
            this._speed = 1
        }

        pause() {
            if (this._speed === 0)
                return
            this._speedLast = this._speed
            this._speed = 0
        }

        resume() {
            if (this._speed !== 0)
                return
            this._speed = this._speedLast
        }

        once(delay, caller, method, coverBefore, args=null) {
            this._addCall(true, 1, delay, caller, method, coverBefore, args);
        }

        loop(delay, caller, method, repeatTimes=0, coverBefore, args=null) {
            this._addCall(false, repeatTimes, delay, caller, method, coverBefore, args);
        }

        clear(caller, method=null) {
            for (let vo of this._timerVos) {
                if (!vo.handler)
                    continue;
                
                if ((method == null && vo.handler.caller === caller) || 
                    (vo.handler.equalTo(caller, method))) {
                    vo.clear();
                }
            }
        }


        //repeatTimes 0无限
        _addCall(once, repeatTimes=0, delay, caller, method, coverBefore, args) {
            let vo = null
            if (coverBefore) {
                vo = this._getVo(caller, method)
                if (vo) {  //直接用旧vo更新
                    vo.handler.args = args
                }
            }

            if (!vo) {
                vo = TimerVo.create()
                vo.handler = Handler.create(caller, method, once, args)
                this._timerVos.push(vo)
            }

            vo.repeatTimes = repeatTimes
            vo.delay = delay
            vo.timeStart = this._curTime
        }

        _getVo(caller, method) {
            for (let vo of this._timerVos) {
                if (vo.handler && vo.handler.equalTo(caller, method))
                    return vo
            }
            return null
        }

        update() {
            if (this._speed <= 0)
                return

            this._curFrames++
            this._curTime = Date.now()  //毫秒

            this._updateTimes()

            if (this._curFrames % 200 === 0) {
                this._clearTimerVo()
            }
        }

        _updateTimes() {
            for (let vo of this._timerVos) {
                if (!vo.handler)
                    continue

                let passed = Math.floor((this._curTime - vo.timeStart) * this._speed)
                if (passed < vo.delay)
                    continue

                vo.handler.run();
                vo.timeStart = this._curTime

                if (vo.repeatTimes > 0) {
                    vo.repeatTimes--
                    if (vo.repeatTimes <= 0) 
                        vo.clear()
                }
            }
        }

        _clearTimerVo() {
            let left = []
            for (let vo of this._timerVos) {
                if (!vo.handler) {
                    vo.recycle()
                    continue
                }

                left.push(vo)
            }

            this._timerVos = left
        }
    }

exports.Timer = Timer
})(window)