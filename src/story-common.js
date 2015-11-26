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
    let splitString = string.split( divider );
    let left = splitString[0].trim();
    let right = splitString.slice( 1 ).join( divider ).trim();
    
    return { left: left, right: right };
}
