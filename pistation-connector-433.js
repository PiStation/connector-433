'use strict'

var configuration = {};

module.exports.setConfiguration = function (config) {
    configuration = config;
};

module.exports.getConfiguration = function () {
    return configuration;
};