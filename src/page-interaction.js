"use strict";

const defaultStory = {
    title: "One Week",
    authors: "Eliot, Ollie & Maëlys",
};

const constants = {
    updatedMessageDuration: 3000,
    errorMessageDuration: 5000,
    activeLinkClass: "active",
};

const html = {
    footerAuthorCopyright: "#footerAuthorCopyright",
    loadStoryNavbarButton: "#loadStoryNavbarButton",
    createStoryJumbotronButton: "#createStoryJumbotronButton",
    inputStoryTitle: "#inputStoryTitle",
    inputStoryAuthors: "#inputStoryAuthors",
    inputStoryCode: "#inputStoryCode",
    createEditStoryDialog: "#create-edit-story-dialog",
    createEditStoryDialogTitle: "#create-edit-story-dialog .modal-title",
    createEditStoryDialogActionButton: "#create-edit-story-dialog .modal-footer .btn-primary",
    noStoryMessage: "#no-story-message",
    storyUpdatedMessage: "#story-updated-message",
    storyErrorMessage: "#story-error-message",
    storyContainer: "#story-container",
    storyPage: "#story-page",
    storyText: "#story-text",
    storyLocation: "#story-location",
    storyDay: "#story-day",
    storyTime: "#story-time",
    storyChoices: "#story-choices",
    historyContainer: "#history-container",
    activeNavbarLink: "#navbar-links .active",
    playNavbarLink: "#play-navbar-link",
    historyNavbarLink: "#history-navbar-link",
    codeWarningDialog: "#code-warning-dialog",
    codeWarningList: "#code-warning-list",
    codeWarningEditCodeButton: "#code-warning-edit-code-button",
    codeWarningIgnoreButton: "#code-warning-ignore-button",
};

let global = {
    showStoryUpdatedTimeout: undefined,
    showStoryErrorTimeout: undefined,
};

function showCreateStoryDialog()
{
    $( html.createEditStoryDialogTitle ).text("Create Story");
    $( html.createEditStoryDialogActionButton ).text("Create Story");
    $( html.createEditStoryDialog ).modal();
}

function hideCreateStoryDialog()
{
    $( html.createEditStoryDialog ).modal( "hide" );
}

function showEditStoryDialog()
{
    $( html.createEditStoryDialogTitle ).text("Edit Story");
    $( html.createEditStoryDialogActionButton ).text("Edit Story");
    $( html.createEditStoryDialog ).modal();
}

function showCodeWarningDialog()
{
    $( html.codeWarningDialog ).modal();
}

function hideCodeWarningDialog()
{
    $( html.codeWarningDialog ).modal( "hide" );
}

function showStoryUpdatedMessage()
{
    // Clear any previous timeout.
    clearTimeout( global.showStoryUpdatedTimeout );
    
    // Show the message.
    $( html.storyUpdatedMessage ).slideDown();
    
    // Have the message go away after a time.
    global.showStoryUpdatedTimeout = setTimeout( 
        function() {
            $( html.storyUpdatedMessage ).slideUp();
        }, constants.updatedMessageDuration );
}

function showStoryErrorMessage()
{
    // Clear any previous timeout.
    clearTimeout( global.showStoryErrorTimeout );
    
    // Show the message.
    $( html.storyErrorMessage ).slideDown();
    
    // Have the message go away after a time.
    global.showStoryErrorTimeout = setTimeout( 
        function() {
            $( html.storyErrorMessage ).slideUp();
        }, constants.errorMessageDuration );
}
function clickNavbarPlay()
{
    $( html.activeNavbarLink ).removeClass( constants.activeLinkClass );
    $( html.playNavbarLink ).addClass( constants.activeLinkClass );
    $( html.historyContainer ).hide();
    $( html.storyContainer ).show();
}

function clickNavbarHistory()
{
    $( html.activeNavbarLink ).removeClass( constants.activeLinkClass );
    $( html.historyNavbarLink ).addClass( constants.activeLinkClass );
    $( html.storyContainer ).hide();
    $( html.historyContainer ).show();
}

function loadStory()
{
    // Load the story code.
    let storyCode = $( html.inputStoryCode ).val();
    
    // Clear warnings.
    $( html.codeWarningList ).empty();
    
    // Parse the story.
    let story = parseStory( storyCode );
    
    // Pass the story through the linker. This translates the targets 
    // into addresses and warns of any errors.
    story = parseTargets( story );
    
    // Close the dialog.
    hideCreateStoryDialog();
    
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
        displayLoadedStory( story );
    }
    
}

function displayLoadedStory( story )
{
    // If there's something to load, load it.
    if ( story.chapters.length ) {
        
        // Load the story title and code.
        let storyTitle = $( html.inputStoryTitle ).val();
        let storyAuthors = $( html.inputStoryAuthors ).val();
        
        // If the title is blank.
        if (storyTitle == "") {
            storyTitle = defaultStory.title;
        }
        
        if (storyAuthors == "") {
            storyAuthors = defaultStory.authors;
        }
        
        // Set the page title to the new story title.
        document.title = storyTitle;
        $(".navbar-brand").text(storyTitle);
        
        // Set the footer.
        $( html.footerAuthorCopyright ).text(
            '"' + storyTitle + '" by ' + storyAuthors + ".");
        
        // Update the navbar button to edit.
        $( html.loadStoryNavbarButton ).text("Edit Story");
        $( html.loadStoryNavbarButton ).unbind('click').click( showEditStoryDialog );
        
        // Fade out the message that there's no story. Once gone, fade in the 
        // generated story.
        $( html.noStoryMessage ).fadeOut('slow', function() {
            $( html.storyPage ).fadeIn();
        });
        
        // Show the first page.
        showFirstStoryPage( story );
        
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

// Called on start.
$(function() {
    
    // Set the placeholder to be the default title.
    $( html.inputStoryTitle ).prop("placeholder", defaultStory.title );
    $( html.inputStoryAuthors ).prop("placeholder", defaultStory.authors );
    
    // Set the initial buttons.
    $( html.loadStoryNavbarButton ).text("Create Story");
    $( html.loadStoryNavbarButton ).click( showCreateStoryDialog );
    $( html.createStoryJumbotronButton).click( showCreateStoryDialog );
    
    // Initialize tooltips.
    $('[data-toggle="tooltip"]').tooltip()

});
