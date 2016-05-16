# connector-433
General 433 connector to use the 433 protocol for a variety of devices

# Installation
Here will be the installation guide for the hardware.

# Configuration
Some parameters you can configure;

```
    var connector433 = PiStationConnector('connector-433');
    connector433.setConfiguration({
        repeat: 2, //How many times to repeat the message. Increase this is messages do not seem to arrive every time. 2 or 3 should do.
        pinout: 15 //The GPIO pin to be used by WiringPi. 15 is the default - read the "installation" section down below.
    });
```

# Connector endpoints

## Kaku support
This module exports several functions to use the KaKu (KlikAanKlikUit) protocol.

**enableKaku**
```
    connector.enableKaku(
        int address,
        int unit,
        function callback
    );

    //Example:
    connector.enableKaku(20, 10, function() {console.log('Enabled unit 10 on address 20')});
```

**disableKaku**
```
    connector.disableKaku(
        int address,
        int unit,
        function callback
    );

    //Example:
    connector.disableKaku(20, 10, function() {console.log('Disabled unit 10 on address 20')});
```

**dimKaku**
```
    connector.dimKaku(
        int address,
        int unit,
        int dimminglevel, //0 to 15
        function callback
    );

    //Example:
    connector.disableKaku(20, 10, 6, function() {console.log('Dimmed unit 10 on address 20 to level 6')});
```