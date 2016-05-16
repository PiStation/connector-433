#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <getopt.h>
#include <unistd.h>
#include <ctype.h>
#include <iostream>
#include <string.h>
#include <fcntl.h>           /* For O_* constants */
#include <sys/stat.h>        /* For mode constants */
#include <semaphore.h>
#include <stdio.h>
#include <fcntl.h>
#include <mqueue.h>
#include "RemoteSwitch.cpp"
#include "NewRemoteTransmitter.cpp"

using namespace std;

void usage() {
    cout << "Usage: (Kaku only at the moment). \r\n <binary> <pinout> <repeat> <address> <unit> <on|off|0-15 (dim)> ";
}

void setColorReal(int color, int value) {
    NewRemoteTransmitter TsetColor(ADDR_COLOR_SELECT, PIN_OUT, 260, REPEAT);
}

int main(int argc, char* argv[])
{
    setbuf(stdout, NULL);
    if (sizeof(argv) != 6) {
        usage();
        exit(1);
    }
    int pinout = atoi(argv[1]);
    int repeat = atoi(argv[2]);
    int address = atoi(argv[3]);
    int unit = atoi(argv[4]);
    int onoff = atoi(argv[5]);

    // load wiringPi
    if(wiringPiSetup() == -1) {
            printf("WiringPi setup failed. Maybe you haven't installed it yet?");
            exit(1);
    }

    // setup pin and make it low (otherwise transmitter will block other 433 mhz transmitters like remotes)
    pinMode(pinout, OUTPUT);
    digitalWrite(pinout, LOW);

    /*
    if (strcmp(argv[1],"program") == 0) {
        cout << "Switching to program " << argv[2];
        //TselectProgram.sendUnit(atoi(argv[2]), true);
    } else if (strcmp(argv[1],"color") == 0) {
        cout << "Set color " << argv[2] << " to " << argv[3];
        //setColorReal(atoi(argv[2]), atoi(argv[3]));
    } else if (strcmp(argv[1],"config") == 0) {
        cout << "Set config " << argv[2] << " to " << argv[3];
        //TsetConfig.sendDim(atoi(argv[2]), atoi(argv[3]));
    } else {
        usage();
    }
    */
    return 0;
}

