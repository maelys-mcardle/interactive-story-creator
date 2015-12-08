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
    var tutorialContainerElement = $( html.tutorialContainer )[0];
    var loadingAnimation = new Spinner().spin( tutorialContainerElement );
    
    $.get( constants.tutorialUrl, function( data ) {
        
        // Remove the loading animation.
        loadingAnimation.stop();
        
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
    var parsedTableOfContents = parseHtmlHeaders( html.tutorialContents );
        
    var tableOfContentsHtml = 
        tableOfContentsHtmlFromData( parsedTableOfContents, false );
    
    $( html.tutorialTableOfContents ).html( tableOfContentsHtml );
    
    $( 'body' ).scrollspy({
        target: html.sidebarClass,
        offset: 100
    });
    
    $( html.tutorialTableOfContentsList ).affix({
        offset: {
            top: 100,
        }
    });
}

function parseHtmlHeaders( root ) 
{
    var tableOfContentsEntries = [];
    
    $( root ).find( "h1, h2" ).each( function( index, header ) {
       
        // Get the header properties.
        var level = $( header ).prop( "tagName" );
        var title = $( header ).text();
        var id = $( header ).attr( "id" );
        
        // Assign ID if none exists.
        if ( !id ) {
            id = "tutorial-header-" + index;
            $( header ).attr( "id", id );
        }
       
        // Populate the tree.
        if ( level === "H1" ) {
            tableOfContentsEntries.push(
                tableOfContentsEntry( title, id, [] ) );
        } else if ( level === "H2" ) {
            var latestEntryH1 = tableOfContentsEntries.pop();
            latestEntryH1.children.push( 
                tableOfContentsEntry( title, id, [] ) );
            tableOfContentsEntries.push( latestEntryH1 );
        }
    });
    
    return tableOfContentsEntries;
}

function tableOfContentsEntry( title, id, children )
{
    return {
        title: title,
        id: id,
        children: children,
    };
}

function tableOfContentsHtmlFromData( tableOfContents )
{
    var listItems = tableOfContents.map( function( entry ) {
        return '<li>' + 
               '<a href="#' + entry.id + '">' + 
                entry.title +
                tableOfContentsHtmlFromData( entry.children ) + 
               '</a>' + 
               '</li>';
    });
    
    if ( listItems.length > 0 ) {
        return '<ul class="nav nav-stacked">' + 
                listItems.join( constants.newlineCharacter ) + 
                '</ul>';
    }
    
    return "";
}
