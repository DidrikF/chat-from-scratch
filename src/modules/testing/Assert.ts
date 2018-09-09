// export {};
// https://nodejs.org/dist/latest-v10.x/docs/api/assert.html
// const Results = require('./Results');

import { captureStack } from './helpers';
import { TestCollection } from './TestCollection';


export default class Assert {

    testCollection: TestCollection;
    currentTestName: string;
    value: any;
    captureResult: Function;
    notIsSet: boolean;
    
    constructor (testCollection: TestCollection) {
        this.testCollection = testCollection;
        this.currentTestName = "";
        this.value = null;
        this.notIsSet = false;
        // this.captureResult = this.testCollection.runningTest.captureAssertionResult;
    }

    toBe(val: any) {
        if (this.notIsSet) {
            if (this.value !== val) {
                this.testCollection.runningTest.captureAssertionResult(true, `Successfully asserted that ${JSON.stringify(this.value)} === ${JSON.stringify(val)}`, this.value, val);
            } else {
                this.testCollection.runningTest.captureAssertionResult(false, `Failed to assert that ${JSON.stringify(this.value)} === ${JSON.stringify(val)}`, this.value, val);
            }
        } else {
            if (this.value === val) {
                this.testCollection.runningTest.captureAssertionResult(true, `Successfully asserted that ${JSON.stringify(this.value)} === ${JSON.stringify(val)}`, this.value, val);
            } else {
                this.testCollection.runningTest.captureAssertionResult(false, `Failed to assert that ${JSON.stringify(this.value)} === ${JSON.stringify(val)}`, this.value, val);
            }
        }
    }


    arrayEquals (arr: any[]) {
        if (arraysEqual(this.value, arr)) {
            this.testCollection.runningTest.captureAssertionResult(true, `Successfully asserted that array ${JSON.stringify(this.value)} equals array ${JSON.stringify(arr)}`, this.value, arr);
        } else {
            this.testCollection.runningTest.captureAssertionResult(true, `Failed to asserted that array ${JSON.stringify(this.value)} equals array ${JSON.stringify(arr)}`, this.value, arr);
        }
    }

    toBeInstanceOf (val: any) {
        if (this.value instanceof val) {
            this.testCollection.runningTest.captureAssertionResult(true, `Successfully asserted that ${JSON.stringify(this.value)} is an instance of ${JSON.stringify(val)}`, this.value, val);
        } else {
            this.testCollection.runningTest.captureAssertionResult(true, `Failed to asserted that ${JSON.stringify(this.value)} is an instance of ${JSON.stringify(val)}`, this.value, val);
        }
    } 

    get not () {
        this.notIsSet = !this.notIsSet;
        return this;
    }
}



function arraysEqual (a: any[], b: any[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}