const ws = require("ws");
const http = require('http');

const server = http.createServer();

var wss = new ws.Server({ server });

let users = [
    {
        id: 1,
        username: 'paul',
        bez: 'Paul',
        count: 5
    },
    {
        id: 2,
        username: 'max',
        bez: 'Max',
        count: 5
    },
    {
        id: 3,
        username: 'carry',
        bez: 'Carry',
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

                        ws.id = users[i].id;

                        ws.send(JSON.stringify(json));
                        break;
                    }
                }

                break;
            }
            case 'add': {

                let from, to = -1;

                if (ws.id !== json.data.user) {
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].id === json.data.user) {
                            to = i;
                        } else if (users[i].id === ws.id) {
                            from = i;
                        }
                    }

                    if (from >= 0 && to >= 0) {
                        if (users[from].count > 0) {
                            users[from].count -= 1;
                            users[to].count += 1;

                            wss.clients.forEach((client) => {
                                json = {
                                    function: 'update',
                                    data: {
                                        users: [
                                            users[from],
                                            users[to]
                                        ]
                                    }
                                }
                                client.send(JSON.stringify(json));
                            });
                        }
                    }
                }

                break;
            }
            case 'update': {
                wss.clients.forEach((client) => {
                    if (client.id == json.data.user && client.readyState == WebSocket.OPEN) {
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