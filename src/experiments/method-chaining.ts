exports

const assertionObject: any = {
    value: null,
    results: [],
    toBe: function () {
        this.results.push(true);
    }
}

function expects (val: any) {
    assertionObject.value = val

    return assertionObject;
}

expects(5).toBe(6);


console.log(assertionObject.results)