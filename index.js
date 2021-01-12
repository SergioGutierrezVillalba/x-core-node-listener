require('dotenv').config()
const axios = require('axios').default;
const http = require('http');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const COMMANDS = require('./commands');

const hostname = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;

const server = http.createServer((req, res) => {});

server.listen(port, hostname, () => {
    console.log('RUNNING!');
    const nodeId = process.env.NODE_ID;
    const url = `https://api.internxt.com/contacts/${nodeId}`;
    let timer = 60000 * 5; // 1min = 60000ms
    setInterval(async () => {
        axios.get(url).then((response) => {
            const nodeInfo = response.data;
            const { reputation } = nodeInfo;
            if(reputation < 1000) {
                await exec(COMMANDS.stop());
                await exec(COMMANDS.setINXTVar());
                await exec(COMMANDS.startDaemon());
                await exec(COMMANDS.startNode(nodeId, process.env.PATH_TO_CONFIG));
            }
        })
    }, 10000);
});