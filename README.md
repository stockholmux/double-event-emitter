# double-event-emitter

Demo application to show how to deal with websockets and push data using a secondary event emitter to decouple the data from the connected websocket clients.

## Command Line Agruments
Both the traffic generator and the server use the same command line options:

``` 
--port <value> Redis Port
--auth <value> Redis "password"
--host <value> Redis hostname
```

## Start traffic generator

```
$ node traffic.js
```
(add any options as needed)

## Start server

```
$ node index.js
```

## Connect with browser

```
http://localhost:3000
```

In the text box, put states (in uppercase, seperated by commas)  (e.g. `TX,KY,WY`)

Then click "Start"

Instead of states, you can use the code "XX" which will get any address.
