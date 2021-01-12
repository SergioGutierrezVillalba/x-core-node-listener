const http = require('http');
const ContactService = require('./service/contact');
const NodeListener = require('./utils/listener');
const commands = require('./commands');

const messages = {
    error: {
        spawn: ({ id }) => {
            return `There was an error spawning listener for node ${id}`;
        },
        /* Not a Node, haha */
        NaN: ({ fakeNode }) => {
            return 'Value received is not a node, received ->' + fakeNode;
        },
        multipleInits: () => {
            return 'Server already initialized'
        }
    }
}

class Server {

    constructor (protocol = http) {
        this._protocol = protocol;
        this._port = process.env.SERVER_PORT;
        this._hostname = process.env.SERVER_HOST;
        this._instance = null;
        this._initialized = false;
        this._nodeListeners = [];
    }

    init () {
        if(this._initialized) {
            console.log(messages.error.multipleInits());
        } else {
            return new Promise((res, rej) => {
                this._instance = this._protocol.createServer(res);
                this._initialized = true;
            });
        } 
    }

    listen () {
        this._instance.listen(this._port, this._hostname, () => {
            setInterval(() => {
                const contactService = new ContactService();
                contactService.getById({ id: nodeId }).then((response) => {
                    const node = response.data;
                    this.spawnNodeListener(node);
                })
            }, 10000);
        });
    }

    spawnNodeListener (node) {
        try {
            const nodeListener = new NodeListener(node);
            nodeListener.setCommands(commands).listen({ each: 15000 });
            this._nodeListeners.push(nodeListener);
        } catch (e) {
            if(node && node.id) {
                console.log(messages.error.spawn({ id: node.id }));
            } else {
                console.log(messages.error.NaN({ fakeNode: node }));
            }
            process.exit(1);
        }
    }
}

module.exports = Server;