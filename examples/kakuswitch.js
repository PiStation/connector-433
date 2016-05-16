/**
 * This example switches a KlikAanKlikUit switch on / off.
 */

var connector = require( '../pistation-connector-433' );

connector.enableKaku(20, 10, function() {console.log('Finished 1')});
connector.disableKaku(20, 10, function() {console.log('Finished 2')});
connector.enableKaku(20, 10, function() {console.log('Finished 3')});
connector.disableKaku(20, 10, function() {console.log('Finished 4')});