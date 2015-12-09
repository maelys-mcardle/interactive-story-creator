function loadShareStoryPage()
{
    // Only download page if it hasn't been obtained already.
    if ( $( html.shareStoryContainer ).text() === "" ) {
        downloadShareStoryPage();
    }
}

function downloadShareStoryPage()
{
    var documentationContainerElement = $( html.documentationContainer )[0];
    var loadingAnimation = new Spinner().spin( documentationContainerElement );
    
    $.get( constants.shareStoryUrl, function( data ) {
        
        // Remove the loading animation.
        loadingAnimation.stop();
        
        // Documentation downloaded. Paste it.
        $( html.shareStoryContainer ).html( data );
    });
}

function showShareStoryDialog()
{
    $( html.shareStoryDialog ).modal();
}

function hideShareStoryDialog()
{
    $( html.shareStoryDialog ).modal( "hide" );
}
