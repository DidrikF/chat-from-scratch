"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./modules/dotenv')();
const config = {
    testDir: process.env['TEST_DIR'],
    abortTestingOnExecFailure: process.env['ABORT_TESTING_ON_EXEC_FAILURE'] === 'true' ? true : false,
    abortTestingOnAssertionFailure: process.env['ABORT_TESTING_ON_ASSERTION_FAILURE'] === 'true' ? true : false,
};
exports.default = config;
//# sourceMappingURL=config.js.map