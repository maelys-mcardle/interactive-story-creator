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
                    pageIndex, textIndex, text.choice );
            });
        });
    });
    
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

function processLinkOnPage( story, chapterIndex, pageIndex, linkIndex, link )
{
    // Grab the target address.
    link.target = processTarget( story, chapterIndex, pageIndex, link.target );
    
    // Update the link.
    story.chapters[ chapterIndex ].pages[ pageIndex ].links[ linkIndex ] = link;
    
    return story;
}

function processChoiceOnPage( story, chapterIndex, pageIndex, textIndex, choice )
{
    // Grab the target address.
    choice.target = processTarget( story, chapterIndex, pageIndex, choice.target );
    
    // Update the choice.
    story.chapters[ chapterIndex ].pages[ pageIndex ].texts[ textIndex ].choice = choice;
    
    return story;
}

function processTarget( story, currentChapterIndex, currentPageIndex, target )
{
    /*
     *  Target Examples:
     * 
     *     last
     *     next
     *     next #2
     *     [Chapter Title]
     *     [Time]
     *     [Time] #2
     *     [Chapter Title] : [Time]
     *     [Chapter Title] : [Time] : [Location]
     *     [Chapter Title] : [Time] : [Location] #2
     *
     */
     
    // Make path case insensitive.
    var path = caseInsensitive( target.path );    
    var matchIncrementDetails = parseMatchIncrement( path );
    var pathWithoutIncrement = matchIncrementDetails.pathWithoutNumber;
    var matchIncrement = matchIncrementDetails.matchNumber;
    
    // Find the desired target.
    if ( !path ) {
        target = createTarget( path, false );
        
    } else if ( pathWithoutIncrement === caseInsensitive( "next" ) ) {
        target = processRelativePath( story, currentChapterIndex, 
            currentPageIndex, pathWithoutIncrement, matchIncrement );
            
    } else if ( pathWithoutIncrement === caseInsensitive( "last" ) ) {
        target = processRelativePath( story, currentChapterIndex, 
            currentPageIndex, pathWithoutIncrement, -matchIncrement );
            
    } else {
        
        // Locate the specified instance of the absolute path.
        target = processAbsolutePath( story, currentChapterIndex, 
            pathWithoutIncrement, matchIncrement );
    }
    
    return target;
}

function processRelativePath( story, currentChapterIndex, currentPageIndex, path, incrementOrDecrementBy )
{
    // For when you want to go up or down by a certain amount of pages from a
    // given chapter and page.
    
    var target = createTarget( path, false );
    
    // If the value increments, then this is about getting what's next.
    // If the value decrements, then this is about getting what's previous.
    var isNext = ( incrementOrDecrementBy >= 0 ) ? true : false;

    // Get the next or previous pages by the amount specified.
    for ( var count = 0; count < Math.abs( incrementOrDecrementBy ); count++ ) {
        
        target = getNextOrLastChapterAndPage( story, path, currentChapterIndex, 
            currentPageIndex, isNext );
            
        if ( target.found ) {
            currentChapterIndex = target.chapter;
            currentPageIndex = target.page;
        } else {
            break;
        }
    }
    
    return target;
}

function processAbsolutePath( story, currentChapterIndex, path, matchNumber )
{
    // For when you want to jump to a specific page.
    
    // Default target.
    var target = createTarget( path, false );
    
    // Get the tokens.
    var tokens = path.split( ":" );
    
    // For each token, trim.
    tokens = tokens.map( function( token ) { return token.trim() });
    
    // One token:
    //  - Chapter Title
    //  - Page Time
    //  - Page Location
    //
    // Two tokens:
    //  - Page Location & Page Time
    //  - Chapter Title & Page Location
    //
    // Three tokens:
    //  - Chapter Title, Page Location & Page Time
    //

    var chapterIndex = -1;
    var pageIndices = [];
    
    if ( tokens.length === 1 ) {
        
        // Single token. Assume it's a page time.
        chapterIndex = currentChapterIndex;
        pageIndices = findPagesInChapter( story, currentChapterIndex, 
            tokens[0], "" );
        
        // Page not found. Maybe it's a location.
        if ( pageIndices.length === 0 ) {
            pageIndices = findPagesInChapter( story, currentChapterIndex, "",
                tokens[0] );
        }
        
        // Page not found. Maybe it's a chapter name.
        if ( pageIndices.length === 0 ) {
             chapterIndex = findChapter( story, tokens[0] );
             pageIndices = [0];
        }
        
    } else if ( tokens.length === 2 ) {
        
        // Assume it's a page time and location.
        chapterIndex = currentChapterIndex;
        pageIndices = findPagesInChapter( story, currentChapterIndex, 
            tokens[0], tokens[1] );
            
        // Not found. 
        if ( pageIndices.length === 0 ) {
            
            // The first token must be a chapter name.
            chapterIndex = findChapter( story, tokens[0] );
            
            // Chapter found.
            // The second token must be a page name in that chapter.
            if ( chapterIndex >= 0 ) {
                pageIndices = findPagesInChapter( story, chapterIndex, 
                    tokens[1], "" );
            }
        }
        
    } else if ( tokens.length === 3 ) {
        
        // The first token must be a chapter name.
        chapterIndex = findChapter( story, tokens[0] );
        
        // Chapter found.
        // The second token must be a page time, and the third a page location.
        if ( chapterIndex >= 0 ) {
            pageIndices = findPagesInChapter( story, chapterIndex, 
                tokens[1], tokens[2] );
        }
    }
    
    // Found as either a page or chapter name. Target found.
    if ( chapterIndex >= 0 && matchNumber - 1 < pageIndices.length ) {
        target.found = true;
        target.chapter = chapterIndex;
        target.page = pageIndices[ matchNumber - 1 ];
    
    } else {
        
        appendCodeWarning( path, 
            "Could not find the #" + matchNumber + " match for the " +
            "target provided. The tokens detected were " + 
            tokens.join(", ") + " and they did not match " + 
            "up to chapter titles, or time or location on pages." );    
    }
    
    return target;
}

