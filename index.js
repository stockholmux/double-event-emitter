const
    redis = require('redis'),
    commanderRedis = require('./commander-redis.js'),
    client = redis.createClient(commanderRedis),
    EventEmitter2 = require('eventemitter2').EventEmitter2,
    emitter  = new EventEmitter2({
        wildcard : true
    }),
    express = require('express'),
    app = express(),
    port = 3000;

require('express-ws')(app);

client.psubscribe('addr:*',() => {
    console.log('listening...');
});

client.on('pmessage',(pattern, channel, message) => {
    emitter.emit(channel,message);
});

app.ws('/addresses/', (ws, req) => {
    const states = req.query.states.split(' ')
    const sendToWebSocket = (msg) => {
        ws.send(msg);
    }

    states.forEach((stateAbbr) => {
        emitter.on(`addr:${stateAbbr}`, sendToWebSocket);
    });

    //clean up any listeners if the websocket is closed.
    ws.on('close', function open() {
        states.forEach((stateAbbr) => {
            emitter.off(`addr:${stateAbbr}`, sendToWebSocket);
        });
    });
});

app.use(express.static('public'))
app.listen(port, () => console.log(`Combo HTTP/WS Server on ${port} is ready.`))