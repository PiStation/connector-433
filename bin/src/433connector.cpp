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
    cout << "Usage: (Kaku only at the moment).\r\n ./433connector <pinout> <repeat> <address> <unit> <on|off|0-15 (dim)>\r\n";
}

int main(int argc, char* argv[])
{
    setbuf(stdout, NULL);
    if (argc != 6) {
        usage();
        exit(1);
    }
    int pinout = atoi(argv[1]);
    int repeat = atoi(argv[2]);
    int address = atoi(argv[3]);
    int unit = atoi(argv[4]);
    int onoff = argv[5];

    // load wiringPi
    if(wiringPiSetup() == -1) {
            printf("WiringPi setup failed. Maybe you haven't installed it yet?");
            exit(1);
    }

    // setup pin and make it low (otherwise transmitter will block other 433 mhz transmitters like remotes)
    pinMode(pinout, OUTPUT);
    digitalWrite(pinout, LOW);

    NewRemoteTransmitter Transmitter(address, pinout, 260, repeat);

    if (strcmp(onoff,"on") == 0) {
        cout << "Enable unit " << unit << " at address " << address << " over pin " << pinout << " repeating " << repeat << "times. \r\n";
        Transmitter.sendUnit(unit, true);
    } else if (strcmp(onoff,"off") == 0) {
        cout << "Disable unit " << unit << " at address " << address << " over pin " << pinout << " repeating " << repeat << "times. \r\n";
        Transmitter.sendUnit(unit, false);
    } else {
        cout << "Send dim level " << onoff << " to unit " << unit << " at address " << address << " over pin " << pinout << " repeating " << repeat << "times. \r\n";
        Transmitter.sendDim(unit, atoi(onoff));
    }

    return 0;
}

