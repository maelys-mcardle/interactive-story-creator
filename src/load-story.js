const DEFAULT_STORY_TITLE = "One Week";
const html = {
    loadStoryNavbarButton: "#loadStoryNavbarButton",
    inputStoryTitle: "#inputStoryTitle",
    inputStoryCode: "#inputStoryCode",
    createEditStoryDialog: "#create-edit-story-dialog",
    createEditStoryDialogTitle: "#create-edit-story-dialog .modal-title",
    createEditStoryDialogActionButton: "#create-edit-story-dialog .modal-footer .btn-primary",
    
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
    var storyTitle = $( html.inputStoryTitle ).val();
    var storyCode = $( html.inputStoryCode ).val();
    
    // If the title is blank.
    if (storyTitle == "") {
        storyTitle = DEFAULT_STORY_TITLE;
    }
    
    // Set the page title to the new story title.
    document.title = storyTitle;
    $(".navbar-brand").text(storyTitle);
    
    // Update the navbar button to edit.
    $("#loadStoryNavbarButton").text("Edit Story");
    $("#loadStoryNavbarButton").unbind('click').click( showEditStoryDialog );
    
    // Close the dialog.
    hideCreateStoryDialog();    
}

// Called on start.
$(function() {
    
    // Set the placeholder to be the default title.
    $( html.inputStoryTitle ).prop("placeholder", DEFAULT_STORY_TITLE);
    
    // Show the dialog to create the story on page load.
    showCreateStoryDialog();

});
