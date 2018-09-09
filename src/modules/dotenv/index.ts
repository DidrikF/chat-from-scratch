import * as path from 'path';
import * as fs from 'fs';

function register () {
    const pathToEnv = path.resolve(process.cwd(), '.env')
    try {
        const parsed: any = parse(fs.readFileSync(pathToEnv));
        Object.keys(parsed).forEach((key: string) => {
            if (!process.env.hasOwnProperty(key)) {
                process.env[key] = parsed[key];
            }
        });

        return { parsed };

    } catch (err) {
        return { error: err };
    }
}

function parse(envFile: Buffer): object {
    const obj: any = {};

    const entries = envFile.toString().split('\n');

    entries.forEach((entry: string) => {
        const keyValueArr = entry.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/); // using capture groups
        if (keyValueArr != null) {
            let key = keyValueArr[1];
            let val = keyValueArr[2] || '';
            val = val.replace(/(^['"]|['"]$)/g, '').trim()
            obj[key] = val;
        }
    });

    return obj;

}

module.exports = register;