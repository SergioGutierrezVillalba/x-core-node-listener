const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Bash {
    async static exec (command) {
        try {
            await exec(command);
        } catch (e) {
            console.log(`ERROR: ${e.message}`);
            process.exit(1);
        }
    }
}

module.exports = Bash;