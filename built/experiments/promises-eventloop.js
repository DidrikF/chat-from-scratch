exports;
const p1 = new Promise((resolve, reject) => {
    console.log('Promise 1');
    setTimeout(() => {
        console.log('setTimeout 1');
        resolve(); // queued(1) queuing chained then callback (calling resolve() is not synchronous)
    }, 0);
    setImmediate(() => {
        console.log('setImmediate 1');
    });
    // return undefined
}).then(() => {
    console.log('Then 11');
    setImmediate(() => {
        console.log('setImmediate 2');
    });
    return 'hi from then 11'; //queued(3) this string is wrapped in Promise.resolve(), which is async, and the next then callback is queued
}).then((message) => {
    console.log('Then 12');
    console.log(message);
});
const p2 = new Promise((resolve, reject) => {
    console.log('Promise 2');
    setTimeout(() => {
        console.log('setTimeout 2');
        resolve(); // queued(2) queuing chained then callback (calling resolve() is not synchronous)
    }, 0);
    // return undefined
}).then(() => {
    console.log('Then 21');
    return 'hi from then 21'; // queued(4)
}).then((message) => {
    console.log('Then 22');
    console.log(message);
});
console.log('Hello from script!');
/*
Promise 1
Promise 2
Hello from script!
setTimeout 1
setTimeout 2
Then 11
Then 21
Then 12
hi from then 11
Then 22
hi from then 21
setImmediate 1
setImmediate 2


*/ 
//# sourceMappingURL=promises-eventloop.js.map