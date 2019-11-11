// https://www.jianshu.com/p/b4f0425b22a1 Promise原理与实现

var promise = (function (params) {
    function Promise(resolver) {
        if (typeof resolver !== 'function') {
            throw new TypeError('Promise resolver ' + resolver + ' is must a function')
        }
        if (!(this instanceof Promise)) return new Promise(resolver);

        var self = this;
        self.callbacks = [];
        self.status = "pending";

        function resolve(value) {
            setTimeout(() => {
                if (self.status != "pending") {
                    return;
                }

                self.status = "resolved";
                self.data = value;

                for (var i = 0; i < self.callbacks.length; i++) {
                    self.callbacks[i].onResolved(value);
                }
            }, 0);
        }

        function reject(reason) {
            setTimeout(() => {
                if (self.status != 'pending') {
                    return;
                }

                self.status = "rejected";
                self.data = reason;

                for (var i = 0; i < self.callbacks.length; i++) {
                    self.callbacks[i].onRejected(reason);
                }
            }, 0);
        }

        try {
            resolver(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    function resolvePromise(promise, x, resolve, reject) {
        var then;
        var thenCalledOrThrow = false;

        if (promise === x) {
            return reject(new TypeError('chaining cycle detected for promised!'))
        }

        if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
            try {
                then = x.then;

                if (typeof then === 'function') {
                    then.call(x, function rs(y) {
                        if (thenCalledOrThrow) return;
                        thenCalledOrThrow = true;
                        return resolvePromise(promise, y, resolve, reject)
                    }, function rj(r) {
                        if (thenCalledOrThrow) return;
                        thenCalledOrThrow = true;
                        return reject(r);
                    })
                } else {
                    return resolve(x);
                }
            } catch (e) {
                if (thenCalledOrThrow) return;
                thenCalledOrThrow = true;
                return reject(e);
            }
        } else {
            return resolve(x)
        }
    }

    Promise.prototype.then = function (onResolved, onRejected) {
        onResolved = typeof onResolved === 'function' ? onResolved : function (v) {
            return v
        };
        onRejected = typeof onRejected === 'function' ? onRejected : function (r) {
            throw r
        };

        var self = this;
        var promise2;

        if (self.status === 'resolved') {
            return promise2 = new Promise(function (resolve, reject) {
                setTimeout(() => {
                    try {
                        var x = onResolved(self.data);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        return reject(e);
                    }
                }, 0);
            })
        }

        if (self.status === 'rejected') {
            return promise2 = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    try {
                        //调用then方法的onReject回调
                        var x = onRejected(self.data)
                        //根据x的值修改promise2的状态
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        //promise2状态变为rejected
                        return reject(e)
                    }
                })
            })
        }

        if (self.status === 'pending') {
            return promise2 = new Promise(function (resolve, reject) {
                self.callbacks.push({
                    onResolved: function (value) {
                        try {
                            //调用then方法的onResolved回调
                            var x = onResolved(value)
                            //根据x的值修改promise2的状态
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            //promise2状态变为rejected
                            return reject(e)
                        }
                    },
                    onRejected: function (reason) {
                        try {
                            //调用then方法的onResolved回调
                            var x = onRejected(reason)
                            //根据x的值修改promise2的状态
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            //promise2状态变为rejected
                            return reject(e)
                        }
                    }
                })
            })
        }

    }

    Promise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
    }

    Promise.prototype.finally = function (fn) {
        return this.then(function (v) {
            setTimeout(() => {
                fn();
            });
            return v;
        }, function (r) {
            setTimeout(() => {
                fn();
            });
            throw r;
        })
    }

    Promise.all = function (promises) {
        return new Promise(function (resolve, reject) {
            var resolveCounter = 0;
            var promiseNum = promises.length;
            var resolveValues = new Array(promiseNum);
            for (var i = 0; i < promiseNum; i++) {
                (function (i) {
                    Promise.resolve(promises[i]).then(function (value) {
                        resolveCounter++;
                        resolveValues[i] = value;
                        if (resolveCounter === promiseNum) {
                            return resolve(resolveValues);
                        }
                    }, function (reason) {
                        return reject(reason);
                    })
                }())
            }
        })
    }

    Promise.race = function(promises){
        return new Promise(function (resolve, reject) {
            for(var i=0;i<promises.length;i++){
                Promise.resolve(promises[i]).then(function (value) {
                    return resolve(value);
                }, function (reason) {
                    return reject(reason);
                })
            }
        })
    }

    Promise.resolve = function (value) {
        var promise = new Promise(function (resolve, reject) {
            resolvePromise(promise, value, resolve, reject)
        });

        return promise;
    }

    try { // CommonJS compliance
        module.exports = Promise
    } catch (e) {}

    return Promise
})();