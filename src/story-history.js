"use strict";

function addEntryToHistory( story, previousChoices, chapterIndex, pageIndex )
{
    let chapter = story.chapters[ chapterIndex ];
    let page = chapter.pages[ pageIndex ];
    let title = [ chapter.day, page.time, page.location ].join(", ");
    let description = "Click to go back to this point in time.";
    
    let newHistoryLink = historyLink( title, description );
    
    // Make clicking the new link bring the user to that point in
    // history. Go to the play page to show them.
    newHistoryLink.click( function () {
        showStoryPage( story, previousChoices, chapterIndex, pageIndex );
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
