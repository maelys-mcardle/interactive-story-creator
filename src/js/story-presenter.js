"use strict";

function showStoryBeginning( story )
{
    // Show the first page of the first chapter.
    if ( story.chapters.length ) {
        showStoryChapterTitlePage( story, [], 0, 0 );
    }
}

function showStoryChapterTitlePage( story, previousChoices, chapterIndex, pageIndex )
{
    // Set the chapter title.
    var chapter = story.chapters[ chapterIndex ];
    
    // Show Chapter title page.
    fadeInChapterTitlePage( function() {
        
        // What to change while all content is temporarily invisible.
        $( html.chapterTitlePageName ).text( chapter.title );
        
        // Add history entry.
        addChapterTitlePageToHistory( story, previousChoices, chapterIndex, pageIndex );
        
        // Pressing the continue button loads the page.
        $( html.chapterTitlePageButton ).unbind( "click" ).click( function() {
            showStoryPage( story, previousChoices, chapterIndex, pageIndex );
        });
    });
}

function showStoryPage( story, previousChoices, chapterIndex, pageIndex )
{
    var chapter = story.chapters[ chapterIndex ];
    var page = chapter.pages[ pageIndex ];
 
    // Show story page.
    fadeInStoryPage( function() {
        
        // What to change while all content is temporarily invisible.
        setStoryChapterTitle( chapter.title );
        setStoryTime( page.time );
        setStoryLocation( page.location );
        setStoryContent( page.texts, previousChoices );
        setStoryChoices( page.links, story, previousChoices, chapterIndex, pageIndex );
        addStoryPageToHistory( story, previousChoices, chapterIndex, pageIndex );
    });
}


function fadeInStoryPage( changesToDoWhenContentInvisible )
{
    fadeInPage( html.storyPage, changesToDoWhenContentInvisible );
}

function fadeInChapterTitlePage( changesToDoWhenContentInvisible )
{
    fadeInPage( html.chapterTitlePage, changesToDoWhenContentInvisible );
}
    
function fadeInPage( selectorToFadeIn, changesToDoWhenContentInvisible )
{    
    var fadeInFunction = function() {
        changesToDoWhenContentInvisible();
        $( selectorToFadeIn ).fadeIn();
    };
        
    // Fade out the visible chapter title or story page, then fade 
    // in the appropriate page.
    if ( isVisible( html.chapterTitlePage ) ) {
        
        $( html.chapterTitlePage ).fadeOut( "fast",  fadeInFunction );
        
    } else if ( isVisible( html.storyPage ) ) {
        
        $( html.storyPage ).fadeOut( "fast", fadeInFunction );
        
    } else {
        
        // Nothing is visible. Must be on another page.
        $( html.chapterTitlePage ).hide();
        $( html.storyPage ).hide();
        fadeInFunction();
        
    }
}

function setStoryChapterTitle( title )
{
    $( html.storyChapterTitle ).text( title );
}

function setStoryTime( time )
{
    if ( time === "" ) {
        
        // No time specified. Don't show it.
        $( html.storyTimeContainer ).hide();
        
    } else {
        
        // Time specified. Show what it is.
        $( html.storyTime ).text( time );
        $( html.storyTimeContainer ).show();
    }
}

function setStoryLocation( location )
{
    $( html.storyLocation ).text( location );
}

function setStoryContent( texts, previousChoices )
{
    $( html.storyText ).empty();
    
    texts.forEach( function( text ) {
        addStoryText( text, previousChoices );
    });
}

function addStoryText( text, previousChoices )
{
    if ( !text.choice.id ||
         choiceInPreviousChoices( text.choice, previousChoices ) ) {
             
        // Append text as parsed markdown.
        $( html.storyText ).append( marked( text.content ) );
    }
}

function choiceInPreviousChoices( choiceToFind, allChoices )
{
    // Look from the most recent choices backwards.
    for ( var choiceIndex = allChoices.length - 1;
              choiceIndex >= 0;
              choiceIndex-- ) {
    
        var choiceToCompare = allChoices[ choiceIndex ];
        
        // Match found if for the given chapter/page, the right ID
        // was selected. In case the individual returned to this page
        // many times, we only take the most recent choice.
        if ( ( choiceToFind.target.path    === "" ) || 
             ( choiceToFind.target.found   === true &&
               choiceToFind.target.chapter === choiceToCompare.chapter &&
               choiceToFind.target.page    === choiceToCompare.page ) ) {
        
            if ( caseInsensitive( choiceToFind.id ) === 
                 caseInsensitive( choiceToCompare.id ) ) {
             
                // Match found.
                return true;
            
            }
            
            else if ( choiceToFind.target.found   === true &&
                      choiceToFind.target.chapter === choiceToCompare.chapter &&
                      choiceToFind.target.page    === choiceToCompare.page ) {
            
                // Page was specified, and there was no matches on it.
                return false;
            }
        }
    }
    
    // No matches.
    return false;
}

function setStoryChoices( links, story, previousChoices, chapterIndex, pageIndex )
{
    $( html.storyChoices ).empty();
    
    if ( links.length === 0 ) {
        links = [{ 
            text: "No choices available.",
            target: { found: false }}];
    }
    
    links.forEach( function( link ) {
        addStoryChoice( link, story, previousChoices, chapterIndex, pageIndex );
    });
}

function addStoryChoice( link, story, previousChoices, chapterIndex, pageIndex )
{
    var linkElement = $( 
        '<a href="#" class="list-group-item">' + 
        link.text + 
        '</a>' );
 
    // No path. Mark the link as disabled.
    if ( link.target.found === false ) {
        linkElement.addClass("disabled");
    
    // Path specified. Create the link.
    } else {
        
        $( linkElement ).click( function() {
            
            // Setup the previous choices if the link is clicked.
            // The use of slice() makes the changes to a copy,
            // not the original array.
            var newPreviousChoices = previousChoices.slice();
            newPreviousChoices.push({ 
                chapter: chapterIndex,
                page: pageIndex,
                text: link.text,
                id: link.id });
                
            if ( link.target.chapter !== chapterIndex ) {
                
                // If the target is in a different chapter, load 
                // chapter title page.
                showStoryChapterTitlePage( story, newPreviousChoices, 
                    link.target.chapter, link.target.page );
            } else {
                
                // If the target is in the same chapter, just load the page.
                showStoryPage( story, newPreviousChoices, 
                    link.target.chapter, link.target.page );
            }
                
        });
    
    }
    
    // Add the element to the page.
    $( html.storyChoices ).append( linkElement );
}

function isVisible( selector )
{
    return $( selector ).is(":visible");
}

