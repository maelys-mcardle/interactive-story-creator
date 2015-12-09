"use strict";

function loadStoryFromCreateStoryDialog()
{
    // Close the dialog.
    hideCreateStoryDialog();
    
    // Load the story code.
    var storyTitle = $( html.inputStoryTitle ).val();
    var storyAuthors = $( html.inputStoryAuthors ).val();
    var storyCode = $( html.inputStoryCode ).val();
        
    // If the title is blank.
    if (storyTitle == "") {
        storyTitle = $( html.inputStoryTitle ).prop( "placeholder" );
    }
    
    if (storyAuthors == "") {
        storyAuthors = $( html.inputStoryAuthors ).prop( "placeholder" );
    }
    
    // Load the story in.
    loadStory( storyTitle, storyAuthors, storyCode, true );
}

function loadStoryFromUrl()
{
    var currentUrl = new URI( window.location.href );
    
    if ( currentUrl.hasQuery("pastebin") &&
         currentUrl.hasQuery("title") &&
         currentUrl.hasQuery("authors") ) {
        loadStoryFromPastebinUrl( currentUrl );
    }
}

function loadStoryFromPastebinUrl( url )
{
    var urlValues = url.search(true); 
    var pastebinToken = urlValues.pastebin;
    var storyTitle = urlValues.title;
    var storyAuthors = urlValues.authors;
    
    $.get( constants.pastebinRawUrl + pastebinToken, function( storyCode ) {
        
        $( html.inputStoryTitle ).val( storyTitle );
        $( html.inputStoryAuthors ).val( storyAuthors );
        $( html.inputStoryCode ).val( storyCode );
    
        loadStory( storyTitle, storyAuthors, storyCode, false );
    });
}

function loadStory( storyTitle, storyAuthors, storyCode, showWarnings )
{
    // Empty warnings.
    $( html.codeWarningList ).empty();
    
    // Parse the story.
    var story = parseStory( storyCode );
    
    // Pass the story through the linker. This translates the targets 
    // into addresses and warns of any errors.
    story = parseTargets( story );
    
    // Show the warning dialog if there were warnings.
    // Load the story if they press the ignore button.
    if ( showWarnings && ! $( html.codeWarningList ).is(':empty') ) {
        
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
    if ( story.chapters.length && story.chapters[ 0 ].pages.length ) {
        
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
    
    } else {
        
        // Show the story error message.
        showStoryErrorMessage();
        
    }
}

function appendCodeWarning( title, message ) 
{
    $( html.codeWarningList ).append(
        '<div class="alert alert-warning" role="alert">' + 
            '<strong>' + title + '</strong>: ' + message + 
        '</div>' );
}

