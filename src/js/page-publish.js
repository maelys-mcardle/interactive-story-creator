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
    
    $.get( constants.publishPage, function( data ) {
        
        // Remove the loading animation.
        loadingAnimation.stop();
        
        // Page downloaded. Paste it.
        $( html.publishStoryContainer ).html( data );
        
        // Define behaviour for the buttons on the page.
        $( html.publishStoryButton ).click( showPublishStoryDialog );
        
        // Validate when url typed/pasted.
        $( html.publishInputStoryCodeUrl ).on('input', validateStoryCodeUrl );
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
    var url = pageUrlFromStoryCodeUrl() +
              "&title=" + title + 
              "&authors=" + authors;
    
    if ( $( html.publishInputStoryEditable ).is(':checked') ) {
        url += "&editable";
    }
    
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

function hasStoryCodeUrl()
{
    return ( $( html.publishInputStoryCodeUrl ).val().trim().length > 0 );
}

function pageUrlFromStoryCodeUrl()
{
    var storyCodeUrl = new URI( $( html.publishInputStoryCodeUrl ).val() );

    if ( storyCodeUrl.domain() && storyCodeUrl.filename() ) {
        
        var currentUrl = new URI( window.location.href );
        
        var urlDirectory = ( currentUrl.directory().endsWith("/") ) ? 
                             currentUrl.directory() :
                             currentUrl.directory() + "/";
                             
        var urlFilename = ( currentUrl.filename() ) ?
                            currentUrl.filename() : constants.indexPage;
                            
        // Story code URL Base64 encoded because of problem with
        // HostGator giving Error 500 if a URL includes a protocol
        // in the parameters.
        var generatedUrl = currentUrl.protocol() + "://" + 
                           currentUrl.host() + 
                           urlDirectory + 
                           urlFilename + 
                           "?story=" + 
                           encodeURIComponent( btoa( storyCodeUrl.toString() ) );
                           
        return generatedUrl;        
    }
    
    return "";
}

function validateStoryCodeUrl()
{
    var validationReset = function () {
        $( html.publishInputStoryCodeUrlFailIcon ).hide();
        $( html.publishInputStoryCodeUrlOkIcon ).hide();
        $( html.publishInputStoryCodeUrlCheckingIcon ).hide();
        $( html.publishInputStoryCodeUrl ).parent().removeClass("has-error");
        $( html.publishInputStoryCodeUrl ).parent().removeClass("has-success");
        $( html.publishStoryNextButton ).prop('disabled', true);
        $( html.publishStoryNextButton ).unbind( "click" );  
    };
    
    var validationPassed = function () {
        $( html.publishInputStoryCodeUrlCheckingIcon ).hide();
        $( html.publishInputStoryCodeUrlOkIcon ).show();
        $( html.publishInputStoryCodeUrl ).parent().addClass("has-success");
        $( html.publishStoryNextButton ).prop('disabled', false);
        $( html.publishStoryNextButton ).click( showPublishStoryStep2 );
    };
    
    var validationFailed = function () {
        $( html.publishInputStoryCodeUrlCheckingIcon ).hide();
        $( html.publishInputStoryCodeUrlFailIcon ).show();
        $( html.publishInputStoryCodeUrl ).parent().addClass("has-error");
    };
    
    // Clear validation.
    validationReset();
    
    // Only attempt validation if there's a URL.
    if ( hasStoryCodeUrl() ) {
        
        var storyUrl = pageUrlFromStoryCodeUrl();
        
        if ( storyUrl ) {
        
            $( html.publishInputStoryCodeUrlCheckingIcon ).show();
            
            $.get( storyUrl, function ( storyCode ) {
                
                var story = parseStory( storyCode );
                if ( story && story.chapters.length > 0 ) {
                    validationPassed();
                } else {
                    validationFailed();
                }
            
             }).fail( validationFailed );
             
         } else {
             
             validationFailed();
             
         }
    }
}
