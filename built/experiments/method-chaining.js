exports;
const assertionObject = {
    value: null,
    results: [],
    toBe: function () {
        this.results.push(true);
    }
};
function expects(val) {
    assertionObject.value = val;
    return assertionObject;
}
expects(5).toBe(6);
console.log(assertionObject.results);
//# sourceMappingURL=method-chaining.js.map