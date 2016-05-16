#include <node.h>
#include <v8.h>

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
#include "433connector.h"

using namespace v8;

Handle<Value> Test_Function( const Arguments& args ) {
    HandleScope scope;
    return scope.Close( Number::New( 123456 ) );
}


void init(Handle<Object> target) {
    /*if( -1 == wiringPiSetup() ) {
        ThrowException( Exception::TypeError( String::New( "Bad argument type" ) ) );
        return;
    }*/

    target->Set(String::NewSymbol("test_function"),
                FunctionTemplate::New(Test_Function)->GetFunction());
}
//NODE_MODULE(pistation-connector-433, init)