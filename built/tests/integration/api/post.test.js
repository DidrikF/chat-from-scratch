beforeEach(() => {
    log('file beforeEach');
});
afterEach(() => {
    log('file after each');
});
describe('it can call the api', () => {
    beforeAll(() => {
        log('decsribe before all');
    });
    test('can multiply two numbers', () => {
        const ans = 5 * 5;
        expect(ans).toBe(20);
    });
    test('can devide two numbers', () => {
        const ans = 5 / 5;
        expect(ans).toBe(1);
    });
});
test('can subtract two numbers', () => {
    let value = 10 - 5;
    expect(value).toBe(5);
    log('test');
});
test('can add two numbers', () => {
    let value = 10 + 5;
    expect(value).toBe(15);
});
//# sourceMappingURL=post.test.js.map