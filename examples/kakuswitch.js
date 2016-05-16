/**
 * This example switches a KlikAanKlikUit switch on / off.
 */

var connector = require( '../pistation-connector-433' );

connector.enableKaku(20, 10, function() {console.log('Finished 1')});
connector.disableKaku(20, 10, function() {console.log('Finished 2')});
connector.enableKaku(20, 10, function() {console.log('Finished 3')});
connector.disableKaku(20, 10, function() {console.log('Finished 4')});
connector.enableKaku(15837594, 0, 15, function() {console.log('Dimmed')});

setTimeout(function() {
    connector.dimKaku(15837594, 0, 5, function() {console.log('Dimmed')});
    setTimeout(function() {
        connector.disableKaku(15837594, 0, function() {console.log('Enabled')});
        setTimeout(function() {
            connector.enableKaku(15837594, 0, function() {console.log('Enabled')});
            setTimeout(function() {
                connector.dimKaku(15837594, 0, 0, function() {console.log('Dimmed')});
            }, 5000);
        }, 5000);
    }, 5000);

}, 5000);