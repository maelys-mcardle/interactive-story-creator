"use strict";

function everythingAfterSubstring( substring, string )
{
    return string.slice( substring.length ).trim();
}

function caseInsensitive( string )
{
    return string.toUpperCase();
}

function splitInTwoParts( divider, string )
{
    var splitString = string.split( divider );
    var left = splitString[0].trim();
    var right = splitString.slice( 1 ).join( divider ).trim();
    
    return { left: left, right: right };
}

function rightTrim( string )
{
    for ( var i = string.length - 1; i >= 0; i-- ) {
        if ( string[ i ] !== " " &&
             string[ i ] !== "\t" &&
             string[ i ] !== "\n" ) {
            return string.substring( 0, i + 1 );
        }
    }
    
    return "";
}
