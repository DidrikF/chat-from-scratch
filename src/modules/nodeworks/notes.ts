/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose1 (middleware: Function) {
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }
    
    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */
    
    return function (context: any, next: any) {
        // last called middleware #
        let index = -1
        
        return dispatch(0)
        
        function dispatch (i) { // there is closure over this function
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i // 0 = 0
            let fn = middleware[i] //middleware[0]
            if (i === middleware.length) fn = next // when out of middleware, set fn = next
            if (!fn) return Promise.resolve()
            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1))); // recursively calling middleware.
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}


/*
*  This is a cluster fuck if stuff I don't know well enough.
*

function onFinished(res: http.ServerResponse, listener: Function) { // listener == errorHandler
    // handels both websockets and normal http requests on Github.
    if (isFinished(res) === true) {
        defer(listener, null, res);
        return res;
    }

    attachListener(res, listener);

    return res;
}

function isFinished(msg: http.ServerResponse): boolean {
    var socket = msg.socket; // where does this come from?

    if (typeof msg.finished === 'boolean') {
        // OutgoingMessage
        return Boolean(msg.finished || (socket && !socket.writable))
    }
}

*/