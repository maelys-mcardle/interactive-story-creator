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
    if ( !path ) {
        target = createTarget( path, false );
        
    } else if ( path === caseInsensitive( "next" ) ) {
        target = processRelativePath( story, currentChapterIndex, 
            currentPageIndex, path, matchIncrement );
            
    } else if ( path === caseInsensitive( "last" ) ) {
        target = processRelativePath( story, currentChapterIndex, 
            currentPageIndex, path, -matchIncrement );
            
    } else {
        
        // Locate the first instance of the absolute path.
        target = processAbsolutePath( story, currentChapterIndex, path );
        
        // Increment up and down, if need be.
        if ( target.found && matchIncrement > 1 ) {
            
            target = processRelativePath( story, target.chapter, 
                target.page, path, matchIncrement );
        
        }
    }
    
    return target;
}

function processRelativePath( story, currentChapterIndex, currentPageIndex, path, incrementOrDecrementBy )
{
    // For when you want to go up or down by a certain amount of pages from a
    // given chapter and page.
    
    let target = createTarget( path, false );
    
    // If the value increments, then this is about getting what's next.
    // If the value decrements, then this is about getting what's previous.
    let isNext = ( incrementOrDecrementBy >= 0 ) ? true : false;
    
    // Get the next or previous pages by the amount specified.
    for ( let count = 0; count < Math.abs( incrementOrDecrementBy ); count++ ) {
        target = getNextOrLastChapterAndPage( story, path, currentChapterIndex, 
            currentPageIndex, isNext );
    }
    
    return target;
}

function processAbsolutePath( story, currentChapterIndex, path )
{
    // For when you want to jump to a specific page.
    
    // Default target.
    let target = createTarget( path, false );
    
    // Get the tokens.
    let tokens = path.split( ">" );
    
    // For each token, trim.
    tokens = tokens.map( function( token ) { return token.trim() });
    
    // Remove the match increment from the last token.
    if ( tokens.length > 0 ) {
        let lastToken = tokens[ tokens.length - 1 ];
        let positionOfNumberSign = lastToken.lastIndexOf( "#" );
        if ( positionOfNumberSign >= 0 ) {
            tokens[ tokens.length - 1 ] = 
                lastToken.substring( 0, positionOfNumberSign );
        }
    }
    
    // If there's one token, then it can be a chapter name or a page in the
    // current chapter. Look at the pages in the current chapter first, then
    // look at chapter names. If there's two tokens, then the first is a chapter
    // name and the second is a page name. Page names can be split in 
    // time: location, or just time.
    
    if ( tokens.length === 1 ) {
        
        // Single token. Assume it's a page name.
        let chapterIndex = currentChapterIndex;
        let pageIndex = findPageInChapter( story, currentChapterIndex, 
            tokens[0] );
        
        // Page not found. Maybe it's a chapter name.
        if ( pageIndex === -1 ) {
             chapterIndex = findChapter( story, tokens[0] );
             pageIndex = 0;
        }
        
        // Found as either a page or chapter name. Target found.
        if ( chapterIndex >= 0 && pageIndex >= 0 ) {
            target.found = true;
            target.chapter = chapterIndex;
            target.page = pageIndex;
        }
        
        // No matches.
        if ( !target.found ) {
            appendCodeWarning( path, 
                "Could not find a match for the link to '" + tokens[0] + "'. " +
                "It should be a day, (eg. 'Monday'), time (eg. 'Morning'), " +
                "or time & location (eg. 'Morning: Bedroom') that is found in " +
                "your story. Make sure there are no typos." );
        }
        
    } else if ( tokens.length === 2 ) {
        
        // The first token must be a chapter name.
        let chapterIndex = findChapter( story, tokens[0] );
        
        // Chapter found.
        // The second token must be a page name in that chapter.
        if ( chapterIndex >= 0 ) {
            let pageIndex = findPageInChapter( story, chapterIndex, tokens[1] );
            
            if ( pageIndex >= 0 ) {
                target.found = true;
                target.chapter = chapterIndex;
                target.page = pageIndex;
            }
        }
        
        // No matches.
        if ( !target.found ) {
            appendCodeWarning( path, 
                "Could not find a day identified as '" + tokens[0] + "' with " +
                "a time or time & location of '" + tokens[1] + "'. The day " +
                "should be one in your story and something like 'Monday.' " +
                "The time or time & location should be something like " +
                "'Morning' (just time) or 'Morning: Bedroom' (time & location) " +
                "that is found in your story. Make sure there are no typos." );
        }
        
    } else {
        
        // 3+ Tokens. This is unsupported right now.
        appendCodeWarning( path, 
            "Contains 3 or more tokens (tokens are separated with '>')." +
            "They are " + tokens.join(", ") + ". Only 1 or 2 tokens are " +
            "supported at this time.");    
    }
    
    return target;
}

function findChapter( story, day )
{
    for ( let chapterIndex = 0; 
          chapterIndex < story.chapters.length; 
          chapterIndex++ ) {
              
        if ( caseInsensitive( day ) === 
             caseInsensitive( story.chapters[ chapterIndex ].day ) ) {
                 
            return chapterIndex;
        }
    }
    
    // No matches found.
    return -1;
}

function findPageInChapter( story, chapterIndex, timeAndLocation )
{
    let splitTimeAndLocation = splitInTwoParts( ":", timeAndLocation );
    let time = splitTimeAndLocation.left;
    let location = splitTimeAndLocation.right;
    let chapter = story.chapters[ chapterIndex ];
    
    for ( let pageIndex = 0; 
          pageIndex < chapter.pages.length;
          pageIndex++ ) {
              
        let page = chapter.pages[ pageIndex ];
        
        // Time is mandatory. Make the comparison.
        // Location is optional. If specified, compare it.
        if ( caseInsensitive( page.time ) === 
             caseInsensitive( time ) &&
             ( location === "" ||
               ( caseInsensitive( page.location ) === 
                 caseInsensitive( location ) ) ) ) {
        
            return pageIndex;
        }
              
    }
    
    // No matches found.
    return -1;
}

function getMatchIncrement( path )
{
    // If the path ends with #<Number> then the match number to get is that
    // number, otherwise it's assumed to be the first match (1.)
    
    let positionOfNumberSign = path.lastIndexOf( "#" );
    
    if ( positionOfNumberSign >= 0 ) {
        let matchNumber = parseInt( path.slice( positionOfNumberSign + 1) );
        if ( Number.isInteger( matchNumber ) ) {
            return matchNumber;
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
    
    return 1;
}

function getNextOrLastChapterAndPage( story, path, initialChapterIndex, initialPageIndex, isNext )
{
    let incrementOrDecrementBy = ( isNext ) ? +1 : -1;
    
    // Start at the current chapter.
    // When this chapter is exhausted, go up or down one,
    // until all chapters have been explored.
    for ( let chapterIndex = initialChapterIndex; 
              chapterIndex >= 0 && 
              chapterIndex < story.chapters.length; 
              chapterIndex += incrementOrDecrementBy ) {
              
        // The initial page is, if we're on the same chapter we started with,
        // the immediate next or previous page. Otherwise, it's the first page
        // of the next chapter (if we're incrementing) or the last page of the 
        // previous chapter (if we're decrementing).
        let startPage = 
            ( chapterIndex === initialChapterIndex ) ?
                initialPageIndex + incrementOrDecrementBy :
                    ( isNext ? 
                        0 : 
                        story.chapters[ chapterIndex ].pages.length - 1 );
        
        // Go up or down a page, until all have been exhausted in this chapter.
        for ( let pageIndex = startPage;
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
