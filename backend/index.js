const ws = require("ws");
const http = require('http');

const server = http.createServer();

var wss = new ws.Server({ server });

let users = [
    {

        id: 1,
        username: 'paul',
        bez: 'paul',
        count: 5
    },
    {
        id: 2,
        username: 'max',
        bez: 'Max',
        count: 5
    }

];

wss.on('connection', (ws, request) => {
    ws.on('message', (message) => {
        let json = JSON.parse(message.toString());

        var func = json.function;

        console.log(json.function.toString());

        switch (func) {
            case 'login': {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].username === json.data.username) {
                        json.data = users[i];

                        ws.send(JSON.stringify(json));
                        break;
                    }
                }

                break;
            }
            case 'update': {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });

                break;
            }
            case 'get': {
                // let json = {
                //     status: {
                //         code: 403,
                //         text: 'Forbidden'
                //     },
                //     function: 'get',
                //     data: {
                //         users: [
                //             
                //         ]
                //     }
                // }

                let json = {
                    function: 'get',
                    data: {
                        users: users
                    }
                }

                ws.send(JSON.stringify(json));

                break;
            }
        }


    });

    ws.on('close', (code, reason) => {
        console.log('connection closed: ', reason.toString());
    });

    let json = {
        function: 'connected'
    };

    ws.send(JSON.stringify(json));
    console.log('connected');
});


server.listen(8080, () => {
    console.log('Server started');
});