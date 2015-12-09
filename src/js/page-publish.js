function loadPublishStoryPage()
{
    // Only download page if it hasn't been obtained already.
    if ( $( html.publishStoryContainer ).text() === "" ) {
        downloadPublishStoryPage();
    }
}

function downloadPublishStoryPage()
{
    var documentationContainerElement = $( html.documentationContainer )[0];
    var loadingAnimation = new Spinner().spin( documentationContainerElement );
    
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
    $( html.publishStoryDialog ).modal();
}

function hidePublishStoryDialog()
{
    $( html.publishStoryDialog ).modal( "hide" );
}
