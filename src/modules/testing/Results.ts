import { getLocationOfLineInTest } from '../helpers';

type Result = {number: number, assertionNumber: number, test: string, message: string, location: string, file: string};
const colors = require('colors');

export default class Results {

    results: Result[];
    number: number;
    assertionNumber :number;

    constructor () {
        this.results = [];
        this.number = 0;
        this.assertionNumber = 1;
    }


    print () {
        let prevTest: string = this.results.length > 0 ? this.results[this.results.length-1].test : '';
        this.results.forEach((result: Result) => {
            if (prevTest !== result.test) {
                console.log(colors.bgBlue.underline(result.number + ') ' + result.test));
            }
            if (result.message === 'OK') {
                console.log(colors.green('   ' + result.assertionNumber + ') ' + result.message));
            } else {
                console.log(colors.red('   ' + result.assertionNumber + ') ' + result.message));
                console.log('    ' + result.location)
            }
            prevTest = result.test;
        })
    }

    async add (testName :string, message :string, stack: string[] = []) {
        let prevTestName = this.results.length > 0 ?  this.results[this.results.length-1].test : '';
        if (prevTestName !== testName) {
            this.number++;
            this.assertionNumber = 1;
        }

        const lineWithOriginalPosition = await getLocationOfLineInTest(stack)
        
        this.results.push({
            number: this.number,
            assertionNumber: this.assertionNumber,
            test: testName,
            message: message,
            location: lineWithOriginalPosition,
            file: "",
        })

        
        this.assertionNumber++;
    }   
}