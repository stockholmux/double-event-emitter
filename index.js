const
    redis = require('redis'),
    commanderRedis = require('./commander-redis.js'),
    client = redis.createClient(commanderRedis),
    EventEmitter2 = require('eventemitter2').EventEmitter2,
    express = require('express'),

    emitter  = new EventEmitter2({
        wildcard : true,
        maxListeners: 0
    }),
    app = express(),
    port = 3000;
require('express-ws')(app);

client.psubscribe('addr:*');

client.on('pmessage',(pattern, channel, message) => {
    emitter.emit(channel,message);
    emitter.emit('addr:XX',message);
});

app.ws('/addresses/', (ws, req) => {
    const states = req.query.states.split(' ');
    const sendToWebSocket = (msg) => {
        ws.send(msg);
    }

    //add listeners 
    states.forEach((stateAbbr) => {
        emitter.on(`addr:${stateAbbr}`, sendToWebSocket);
    });

    //clean up any listeners if the websocket is closed.
    ws.on('close',() => {
        states.forEach((stateAbbr) => {
            emitter.off(`addr:${stateAbbr}`, sendToWebSocket);
        });
    });
});

app.use(express.static('dist'));
app.listen(port, () => console.log(`Combo HTTP/WS Server on ${port} is ready.`));




