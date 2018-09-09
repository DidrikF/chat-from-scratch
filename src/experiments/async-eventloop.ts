import * as fs from "fs";



function asyncFsReaddir(dir: string, num: number) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            /*
            setImmediate(() => {
                console.log('setImmediate '+ num)
            });
            */
            console.log('Fs readdir done in middleware ' + num)
            if (err) reject(err);
            else resolve(files); // queues up
        })
    })
}

let ctx: {status: number, data: string[]} = {
    status: 404,
    data: [],
}

let counter = 0;

async function middleware (ctx: any, next: Function) {
    counter++;
    console.log('Started middleware '+ counter);
    const files = await asyncFsReaddir('.', counter);
    ctx.data.push('hi from '+ counter);
    await next(); // next is the next middleware in the stack, and must return a promise! async functions does this implicity, but normal functions does not, this is why you must remember to return a promise in your "normal" middleware functions.
    console.log('Ended middleware '+ counter);
    counter--;
}

function syncMiddleware(ctx: any, next: Function) { // this sort of works, meaning it wont throw an error, but is not recommended! No documentation of it, makes things work unpredicably.
    console.log('Sync middleware')
    // next() // not calling next, will cause the middleware chian to unwind! calling next will continue the chain and the final handler is reached before all operations in middleware is completed.
}

async function middlewareWithoutNext (ctx: any, next: Function) {
    console.log('middlware witout next');
}

async function errorMiddleware (ctx: any, next: Function) {
    counter++;
    console.log('Started middleware '+ counter);
    //return Promise.resolve('promise.resolve in middleware') // what happens here?
    throw Error('Error in middleware ' + counter)
    await next();
    console.log('Ended middleware '+ counter);
    counter--;
}

function end (ctx: any) {
    console.log('Reached the end!')
    console.log(ctx)
}

const middlewareArray = [
    middleware,
    middleware,
    // syncMiddleware, //  this sort of works, meaning it wont throw an error, but is not recommended! No documentation of it, makes things work unpredicably.
    // middlewareWithoutNext, // ends the middlware chain, and resumes execution upstream.
    // errorMiddleware, // stops the chain, gives control to the last catch block, and you cannot resume. (What does Koa do here? does it send a response?)
    middleware,
]

function compose(middleware: Function[]) {

    return function (ctx: any, next?: any) { // does not execute yet

        let index = -1 // shared between all the middleware functions
        
        return dispatch(0)
        
        function dispatch (i: number) { // there is closure over this function
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            console.log(i, index);
            console.log(middleware[i])
            index = i // 0 = 0
            let fn = middleware[i] //middleware[0], at middleware[middleware.length+1] === undefined
            if (i === middleware.length) { // this condition as no effect in Koa, it simply allows you to pass in "midddlware" function to run at the end of the chain when running the function that invokes all the middleware.
                console.log("i === middleware.length")
                console.log(next)
                fn = next // when out of middleware, set fn = next, so that we can resume the last middleware function
            }
            if (!fn) {
                console.log('exeeded the middleware stack, returning Promise.resolve()')
                return Promise.resolve() // at i = middleware.length + 1, 
            }
            try {                       //ctx  //next
                // We wrap the result fn in a promise, to support both async and normal functions! Since normal functions does not implicity return promises (async functions does). Await require a promise to be returned!
                return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1))); // recursively calling middleware.
                                      // async functions implicitly return promises.
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}

const mf = compose(middlewareArray);


//mf is not an async function, so it will execute as much it is able to, until it reaches an async call, at which point node jumps out and starts running the rest of the script.

mf(ctx, async (ctx: any, next: Function) => {
    console.log("Hey, I'm not even used in Koa");
    await next();
    // await next(); trows an error, you can place this anywhare in the upstream chain and it will react when you get to the middlware that contains the violation.
    console.log("End of 'im not even used'")
}).then(end.bind(null, ctx)).catch((err) => {
    console.log('Error caught in last catch block')
    console.log(err)
    return Promise.resolve();
});
//.then() - you can continue chaing then methods here, but you cannot go back up and resume the promise chain after an error was caught.

console.log(' Hello from the script! ') // printed after 'started middleware 1'


// in Koa mf is called many times, once for each request. But because all heavy work is done asyncrounously, the single v8 thread is not blocked despite many concurrent requests being handled!

/*

middleware 0



mid 1 start
    next->dispatch()
    mid 2 start
        next->dispatch()
        mid 3 start
            next->dispatch()
            mid 3 continut
            return Promise.resolve()
        mid 2 continue
        return Promise.resolve()
    mid 1 continue
    return Promise.resolve()
.then(compose_and_send_response).catch(deal_with_error_from_anywhere_in_the_stack) 
            
*/
