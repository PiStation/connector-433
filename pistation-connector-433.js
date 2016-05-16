'use strict'
const exec = require('child_process').exec;
var messageQueue = [];

var configuration = {
    //GPIO Pin on raspberry
    pinout: 15,

    //Repeat message
    repeat: 2
};

module.exports.setConfiguration = function (config) {
    configuration = config;
};

module.exports.getConfiguration = function () {
    return configuration;
};

module.exports.enableKaku = function (address, unit) {
    console.log('Enable adddr' + address + ' unit ' + unit);
};

function runQueue() {
    if (messageQueue.length > 0) {
        var currentMessage = messageQueue.pop();

    }
}

exec('sudo ./bin/433connector', (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
});