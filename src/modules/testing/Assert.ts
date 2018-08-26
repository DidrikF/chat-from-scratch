// export {};
// https://nodejs.org/dist/latest-v10.x/docs/api/assert.html
// const Results = require('./Results');

import Results from './Results';

export default class Assert {
    
    results: Results;
    currentTestName: string;
    
    constructor (results?: Results) {
        this.results = results || new Results();
        this.currentTestName = "";
    }

    async equal(a: any, b: any) {
        if (a === b) {
            await this.results.add(this.currentTestName, 'OK')
        } else {
            await this.results.add(this.currentTestName, a + ' is Not Equal to ' + b, captureStack())
        }
    }

    value(val: any) {
        this.value = val;
        return this;
    }

    toBe(val: any) {
        if (this.value === val) {
            this.results.add(this.currentTestName, 'OK')
        } else {
            this.results.add(this.currentTestName, this.value + ' is Not Equal to ' + val)
        }
    }

    
}


function captureStack (): string[]{
    let obj: {stack?: any} = {};
    Error.captureStackTrace(obj);
    return obj.stack.split('\n');
}
