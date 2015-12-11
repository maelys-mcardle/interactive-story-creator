"use strict";

function loadDocumentation()
{
    // Only download documentation if it hasn't been obtained already.
    if ( $( html.documentationContents ).text() === "" ) {
        downloadDocumentation();
    }
}

function downloadDocumentation()
{
    var documentationContainerElement = $( html.documentationContainer )[0];
    var loadingAnimation = new Spinner().spin( documentationContainerElement );
    
    $.get( constants.documentationUrl, function( data ) {
        
        // Remove the loading animation.
        loadingAnimation.stop();
        
        // Documentation downloaded. Paste it.
        $( html.documentationContents ).html( data );
   
        // Apply syntax highlighting. 
        // But not for things inside the well, which is used for examples.
        $(':not(.well) pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
        
        // Load the table of contents.
        generateDocumentationTableOfContents();
        
        // Define behaviour of the buttons to run the examples.
        setupDocumentationTryExampleButtons();
        
    });
}

function generateDocumentationTableOfContents()
{
    var parsedTableOfContents = parseHtmlHeaders( html.documentationContents );
        
    var tableOfContentsHtml = 
        tableOfContentsHtmlFromData( parsedTableOfContents, false );
    
    $( html.documentationTableOfContents ).html( tableOfContentsHtml );
    
    $( 'body' ).scrollspy({
        target: html.sidebarClass,
        offset: 130
    });

    $( html.documentationTableOfContentsList ).affix({
        offset: {
            top: 100,
        }
    });
}

function setupDocumentationTryExampleButtons()
{
    var allButtonsAndCode = $( html.documentationContents ).find( 
        html.documentationTryExampleButtons + ", code" );
        
    allButtonsAndCode.each( function( index, element ) {
        var tagName = $( element ).prop( "tagName" );
        if ( tagName === "BUTTON" ) {
            $( element ).click( function() {
                var storyTitle = "Example";
                var storyAuthors = "Story Creator";
                var storyCode = $( allButtonsAndCode[index + 1] ).text();
                loadStoryFromDocumentation( storyTitle, storyAuthors, storyCode );
            });
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
            id = "documentation-header-" + index;
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
