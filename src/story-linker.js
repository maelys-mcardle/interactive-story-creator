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
                story = processChoiceOnText( story, chapterIndex, 
                    pageIndex, textIndex, text );
            });
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
    // Grab the target address.
    link.targetAddress = processTarget( story, chapterIndex, 
        pageIndex, link.target );
    
    // Update the link.
    story.chapters[ chapterIndex ].pages[ pageIndex ].links[ linkIndex ] = link;
    
    return story;
}

function processChoiceOnText( story, chapterIndex, pageIndex, textIndex, text )
{
    // Grab the target address.
    text.choice.targetAddress = processTarget( story, chapterIndex, 
        pageIndex, text.choice.target );
    
    // Update the text.
    story.chapters[ chapterIndex ].pages[ pageIndex ].tests[ textIndex ] = text;
    
    return story;
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
     
     
}
