"use strict";

function parseTargets( story )
{   
    // Traverse story and process the targets in links/choices.
    story.chapters.forEach( function( chapter, chapterIndex ) {
        chapter.pages.forEach( function( page, pageIndex ) {
            
            // Process links.
            page.links.forEach( function( link, linkIndex ) {
                story = processLinkOnPage( story, chapterIndex, 
                    pageIndex, linkIndex, link );
            });
            
            // Process choices.
            page.texts.forEach( function( text, textIndex ) {
                story = processChoiceOnPage( story, chapterIndex, 
                    pageIndex, textIndex, text );
            });
        });
    });
    
    return story;
}

function processLinkOnPage( story, chapterIndex, pageIndex, linkIndex, link )
{
    // Grab the target address.
    link.target = processTarget( story, chapterIndex, pageIndex, link.target );
    
    // Update the link.
    story.chapters[ chapterIndex ].pages[ pageIndex ].links[ linkIndex ] = link;
    
    return story;
}

function processChoiceOnPage( story, chapterIndex, pageIndex, textIndex, text )
{
    // Grab the target address.
    text.choice.target = processTarget( story, chapterIndex, pageIndex, 
        text.choice.target );
    
    // Update the text.
    story.chapters[ chapterIndex ].pages[ pageIndex ].tests[ textIndex ] = text;
    
    return story;
}

function createTarget( path, found, chapter, page )
{
    return {
        path: path,
        found: found,
        chapter: chapter,
        page: page,
    };
}

function processTarget( story, chapterIndex, pageIndex, target )
{
    /*
     *  Target Examples:
     * 
     *     last
     *     next
     *     [Day]
     *     [Time]
     *     [Time] #2
     *     [Day] > [Time]
     *     [Day] > [Time] : [Location]
     *     [Day] > [Time] : [Location] #2
     *
     */
     
    // Make path case insensitive.
    let path = caseInsensitive( target.path );
    let matchIncrement = getMatchIncrement( path );

    // Find the desired target.
    if ( path === "" ) {
        target = createTarget( path, false );
    } else if ( path === caseInsensitive( "next" ) ) {
        target = processRelativePath( story, chapterIndex, pageIndex, path, matchIncrement );
    } else if ( path === caseInsensitive( "last" ) ) {
        target = processRelativePath( story, chapterIndex, pageIndex, path, -matchIncrement );
    } else {
        target = processAbsolutePath( story, chapterIndex, pageIndex, path, matchIncrement );
    }
    
    return target;
}

function processRelativePath( story, chapterIndex, pageIndex, path, difference )
{
    return createTarget( path, false, 0, 0 );
}

function processAbsolutePath( story, chapterIndex, pageIndex, path, matchIncrement )
{
    return createTarget( path, false, 0, 0 );
}

function getMatchIncrement( path )
{
    // If the path ends with #<Number> then the match number to get is that
    // number, otherwise it's assumed to be the first match (1.)
    
    let placementOfPound = path.lastIndexOf( "#" );
    
    if ( placementOfPound >= 0 ) {
        let matchNumber = parseInt( path.slice( placementOfPound + 1) );
        if ( Number.isInteger( matchNumber ) ) {
            return matchNumber;
        }
    }
    
    return 1;
}

function doesChapterAndPageExist( story, chapterIndex, pageIndex )
{
    return ( ( 0 <= chapterIndex < story.chapters.length ) &&
             ( 0 <= pageIndex < story.chapters[ chapterIndex ].pages.length ) );
}
