#!/bin/bash

check_make_ok() {
  if [ $? != 0 ]; then
    echo "failed."
    echo ""
    echo "================================================================================"
    if [ $2 == 1 ]; then
      echo "FATAL: Making $1 failed."
    else
      echo "Making $1 failed."
    fi
    echo "Please check install.log and fix any problems. If you're still stuck,"
    echo "then please open a new issue then post all the output and as many details as you can to"
    echo "  https://github.com/eugeneware/wiring-pi/issues"
    echo "================================================================================"
    echo ""
    if [ $2 == 1 ]; then
      exit 1
    fi
  fi
}

check_git_clone() {
  if [ $? != 0 ]; then
    echo "failed."
    echo ""
    echo "================================================================================"
    echo "FATAL: Cloning libWiringPi failed."
    echo "Please check install.log and fix any problems. If you're still stuck,"
    echo "then please open a new issue then post all the output and as many details as you can to"
    echo "  https://github.com/eugeneware/wiring-pi/issues"
    echo "================================================================================"
    echo ""
    exit 1
  fi
}

rm ./install.log 2>/dev/null 1>&2

echo -n "Cloning libWiringPi ... "
rm -Rf ./wiringpi 2>/dev/null 1>&2
git clone https://github.com/nekuz0r/wiringpi.git -b 2.25 > ./install.log 2>&1
check_git_clone
#git submodule init
#check_git_clone
#git submodule update
#check_git_clone
echo "done."

echo -n "Making libWiringPi ... "
cd ./wiringpi/wiringPi/
make clean >> ../../install.log 2>&1
make static >> ../../install.log 2>&1
check_make_ok "libWiringPi" 1
cd ../../
echo "done."

echo -n "Making 433 connector ... "
cd bin/src
make 433connector >> ../../install.log 2>&1
make 433rgb >> ../../install.log 2>&1
check_make_ok "433 connector" 0
echo "done."

echo "Compiling of libraries finished"