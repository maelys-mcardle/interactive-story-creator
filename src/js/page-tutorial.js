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
    var parsedTableOfContents = parseHtmlHeaders( html.tutorialContents );
        
    var tableOfContentsHtml = 
        tableOfContentsHtmlFromData( parsedTableOfContents, false );
    
    $( html.tutorialTableOfContents ).html( tableOfContentsHtml );
    
    $('body').scrollspy({ target: html.tutorialTableOfContents })
}

function parseHtmlHeaders( root ) 
{
    var tableOfContentsEntries = [];
    
    $( root ).find( "h1, h2, h3" ).each( function( index, header ) {
       
        var level = $( header ).prop( "tagName" );
        var title = $( header ).text();
        var id = $( header ).attr( "id" );
       
        if ( level === "H1" ) {
            tableOfContentsEntries.push(
                tableOfContentsEntry( title, id, [] ) );
        } else if ( level === "H2" ) {
            var latestEntryH1 = tableOfContentsEntries.pop();
            latestEntryH1.children.push( 
                tableOfContentsEntry( title, id, [] ) );
            tableOfContentsEntries.push( latestEntryH1 );
        } else if ( level === "H3" ) {
            var latestEntryH1 = tableOfContentsEntries.pop();
            var latestEntryH2 = latestEntryH1.children.pop();
            latestEntryH2.children.push( 
                tableOfContentsEntry( title, id, [] ) );
            latestEntryH1.children.push( latestEntryH2 );
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
                listItems.join( constants.newlineCharacter ) + 
                '</ul>';
    }
    
    return "";
}
