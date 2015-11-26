"use strict";

const defaultStory = {
    title: "One Week",
    authors: "Eliot, Ollie & Maëlys",
};

const constants = {
    updatedMessageDuration: 3000,
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
};

let global = {
    showStoryTimeout: undefined,
};

function showCreateStoryDialog()
{
    $( html.createEditStoryDialogTitle ).text("Create Story");
    $( html.createEditStoryDialogActionButton ).text("Create Story");
    $( html.createEditStoryDialog ).modal();
}

function hideCreateStoryDialog()
{
    $( html.createEditStoryDialog ).modal("hide");
}

function showEditStoryDialog()
{
    $( html.createEditStoryDialogTitle ).text("Edit Story");
    $( html.createEditStoryDialogActionButton ).text("Edit Story");
    $( html.createEditStoryDialog ).modal();
}

function showStoryUpdatedMessage()
{
    // Clear any previous timeout.
    clearTimeout( global.showStoryTimeout );
    
    // Show the message.
    $( html.storyUpdatedMessage ).slideDown();
    
    // Have the message go away after a time.
    global.showStoryTimeout = setTimeout( 
        function() {
            $( html.storyUpdatedMessage ).slideUp();
        }, constants.updatedMessageDuration );
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
    // Load the story title and code.
    let storyTitle = $( html.inputStoryTitle ).val();
    let storyAuthors = $( html.inputStoryAuthors ).val();
    let storyCode = $( html.inputStoryCode ).val();
    
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
    
    // Parse the story.
    let story = parseStory( storyCode );
    
    // Pass the story through the linker. This translates the links 
    // into addresses and warns of any errors.
    story = processLinks( storyCode );
    
    // Load the initial page.
    showStoryPage( story );
    
    // Fade out the message that there's no story. Once gone, fade in the 
    // generated story.
    $( html.noStoryMessage ).fadeOut('slow', function() {
        $( html.storyPage ).fadeIn();
    });
    
    // Show the story updated dialog.
    showStoryUpdatedMessage();
    
    // Close the dialog.
    hideCreateStoryDialog();
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
