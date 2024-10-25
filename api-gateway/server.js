const gateway = require('fast-gateway');
const cors = require('cors');

const port = 9001;

const server = gateway({
    beforeHandler: (req, res) => {
        cors()(req, res, () => {});
    },
    routes: [
        {
            prefix: '/usuarios',
            target: 'http://localhost:8081/',
            hooks: {}
        },
        {
            prefix: '/productos',
            target: 'http://localhost:8082/',
            hooks: {}
        }
    ]
});

server.start(port).then(server => {
    console.log('Gateway ejecutándose en el puerto: ' + port);
});
