import * as PiStation from "../../node_modules/pistation-definitions/PiStation.ts";
import {Connector} from "../../app/connector";
import * as Rx from 'rxjs/rx';
import * as RxNode from 'rx-node';
const exec = require('child_process').exec;
class Message {
    constructor(
        public address: string,
        public unit: string,
        public onoff: string,
        public callback: any,
        public repeat:number) {
    }
}

class Configuration {
    public pinout: number;
    public repeat: number;
    public binary: string;
}

export class Connector433 extends Connector {
    public configuration : Configuration;
    private messageQueue : Array<Message> = [];
    private currentMessage = new Rx.Subject<Message>();
    private runningMessages : boolean;


    constructor() {
        super('connector-433');

        //Default config;
        this.configuration = new Configuration();
        this.configuration.pinout = 15;
        this.configuration.repeat = 2;
        this.configuration.binary = './bin/433connector';
        this.runningMessages = false;

        //test
        this.enableKaku('1','1');

        this.enableKaku('2','1').subscribe((e)=>console.log('Now with observable update stream when message is send queue and update data from exec callback', e), (e)=>{console.log('erroorrrrrrrr', e)}, () => console.log('kaku message command completed!'));
    }

    private addMessage(message : Message) {
        this.messageQueue.push(message);

        let messageExecuted =
            this.currentMessage
                .filter(current => current === message)
                .flatMap((message) => this.handleMessage(message))
                .do(() => this.runningMessages = false)
                .do(()=>this.runQueue());

        messageExecuted.subscribe(
            (e) => console.log(`Kaku message send, address: ${message.address}, unit: ${message.unit}`),
            (error) => console.log('Kaku message failed', error));
        return messageExecuted;
    };

    enableKaku(address: string = '0', unit: string = '0', callback?: any) {
        console.log(this, this.messageQueue);
        var message = new Message(address, unit, 'on', callback, this.configuration.repeat);
        let messageComplete = this.addMessage(message);

        this.runQueue();
        return messageComplete;
    }


    disableKaku(address: string, unit: string, callback: any): void {
        var message = new Message(address, unit, 'off', callback, this.configuration.repeat);
        this.addMessage(message);
    }

    dimKaku(address: string, unit: string, dim:number, callback: any): void {
        if (dim < 0 || dim > 15) {
            console.error('Invalid argument for "dim". Should be >= 0 && <= 15');
            return;
        }
        this.messageQueue.push(new Message(address, unit, String(dim), callback, this.configuration.repeat));
        //this.runQueue();
    }

    runQueue():void {
        if (this.messageQueue.length > 0 && this.runningMessages == false) {
            this.runningMessages = true;

            this.currentMessage
                .next(this.messageQueue.shift());
        }
    }


    handleMessage(m:Message) {
        return Rx.Observable.timer(1000);

        //let command = `echo "${this.configuration.pinout}" > test.bak`;
        //let executeCommand: (command : string) => Rx.Observable<any> = Rx.Observable.bindNodeCallback(exec);
        //
        //let commandExecuted = executeCommand(command);
        //
        //return commandExecuted;
    }
}