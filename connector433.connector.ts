declare var require : any;
import {Connector} from "../../app/connector";
import * as Rx from 'rxjs/Rx';
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
        this.configuration.binary = './connectors/connector-433/bin/433connector'; //Based on API root... @todo?
        this.runningMessages = false;
    }

    private addMessage(message : Message) {
        this.messageQueue.push(message);

        let messageExecuted =
            this.currentMessage
                .filter(current => current === message)
                .first()
                .flatMap((message) => this.handleMessage(message))
                .share() //handleMessage returns cold observable, so we need to make it hot to prevent multiple execution by every subscriber
                .first();

        messageExecuted.subscribe(
            (output) => {
                this.runningMessages = false;
                this.runQueue();

                console.log(`Kaku message send, address: ${message.address}, unit: ${message.unit}`)
            },
            (error) => console.log('Kaku message failed', error));

        return messageExecuted;
    };

    enableKaku(address: string = '0', unit: string = '0', callback?: any) {
        var message = new Message(address, unit, 'on', callback, this.configuration.repeat);
        let messageComplete = this.addMessage(message);

        this.runQueue();
        return messageComplete;
    }
    
    disableKaku(address: string = '0', unit: string = '0', callback?: any): void {
        var message = new Message(address, unit, 'off', callback, this.configuration.repeat);
        let messageComplete = this.addMessage(message);

        this.runQueue();
        return messageComplete;
    }

    dimKaku(address: string = '0', unit: string = '0', dim:number, callback?: any): void {
        if (dim < 0 || dim > 15) {
            console.error('Invalid argument for "dim". Should be >= 0 && <= 15');
            return;
        }
        var message = new Message(address, unit,  String(dim), callback, this.configuration.repeat);
        let messageComplete = this.addMessage(message);

        this.runQueue();
        return messageComplete;
    }

    runQueue():void {
        if (this.messageQueue.length > 0 && this.runningMessages == false) {
            this.runningMessages = true;

            //add starting queue after current executing stack
            setTimeout(()=>{
                this.currentMessage
                    .next(this.messageQueue.shift());
            }, 0)
        }
    }

    handleMessage(m:Message) {
        //let command = `echo "${m.address} ${m.unit}" > test.bak && cat test.bak && sleep 5`; // Debug
        let command = `${this.configuration.binary} ${this.configuration.pinout} ${m.repeat} ${m.address} ${m.unit} ${m.onoff}`;
        let executeCommand: (command : string) => Rx.Observable<any> = Rx.Observable.bindNodeCallback(exec);
        let commandExecuted = executeCommand(command);

        return commandExecuted;
    }
}