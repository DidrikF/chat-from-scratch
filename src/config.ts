require('./modules/dotenv')();

const config = {
    testDir: process.env['TEST_DIR'],
    abortTestingOnExecFailure: process.env['ABORT_TESTING_ON_EXEC_FAILURE'] === 'true' ? true : false,
    abortTestingOnAssertionFailure: process.env['ABORT_TESTING_ON_ASSERTION_FAILURE'] === 'true' ? true : false,

}


export default config;