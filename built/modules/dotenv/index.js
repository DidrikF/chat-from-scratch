"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
function register() {
    const pathToEnv = path.resolve(process.cwd(), '.env');
    try {
        const parsed = parse(fs.readFileSync(pathToEnv));
        Object.keys(parsed).forEach((key) => {
            if (!process.env.hasOwnProperty(key)) {
                process.env[key] = parsed[key];
            }
        });
        return { parsed };
    }
    catch (err) {
        return { error: err };
    }
}
function parse(envFile) {
    const obj = {};
    const entries = envFile.toString().split('\n');
    entries.forEach((entry) => {
        const keyValueArr = entry.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/); // using capture groups
        if (keyValueArr != null) {
            let key = keyValueArr[1];
            let val = keyValueArr[2] || '';
            val = val.replace(/(^['"]|['"]$)/g, '').trim();
            obj[key] = val;
        }
    });
    return obj;
}
module.exports = register;
//# sourceMappingURL=index.js.map