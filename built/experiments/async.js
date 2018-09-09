"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const test = yield syncFunction();
        console.log(test);
        const test2 = yield asyncFunction();
        console.log(test2);
    });
}
function syncFunction() {
    return 'hello world';
}
function asyncFunction() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(process.cwd(), '.env'), (err, data) => {
            if (err)
                reject(err);
            resolve(data.toString());
        });
    });
}
run();
//# sourceMappingURL=async.js.map