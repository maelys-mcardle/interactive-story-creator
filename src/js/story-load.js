"use strict";

function loadStoryFromCreateStoryDialog()
{
    // Close the dialog.
    hideCreateStoryDialog();
 
    // Empty warnings.
    $( html.codeWarningList ).empty();
       
    // Load the story code.
    var storyTitle = $( html.inputStoryTitle ).val();
    var storyAuthors = $( html.inputStoryAuthors ).val();
    var storyCode = $( html.inputStoryCode ).val();
    
    // Load the story in.
    loadStory( storyTitle, storyAuthors, storyCode );
}

function loadStoryFromUrl()
{
    // Empty warnings.
    $( html.codeWarningList ).empty();
    
    var currentUrl = new URI( window.location.href );
    
    if ( currentUrl.hasQuery("story") &&
         currentUrl.hasQuery("title") &&
         currentUrl.hasQuery("authors") ) {

        // Get the parameters from the URL.
        var urlValues = currentUrl.search(true);
        var storyCodeUrl = atob( urlValues.story );
        var storyTitle = urlValues.title;
        var storyAuthors = urlValues.authors;
        
        // Get the story code.
        $.get( storyCodeUrl, function( storyCode ) {
        
            loadStory( storyTitle, storyAuthors, storyCode );
            
        }).fail(function() {

            appendCodeWarning( "Could not load URL",
                "Unable to load the story code from '" + storyCodeUrl + "'. " +
                "The website it's hosted on might not allow sites like this " +
                "to access the file.");
                
            loadStory( storyTitle, storyAuthors, "" );
        });
    }
}

function loadStoryFromDocumentation( storyTitle, storyAuthors, storyCode )
{
    // Empty warnings.
    $( html.codeWarningList ).empty();
    
    // Story already loaded. Show overwrite warning.
    if ( hasStoryLoaded() ) {
        
        // Load the story on over-write.
        $( html.overwriteWarningOverwriteButton ).unbind( "click" ).click( 
            function() {
                $( html.overwriteWarningDialog ).modal( "hide" );
                loadStory( storyTitle, storyAuthors, storyCode );
            });

        // Show the warning.
        $( html.overwriteWarningDialog ).modal();
        
    // No loaded story. Proceed.
    } else {
    
        loadStory( storyTitle, storyAuthors, storyCode );
        
    }
}

function loadStory( storyTitle, storyAuthors, storyCode )
{    
    // Populate input values with what we have.
    $( html.inputStoryTitle ).val( storyTitle );
    $( html.inputStoryAuthors ).val( storyAuthors );
    $( html.inputStoryCode ).val( storyCode );

    // If the title and author are blank.
    if ( !storyTitle ) {
        storyTitle = $( html.inputStoryTitle ).prop( "placeholder" );
    }
    
    if ( !storyAuthors ) {
        storyAuthors = $( html.inputStoryAuthors ).prop( "placeholder" );
    }
    
    // Parse the story.
    var story = parseStory( storyCode );
    
    // Pass the story through the linker. This translates the targets 
    // into addresses and warns of any errors.
    story = parseTargets( story );
    
    // Show the warning dialog if there were warnings.
    // Load the story if they press the ignore button.
    if ( ! $( html.codeWarningList ).is(':empty') ) {
        
        $( html.codeWarningIgnoreButton ).one( 'click', function () {
            hideCodeWarningDialog();
            displayLoadedStory( story );
        });
        
        $( html.codeWarningEditCodeButton ).one( 'click', function () {
            hideCodeWarningDialog();
            showCreateStoryDialog();
        });
        
        showCodeWarningDialog();
        
    } else {
        displayLoadedStory( storyTitle, storyAuthors, story );
    }
}

function displayLoadedStory( storyTitle, storyAuthors, story )
{
    // If there's something to load, load it.
    if ( story && story.chapters.length && story.chapters[ 0 ].pages.length ) {
        
        // Set the page title to the new story title.
        document.title = storyTitle;
        $(".navbar-brand").text(storyTitle);
        
        // Set the story credits.
        var storyCredits = '"' + storyTitle + '" by ' + storyAuthors + ".";
        $( html.chapterTitlePageCredits ).text( storyCredits );
        $( html.footerAuthorCopyright ).text( storyCredits );
        
        // Update the navbar button to edit.
        $( html.loadStoryNavbarButton ).text("Edit Story");
        $( html.loadStoryNavbarButton ).unbind('click').click( showEditStoryDialog );
        
        // Reset the history.
        resetHistory();
        
        // Fade out the message that there's no story. Once gone, fade in the 
        // generated story.
        $( html.noStoryMessage ).fadeOut('fast', function() {
            
            // Show the beginning of the story.
            showStoryBeginning( story );
        
        });
        
        // Go to the play page.
        goToPlayPage();
        
        // Show the story updated message.
        showStoryUpdatedMessage();
        
        // Set warning for when user leaves page.
        warnBrowserLeavingPage();
        
    } else {
        
        // Show the story error message.
        showStoryErrorMessage();
        
    }
}

function hasStoryLoaded()
{
    return $( html.loadStoryNavbarButton ).text() === "Edit Story";
}

function appendCodeWarning( title, message ) 
{
    $( html.codeWarningList ).append(
        '<div class="alert alert-warning" role="alert">' + 
            '<strong>' + title + '</strong>: ' + message + 
        '</div>' );
}
