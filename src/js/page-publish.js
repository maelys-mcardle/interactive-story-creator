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
        
        // Documentation downloaded. Paste it.
        $( html.publishStoryContainer ).html( data );
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
