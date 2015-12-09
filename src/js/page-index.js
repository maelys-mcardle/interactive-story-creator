"use strict";

const constants = {
    newlineCharacter: "\n",
    updatedMessageDuration: 3000,
    errorMessageDuration: 5000,
    activeLinkClass: "active",
    documentationUrl: "documentation.htm",
    publishStoryUrl: "publish.htm",
};

const html = {
    footerAuthorCopyright: "#footer-author-copyright",
    loadStoryNavbarButton: "#load-story-navbar-button",
    createStoryJumbotronButton: "#create-story-jumbotron-button",
    inputStoryTitle: "#input-story-title",
    inputStoryAuthors: "#input-story-authors",
    inputStoryCode: "#input-story-code",
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
    storyChapterTitle: "#story-chapter-title",
    storyTime: "#story-time",
    storyTimeContainer: "#story-time-container",
    storyChoices: "#story-choices",
    historyContainer: "#history-container",
    historyLinks: "#history-container .list-group",
    activeHistoryLinks: "#history-container .active",
    emptyHistoryMessage: "#empty-history-message",
    activeNavbarLink: "#navbar-links .active",
    playNavbarLink: "#play-navbar-link",
    historyNavbarLink: "#history-navbar-link",
    publishStoryNavbarLink: "#publish-story-navbar-link",
    documentationNavbarLink: "#documentation-navbar-link",
    documentationContainer: "#documentation-container",
    documentationContents: "#documentation-contents",
    documentationTableOfContents: "#documentation-table-of-contents",
    documentationTableOfContentsList: "#documentation-table-of-contents > ul",
    codeWarningDialog: "#code-warning-dialog",
    codeWarningList: "#code-warning-list",
    codeWarningEditCodeButton: "#code-warning-edit-code-button",
    codeWarningIgnoreButton: "#code-warning-ignore-button",
    chapterTitlePage: "#chapter-title-page",
    chapterTitlePageName: "#chapter-title-page-name",
    chapterTitlePageButton: "#chapter-title-page-button",
    chapterTitlePageCredits: "#chapter-title-page-credits",
    contentBody: "#content-body",
    sidebarClass: ".bs-docs-sidebar",
    publishStoryContainer: "#publish-story-container",
    publishStoryButton: "#publish-story-button",
    publishStoryDialog: "#publish-story-dialog",
    publishStoryBackButton: "#publish-story-back-button",
    publishStoryNextButton: "#publish-story-next-button",
    publishStoryFinishButton: "#publish-story-finish-button",
    publishStorySteps: ".publish-story-steps",
    publishStoryStep1: "#publish-story-step-1",
    publishStoryStep2: "#publish-story-step-2",
    publishStoryStep3: "#publish-story-step-3",
    publishStoryTitle: "#input-publish-title",
    publishStoryAuthors: "#input-publish-authors",
    publishInputPastebinUrl: "#input-pastebin-url",
    publishStoryUrl: "#publish-story-url",
};

var global = {
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

function showPage( pageToShow, navbarLink )
{
    $( html.historyContainer ).hide();
    $( html.storyContainer ).hide();
    $( html.documentationContainer ).hide();
    $( html.publishStoryContainer ).hide();
    
    $( pageToShow ).show();
    
    $( html.activeNavbarLink ).removeClass( constants.activeLinkClass );
    $( navbarLink ).addClass( constants.activeLinkClass );
}

function goToPlayPage()
{
    showPage( html.storyContainer, html.playNavbarLink );
}

function goToHistoryPage()
{
    showPage( html.historyContainer, html.historyNavbarLink );
}

function goToDocumentationPage()
{
    // Load documentation contents if they haven't been already.
    loadDocumentation();
    
    // Show the documentation.
    showPage( html.documentationContainer, html.documentationNavbarLink );
}

function goToPublishStoryPage()
{
    // Load page contents if they haven't been already.
    loadPublishStoryPage();
    
    // Show the documentation.
    showPage( html.publishStoryContainer, html.publishStoryNavbarLink );
}

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

function loadStory( storyTitle, storyAuthors, storyCode, showWarnings )
{
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

// Called on start.
$(function() {
    
    // Set the initial buttons.
    $( html.loadStoryNavbarButton ).text("Create Story");
    $( html.loadStoryNavbarButton ).click( showCreateStoryDialog );
    $( html.createStoryJumbotronButton).click( showCreateStoryDialog );
    
    // Initialize tooltips.
    $('[data-toggle="tooltip"]').tooltip()

});
