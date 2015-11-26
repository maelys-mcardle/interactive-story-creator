"use strict";

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

function processTargets( story )
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
                story = processChoiceOnText( story, chapterIndex, 
                    pageIndex, textIndex, text );
            }
        });
    });
    
    return story;
}

function targetAddress( chapterIndex, pageIndex )
{
    return {
        chapter: chapterIndex,
        page: pageIndex,
    };
}

function processLinkOnPage( story, chapterIndex, pageIndex, linkIndex, link )
{
    return story;
}

function processChoiceOnText( story, chapterIndex, pageIndex, textIndex, text )
{
    return story;
}

