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

function Message(address, unit, onoff, callback) {

    this.repeat = configuration.repeat;
    this.address = address;
    this.unit = unit;
    this.onoff = onoff;
    this.callback = callback;
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
 * @param callback
 */
module.exports.enableKaku = function (address, unit, callback) {
    messageQueue.push(new Message(address, unit, 'on', callback));
    runQueue();
};

/**
 * Disable a KaKu device
 * @param address
 * @param unit
 * @param callback
 */
module.exports.disableKaku = function (address, unit, callback) {
    messageQueue.push(new Message(address, unit, 'off', callback));
    runQueue();
};

/**
 * Dim a KaKu device
 * @param address
 * @param unit
 * @param dim
 * @param callback
 */
module.exports.dimKaku = function (address, unit, dim, callback) {
    dim = parseFloat(dim);
    if (dim < 0 || dim > 15) {
        console.error('Invalid argument for "dim". Should be >= 0 && <= 15');
        return;
    }
    messageQueue.push(new Message(address, unit, dim, callback));
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

    //console.log(cmd);
    exec(cmd, function (err, stdout, stderr) {
        if (err) {
            console.error(err);
        }
        if (typeof(m.callback) == 'function') {
            m.callback();
        }
        callback();
    });
}

