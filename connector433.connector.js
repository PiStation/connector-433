var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var connector_1 = require("../../app/connector");
var Rx = require('rxjs/Rx');
var exec = require('child_process').exec;
var Message = (function () {
    function Message(address, unit, onoff, callback, repeat) {
        this.address = address;
        this.unit = unit;
        this.onoff = onoff;
        this.callback = callback;
        this.repeat = repeat;
    }
    return Message;
})();
var Configuration = (function () {
    function Configuration() {
    }
    return Configuration;
})();
var Connector433 = (function (_super) {
    __extends(Connector433, _super);
    function Connector433() {
        _super.call(this, 'connector-433');
        this.messageQueue = [];
        this.currentMessage = new Rx.Subject();
        //Default config;
        this.configuration = new Configuration();
        this.configuration.pinout = 15;
        this.configuration.repeat = 2;
        this.configuration.binary = './connectors/connector-433/bin/433connector'; //Based on API root... @todo?
        this.runningMessages = false;
    }
    Connector433.prototype.addMessage = function (message) {
        var _this = this;
        this.messageQueue.push(message);
        var messageExecuted = this.currentMessage
            .filter(function (current) { return current === message; })
            .first()
            .flatMap(function (message) { return _this.handleMessage(message); })
            .share() //handleMessage returns cold observable, so we need to make it hot to prevent multiple execution by every subscriber
            .first();
        messageExecuted.subscribe(function (output) {
            _this.runningMessages = false;
            _this.runQueue();
            console.log("Kaku message send, address: " + message.address + ", unit: " + message.unit);
        }, function (error) { return console.log('Kaku message failed', error); });
        return messageExecuted;
    };
    ;
    Connector433.prototype.enableKaku = function (address, unit, callback) {
        if (address === void 0) { address = '0'; }
        if (unit === void 0) { unit = '0'; }
        var message = new Message(address, unit, 'on', callback, this.configuration.repeat);
        var messageComplete = this.addMessage(message);
        this.runQueue();
        return messageComplete;
    };
    Connector433.prototype.disableKaku = function (address, unit, callback) {
        var message = new Message(address, unit, 'off', callback, this.configuration.repeat);
        this.addMessage(message);
    };
    Connector433.prototype.dimKaku = function (address, unit, dim, callback) {
        if (dim < 0 || dim > 15) {
            console.error('Invalid argument for "dim". Should be >= 0 && <= 15');
            return;
        }
        this.messageQueue.push(new Message(address, unit, String(dim), callback, this.configuration.repeat));
    };
    Connector433.prototype.runQueue = function () {
        var _this = this;
        if (this.messageQueue.length > 0 && this.runningMessages == false) {
            this.runningMessages = true;
            //add starting queue after current executing stack
            setTimeout(function () {
                _this.currentMessage
                    .next(_this.messageQueue.shift());
            }, 0);
        }
    };
    Connector433.prototype.handleMessage = function (m) {
        var command = "echo \"" + m.address + " " + m.unit + "\" > test.bak && cat test.bak && sleep 5";
        //let command = `${this.configuration.binary} ${this.configuration.pinout} ${m.repeat} ${m.address} ${m.unit} ${m.onoff}`;
        var executeCommand = Rx.Observable.bindNodeCallback(exec);
        var commandExecuted = executeCommand(command);
        return commandExecuted;
    };
    return Connector433;
})(connector_1.Connector);
exports.Connector433 = Connector433;
//# sourceMappingURL=connector433.connector.js.map