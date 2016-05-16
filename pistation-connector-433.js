'use strict'
var exec = require('child_process').exec;
var sprintf = require('sprintf');
var messageQueue = [];
var runningMessages = false;

var configuration = {
    //GPIO Pin on raspberry
    pinout: 15,

    //Repeat message
    repeat: 2
};

function Message(address, unit, onoff, repeat) {

    this.repeat = configuration.repeat;
    this.address = address;
    this.unit = unit;
    this.onoff = onoff;

    if (repeat != undefined) {
        this.repeat = repeat;
    }
}

module.exports.setConfiguration = function (config) {
    configuration = config;
};

module.exports.getConfiguration = function () {
    return configuration;
};

/**
 * Enable a KaKu device
 * @param address
 * @param unit
 * @param repeat [optional - uses config if not set]
 */
module.exports.enableKaku = function (address, unit, repeat) {
    messageQueue.push(new Message(address, unit, 'on', repeat));
    runQueue();
};

/**
 * Disable a KaKu device
 * @param address
 * @param unit
 * @param repeat [optional - uses config if not set]
 */
module.exports.disableKaku = function (address, unit, repeat) {
    messageQueue.push(new Message(address, unit, 'off', repeat));
    runQueue();
};

function runQueue() {
    if (messageQueue.length > 0 && runningMessages == false) {
        runningMessages = true;
        var currentMessage = messageQueue.shift();
        handleMessage(currentMessage, function() {runningMessages = false; runQueue()});
    }
}

function handleMessage(m, callback) {
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
            callback();
            return;
        }
        console.log(stdout);
        callback();
    });
}

