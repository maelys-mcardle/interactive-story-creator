"use strict";

const DEFAULT_STORY_TITLE = "One Week";
const DEFAULT_STORY_AUTHORS = "Eliot, Ollie & Maëlys";

const html = {
    loadStoryNavbarButton: "#loadStoryNavbarButton",
    inputStoryTitle: "#inputStoryTitle",
    inputStoryAuthors: "#inputStoryAuthors",
    inputStoryCode: "#inputStoryCode",
    createEditStoryDialog: "#create-edit-story-dialog",
    createEditStoryDialogTitle: "#create-edit-story-dialog .modal-title",
    createEditStoryDialogActionButton: "#create-edit-story-dialog .modal-footer .btn-primary",
    footerAuthorCopyright: "#footerAuthorCopyright",
    
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

function loadStory()
{
    // Load the story title and code.
    let storyTitle = $( html.inputStoryTitle ).val();
    let storyAuthors = $( html.inputStoryAuthors ).val();
    let storyCode = $( html.inputStoryCode ).val();
    
    // If the title is blank.
    if (storyTitle == "") {
        storyTitle = DEFAULT_STORY_TITLE;
    }
    
    if (storyAuthors == "") {
        storyAuthors = DEFAULT_STORY_AUTHORS;
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
    
    // Close the dialog.
    hideCreateStoryDialog();    
}

// Called on start.
$(function() {
    
    // Set the placeholder to be the default title.
    $( html.inputStoryTitle ).prop("placeholder", DEFAULT_STORY_TITLE);
    $( html.inputStoryAuthors ).prop("placeholder", DEFAULT_STORY_AUTHORS);
    
    // Set the navbar button.
    $( html.loadStoryNavbarButton ).text("Create Story");
    $( html.loadStoryNavbarButton ).click( showCreateStoryDialog );
    
    // Show the dialog to create the story on page load.
    showCreateStoryDialog();

});
