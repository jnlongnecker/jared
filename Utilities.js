let Depluralize = function( input ) {
    if ( input[ input.length - 1 ] === 's' )
        return input.substr( 0, input.length - 1 );
    return input;
}