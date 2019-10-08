const
    faker = require('faker'),
    redis = require('redis'),
    commanderRedis = require('./commander-redis.js'),
    client = redis.createClient(commanderRedis),
    publishAddress = () =>{
        const stateAbbr = faker.address.stateAbbr();
        client.publish(`addr:${stateAbbr}`, `${faker.address.streetAddress()}, ${faker.address.city()}, ${stateAbbr}`);
    }

//IIFE
(function loop() {
    const rand = Math.round(Math.random() * (150 - 10)) + 10;
    setTimeout(() => {
        publishAddress();
        loop();  
    }, rand);
}());