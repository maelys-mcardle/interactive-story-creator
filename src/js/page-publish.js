"use strict";

function loadPublishStoryPage()
{
    // Only download page if it hasn't been obtained already.
    if ( $( html.publishStoryContainer ).text() === "" ) {
        downloadPublishStoryPage();
    }
}

function downloadPublishStoryPage()
{
    var publishStoryContainerElement = $( html.publishStoryContainer )[0];
    var loadingAnimation = new Spinner().spin( publishStoryContainerElement );
    
    $.get( constants.publishStoryUrl, function( data ) {
        
        // Remove the loading animation.
        loadingAnimation.stop();
        
        // Page downloaded. Paste it.
        $( html.publishStoryContainer ).html( data );
        
        // Define behaviour for the buttons on the page.
        $( html.publishStoryButton ).click( showPublishStoryDialog );
        
    });
}

function showPublishStoryDialog()
{
    // Populate values.
    $( html.publishStoryTitle ).val( $( html.inputStoryTitle ).text() );
    $( html.publishStoryAuthors ).val( $( html.inputStoryAuthors ).text() );
    showPublishStoryStep1();
       
    $( html.publishStoryDialog ).modal();
}

function hidePublishStoryDialog()
{
    $( html.publishStoryDialog ).modal( "hide" );
}

function showPublishStoryStep1()
{
    $( html.publishInputStoryCodeUrl ).parent().removeClass("has-error");
    
    $( html.publishStorySteps ).hide();
    $( html.publishStoryStep1 ).show();
    
    $( html.publishStoryBackButton ).hide();
    $( html.publishStoryNextButton ).show();
    $( html.publishStoryFinishButton ).hide();
    
    $( html.publishStoryNextButton ).unbind( "click" )
        .click( validateStoryCodeUrl );
}

function validateStoryCodeUrl()
{
    var storyCodeUrl = new URI( $( html.publishInputStoryCodeUrl ).val() );

    if ( storyCodeUrl.domain() && storyCodeUrl.filename() ) {
        
        var currentUrl = new URI( window.location.href );
        
        var urlDirectory = ( currentUrl.directory().endsWith("/") ) ? 
                             currentUrl.directory() :
                             currentUrl.directory() + "/";
                             
        var urlFilename = ( currentUrl.filename() ) ?
                            currentUrl.filename() : constants.indexUrl;
                            
        var generatedUrl = currentUrl.protocol() + "://" + 
                           currentUrl.host() + 
                           urlDirectory + 
                           urlFilename + 
                           "?story=" + 
                           encodeURIComponent( storyCodeUrl.toString() );
        
        $( html.publishStoryUrl ).text( generatedUrl );
        showPublishStoryStep2();
        
    } else {
        
        $( html.publishInputStoryCodeUrl ).parent().addClass("has-error");
        
    }
}

function showPublishStoryStep2()
{
    $( html.publishStorySteps ).hide();
    $( html.publishStoryStep2 ).show();
    
    $( html.publishStoryBackButton ).show();
    $( html.publishStoryNextButton ).hide();
    $( html.publishStoryFinishButton ).show();

    $( html.publishStoryBackButton ).unbind( "click" )
        .click( showPublishStoryStep1 );
    $( html.publishStoryFinishButton ).unbind( "click" )
        .click( showPublishStoryStep3 );
}

function showPublishStoryStep3()
{
    var title = encodeURIComponent( $( html.publishStoryTitle ).val() );
    var authors = encodeURIComponent( $( html.publishStoryAuthors ).val() );
    var url = $( html.publishStoryUrl ).text() + 
              "&title=" + title + "&authors=" + authors;
    
    $( html.publishStoryUrl ).text( url );
    $( html.publishStoryUrl ).prop( "href", url );
    
    $( html.publishStorySteps ).hide();
    $( html.publishStoryStep3 ).show();
    
    $( html.publishStoryBackButton ).show();
    $( html.publishStoryNextButton ).hide();
    $( html.publishStoryFinishButton ).hide();
    
    $( html.publishStoryBackButton ).unbind( "click" )
        .click( showPublishStoryStep2 );
}
