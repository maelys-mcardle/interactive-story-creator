"use strict";

function loadTutorial()
{
    // Only download tutorial if it hasn't been obtained already.
    if ( $( html.tutorialContents ).text() === "" ) {
        downloadTutorial();
    }
}

function downloadTutorial()
{
    var tutorialContentsElement = $( html.tutorialContents )[0];
    var loadingAnimation = new Spinner().spin( tutorialContentsElement );
    
    $.get( constants.tutorialUrl, function( data ) {
        
        // Tutorial downloaded. Paste it.
        $( html.tutorialContents ).html( data );
   
        // Apply syntax highlighting. 
        // But not for things inside the well, which is used for examples.
        $(':not(.well) pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
        
        // Load the table of contents.
        generateTutorialTableOfContents();
    });
}

function generateTutorialTableOfContents()
{
    var parsedTableOfContents = 
        parseHtmlHeaders( html.tutorialContents, [ "h1", "h2", "h3" ] );
        
    var tableOfContentsHtml = 
        tableOfContentsHtmlFromData( parsedTableOfContents, false );
        
    $( html.utorialTableOfContents ).html( tableOfContentsHtml );
    
    $('body').scrollspy({ target: html.tutorialTableOfContents })
}

function parseHtmlHeaders( root, childLevels ) 
{
    var tableOfContentsEntry = [];
    
    if ( levels.length > 0 ) {
        $( root ).children( childLevels[0] ).each( function( level ) {
            
            var title = $( level ).text();
            var id = $( level ).attr( "id" );
            var children = tableOfContentsLevel( this, childLevels.slice( 1 ) );
            
            tableOfContentsEntry.push({
                title: title,
                id: id,
                children: children,
            });
        }
    }
    
    return tableOfContentsEntry;
}

function tableOfContentsHtmlFromData( tableOfContents, isFixed )
{
    var listItems = tableOfContents.map( function( entry ) {
        return '<li>' + 
               '<a href="#' + entry.id + '">' + 
                entry.title +
                tableOfContentsHtmlFromData( entry.children, true ) + 
               '</a>' + 
               '</li>';
    });
    
    if ( listItems.length > 0 ) {
        var fixedClass = ( isFixed ) ? "fixed" : "";
        return '<ul class="nav nav-stacked ' + fixedClass + '">' + 
                listItems.join() + 
                '</ul>';
    }
    
    return "";
}
