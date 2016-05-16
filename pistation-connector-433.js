'use strict'
var exec = require('child_process').exec;
var sprintf = require('sprintf');
var messageQueue = [];

var configuration = {
    //GPIO Pin on raspberry
    pinout: 15,

    //Repeat message
    repeat: 2
};

class message {
    var repeat = configuration.repeat;
    var address;
    var unit;
    var onoff;

    constructor = function(address, unit, onoff, repeat) {
        if (repeat != undefined) {
            this.repeat = repeat;
        }
        this.address = address;
        this.unit = unit;
        this.onoff = onoff;
    }
}

module.exports.setConfiguration = function (config) {
    configuration = config;
};

module.exports.getConfiguration = function () {
    return configuration;
};

module.exports.enableKaku = function (address, unit) {
    messageQueue.push(new message(address, unit, 'on'));
    runQueue();
};

function runQueue() {
    if (messageQueue.length > 0) {
        var currentMessage = messageQueue.pop();
        handleMessage(currentMessage);
    }
}

function handleMessage(m) {
    var cmd = sprintf(
        'sudo ./bin/433connector %s %s %s %s %s',
        configuration.pinout,
        m.repeat,
        m.address,
        m.unit,
        m.onoff
    );

    console.log(cmd);
    exec(cmd, function (err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}

