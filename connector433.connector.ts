import * as PiStation from "../../node_modules/pistation-definitions/PiStation.ts";
import {Connector} from "../../app/connector";
let exec = require('child_process').exec;
let sprintf = require('sprintf');

class Message {
    constructor(
        public address: string,
        public unit: string,
        public onoff: string,
        public callback: any,
        public repeat:number) {
        console.log('Message created: addr %s unit %s onoffdim %s repeated %s times');
    }
}

class Configuration {
    public pinout: number;
    public repeat: number;
    public binary: string;
}

export class Connector433 extends Connector {
    public configuration : Configuration;
    private messageQueue : Array<Message>;
    private runningMessages : boolean;

    constructor() {
        super('44mhz connector');

        //Default config;
        this.configuration = new Configuration();
        this.configuration.pinout = 15;
        this.configuration.repeat = 2;
        this.configuration.binary = './bin/433connector';

        this.runningMessages = false;
    }

    enableKaku(address: string, unit: string, callback: any): void {
        this.messageQueue.push(new Message(address, unit, 'on', callback, this.configuration.repeat));
        this.runQueue();
    }

    disableKaku(address: string, unit: string, callback: any): void {
        this.messageQueue.push(new Message(address, unit, 'off', callback, this.configuration.repeat));
        this.runQueue();
    }

    dimKaku(address: string, unit: string, dim:number, callback: any): void {
        if (dim < 0 || dim > 15) {
            console.error('Invalid argument for "dim". Should be >= 0 && <= 15');
            return;
        }
        this.messageQueue.push(new Message(address, unit, String(dim), callback, this.configuration.repeat));
        this.runQueue();
    }

    runQueue():void {
        if (this.messageQueue.length > 0 && this.runningMessages == false) {
            this.runningMessages = true;
            var currentMessage = this.messageQueue.shift();
            this.handleMessage(currentMessage, function () {
                this.runningMessages = false;
                this.runQueue()
            });
        }
    }

    handleMessage(m:Message, callback:any): void {
        console.log ('Execute message ' + cmd);
        var cmd = sprintf(
            'sudo %s %s %s %s %s %s',
            this.configuration.binary,
            this.configuration.pinout,
            m.repeat,
            m.address,
            m.unit,
            m.onoff
        );

        //console.log(cmd);
        exec(cmd, function (err, stdout, stderr) {
            console.log ('Executed!');
            if (err) {
                console.error(err);
            }
            if (typeof(m.callback) == 'function') {
                m.callback();
            }
            callback();
        });
    }
}