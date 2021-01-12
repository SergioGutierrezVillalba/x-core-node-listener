const Bash = require('./bash');
const COMMANDS = require('../commands');

class NodeListener {
    constructor (node = { id: false }, commander = Bash) {
        if(node && node.id) {
            this._node = node;
            this._interval = null;
            this._alias = `[ Listener-${this._node.id} ]`;
            this._commander = commander;
            this._commands = null;
        } else {
            throw new Error('Please send a node instead of a nullable value');
        }   
    }

    setCommands (commands = COMMANDS) {
        this._commands = commands;
        return this;
    }

    async listen ({ each }) {
        this._interval = setInterval(() => {
            if(this._node.reputation < 1000) {
                // Can't execute an stop even if the daemon is running. Seems that child_process can't access to it.
                // await this._commander.exec(this._commands.stop());
                await this._commander.exec(this._commands.setINXTVar());
                await this._commander.exec(this._commands.startDaemon());
                await this._commander.exec(this._commands.startNode(this._node.id, process.env.PATH_TO_CONFIG));
            }
        }, each);
    }

    stop () {
        if(this._interval) {
            clearInterval(this._interval);
            console.log(`[${this._alias}]: Stopped.`);
        } else {
            console.log(`[${this._alias}]: Not listening yet!`);
        }
    }
}

module.exports = NodeListener;