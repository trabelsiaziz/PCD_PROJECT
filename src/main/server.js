
import { join } from 'path';
const { exec,spawn } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const port = 5000; // Port for the local server
export async function executeCommand(command) {
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
        throw new Error(`Error executing command: ${stderr}`);
    }

}
