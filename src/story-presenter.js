"use strict";

function showFirstStoryPage( story )
{
    // Show the first page of the first chapter.
    if ( story.chapters.length ) {
        showStoryPage( story, [], 0, 0 );
    }
}

function showStoryPage( story, choiceHistory, chapterIndex, pageIndex )
{
    let chapter = story.chapters[ chapterIndex ];
    let page = chapter.pages[ pageIndex ];
    
    setStoryDay ( chapter.day );
    setStoryTime( page.time );
    setStoryLocation( page.location );
    
    setStoryChoices( page.links );
        
    return true;
}

function setStoryDay( day )
{
    $( html.storyDay ).text( day );
}

function setStoryTime( time )
{
    $( html.storyTime ).text( time );
}

function setStoryLocation( location )
{
    $( html.storyLocation ).text( location );
}

function setStoryChoices( links )
{
    $( html.storyChoices ).empty();
    
    if ( links.length === 0 ) {
        links = [{ 
            id: "", 
            text: "No choices available", 
            target: { 
                path: "", 
            },},];
    }
    
    links.forEach( function( link ) {
        addStoryChoice( link );
    });
}

function addStoryChoice( link )
{
    let disabledClass = ( link.target.path === "" ) ? "disabled" : "";
    
    let linkAsHtml = 
        '<a href="#" class="list-group-item ' + disabledClass + '">' + 
        link.text + 
        '</a>';
        
    $( html.storyChoices ).append( linkAsHtml );
    
    // on click, add to history.
}
