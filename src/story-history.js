"use strict";

function addStoryPageToHistory( story, previousChoices, chapterIndex, pageIndex )
{
    var chapter = story.chapters[ chapterIndex ];
    var page = chapter.pages[ pageIndex ];
    
    var title = chapter.title + 
                    (( page.time !== "" ) ? ", " + page.time : "" ) +
                    ", " + page.location;
    var description = "Click to go back to this point in time.";
    var buttonCallback = function() {
        showStoryPage( story, previousChoices, chapterIndex, pageIndex );
    }; 
    
    addEntryToHistory( title, description, buttonCallback );        
}

function addChapterTitlePageToHistory( story, previousChoices, chapterIndex, pageIndex )
{
    var chapter = story.chapters[ chapterIndex ];
    var page = chapter.pages[ pageIndex ];
    
    var title = chapter.title.toUpperCase();
    var description = "Click to go back to this point in time.";
    var buttonCallback = function() {
        showStoryChapterTitlePage( story, previousChoices, chapterIndex, pageIndex );
    };
    
    addEntryToHistory( title, description, buttonCallback );
}

function addEntryToHistory( title, description, buttonCallback )
{    
    // Make clicking the new link bring the user to that point in
    // history. Go to the play page to show them.
    var newHistoryLink = historyLink( title, description );
    newHistoryLink.click( function () {
        buttonCallback();
        goToPlayPage();
    });
    
    // Set only the new link to be active.
    $( html.activeHistoryLinks ).removeClass( "active" );
    newHistoryLink.addClass( "active" );
    
    // Hide the empty history message.
    $( html.emptyHistoryMessage ).hide();
    
    // Add the new link.
    $( html.historyLinks ).append( newHistoryLink );
}

function resetHistory()
{
    $( html.historyLinks ).empty();
}

function historyLink( title, description )
{
    return $( 
        '<a href="#" class="list-group-item">' +
            '<h4 class="list-group-item-heading">' +
                title +
            '</h4>' +
            '<p class="list-group-item-text">' +
                description +
            '</p>' +
        '</a>' );
}
