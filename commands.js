const COMMANDS = {
    startDaemon: () => {
        return "xcore daemon"
    },
    startNode: (pathToConfigFolder, nodeId) => {
        return `xcore start -c ${pathToConfigFolder}/${nodeId}.json`;
    },
    stop: () => {
        return "xcore killall";
    },
    setINXTVar: () => {
        return "EXPORT STORJ_NETWORK=INXT"
    }
}

module.exports = COMMANDS;