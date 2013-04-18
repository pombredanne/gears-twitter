/*jshint node:true*/
'use strict';

var mongoose = require( 'mongoose' );

// Need to capture database configurations from Stackato
var boundServices = process.env.STACKATO_SERVICES ? process.env.STACKATO_SERVICES : null;
console.log( boundServices );

// Make sure we only parse if we're on stackato
if( null !== boundServices ) {
    boundServices = JSON.parse( boundServices.replace( /\//g, '' ) );

    // TODO: Need to handle which db is being connected to better
    // this assumes only one db 
    var credentials = boundServices['persistence'];
    // generate mongo connection URI
    var connection = mongoose.createConnection( 'mongodb://' + credentials['username'] + ':' + credentials['password'] + '@' + credentials['hostname'] + ':' + credentials['port'] + '/' + credentials['db']
    );
} else {
    connection = mongoose.createConnection( 'localhost', 'persistence' );
}

connection.on( 'open', function() {
    console.log( 'Connection opened to mongodb' );
});

connection.on( 'error', function( err ) {
    console.log( err );
});

exports.connection = connection;