function findChapter( story, title )
{
    for ( var chapterIndex = 0; 
          chapterIndex < story.chapters.length; 
          chapterIndex++ ) {
              
        if ( caseInsensitive( title ) === 
             caseInsensitive( story.chapters[ chapterIndex ].title ) ) {
                 
            return chapterIndex;
        }
    }
    
    // No matches found.
    return -1;
}

function findPagesInChapter( story, chapterIndex, time, location )
{
    var chapter = story.chapters[ chapterIndex ];
    var pageIndices = [];
    
    // Go through each page in a given chapter.
    // Only bother if time or location is specified.
    for ( var pageIndex = 0; 
          pageIndex < chapter.pages.length &&
          ( time !== "" || location !== "" );
          pageIndex++ ) {
              
        var page = chapter.pages[ pageIndex ];
        
        // Compare only if the value is specified.
        if ( ( time === "" ||
               ( caseInsensitive( page.time ) === 
                 caseInsensitive( time ) ) ) &&
             ( location === "" ||
               ( caseInsensitive( page.location ) === 
                 caseInsensitive( location ) ) ) ) {
        
            pageIndices.push ( pageIndex );
        }
              
    }
    
    // Return list of matches.
    return pageIndices;
}

function parseMatchIncrement( path )
{
    // If the path ends with #<Number> then the match number to get is
    // that number, otherwise it's assumed to be the first match (1.)
    
    var positionOfNumberSign = path.lastIndexOf( "#" );
    
    if ( positionOfNumberSign >= 0 ) {
        var matchNumber = parseInt( path.substring( positionOfNumberSign + 1) );
        if ( Number.isInteger( matchNumber ) ) {
            return {
                pathWithoutNumber: path.substring( 0, positionOfNumberSign ).trim(),
                matchNumber: matchNumber,
            }
        } else {
            // There's a # in a target, but no valid number that follows.
            // This should be identified as a malformed link.
            appendCodeWarning( path, 
                "Contains a #, but no number follows it. Instead " +
                "it's '" + path.substring( positionOfNumberSign ) + "'." +
                "Please remove the # or have a number follow it. Numbers " +
                "are used to say okay, I want the 2nd, 3rd, 4th, etc. match." );
        }
    }
    
    return {
        pathWithoutNumber: path,
        matchNumber: 1
    };
}

function getNextOrLastChapterAndPage( story, path, initialChapterIndex, initialPageIndex, isNext )
{
    var incrementOrDecrementBy = ( isNext ) ? +1 : -1;
    
    // Start at the current chapter.
    // When this chapter is exhausted, go up or down one,
    // until all chapters have been explored.
    for ( var chapterIndex = initialChapterIndex; 
              chapterIndex >= 0 && 
              chapterIndex < story.chapters.length; 
              chapterIndex += incrementOrDecrementBy ) {
              
        // The initial page is, if we're on the same chapter we started with,
        // the immediate next or previous page. Otherwise, it's the first page
        // of the next chapter (if we're incrementing) or the last page of the 
        // previous chapter (if we're decrementing).
        var startPage = 
            ( chapterIndex === initialChapterIndex ) ?
                initialPageIndex + incrementOrDecrementBy :
                    ( isNext ? 
                        0 : 
                        story.chapters[ chapterIndex ].pages.length - 1 );
        
        // Go up or down a page, until all have been exhausted in this chapter.
        for ( var pageIndex = startPage;
                  pageIndex >= 0 &&
                  pageIndex < story.chapters[ chapterIndex ].pages.length; 
                  pageIndex += incrementOrDecrementBy ) {
                      
            if ( doesChapterAndPageExist( story, chapterIndex, pageIndex ) ) {
                return createTarget( path, true, chapterIndex, pageIndex );
            }
        }
    }

    return createTarget( path, false );
}

function doesChapterAndPageExist( story, chapterIndex, pageIndex )
{
    return ( chapterIndex >= 0 && 
             chapterIndex < story.chapters.length &&
             pageIndex >= 0 &&
             pageIndex < story.chapters[ chapterIndex ].pages.length );
}
