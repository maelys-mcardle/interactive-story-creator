"use strict";

const constants = {
    newlineCharacter: "\n",
    updatedMessageDuration: 3000,
    errorMessageDuration: 5000,
    activeLinkClass: "active",
    indexPage: "index.htm",
    documentationPage: "documentation.htm",
    publishPage: "publish.htm",
};

const pages = {
    play: 0,
    history: 1,
    publish: 2,
    documentation: 3,
}

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
    documentationTryExampleButtons: ".documentation-try-example-buttons",
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
    publishInputStoryCodeUrl: "#input-story-code-url",
    publishStoryUrl: "#publish-story-url",
    overwriteWarningDialog: "#overwrite-warning-dialog",
    overwriteWarningCancelButton: "#overwrite-warning-cancel-button",
    overwriteWarningOverwriteButton: "#overwrite-warning-overwrite-button",
};

var global = {
    showStoryUpdatedTimeout: undefined,
    showStoryErrorTimeout: undefined,
    lastShownPage: undefined,
    scrollPositions: {},
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

function showPage( page, navbarLink )
{
    // Get the scroll position of the page being moved away from.
    global.scrollPositions[ global.lastShownPage ] = $( window ).scrollTop();
    
    // Show the right pages.
    $( html.storyContainer         ).toggle( page === pages.play );
    $( html.historyContainer       ).toggle( page === pages.history );
    $( html.publishStoryContainer  ).toggle( page === pages.publish );
    $( html.documentationContainer ).toggle( page === pages.documentation );
    
    // Show the right navbar.
    $( html.playNavbarLink ).toggleClass( 
        constants.activeLinkClass, page === pages.play );
    $( html.historyNavbarLink ).toggleClass( 
        constants.activeLinkClass, page === pages.history );
    $( html.publishStoryNavbarLink ).toggleClass( 
        constants.activeLinkClass, page === pages.publish );
    $( html.documentationNavbarLink ).toggleClass( 
        constants.activeLinkClass, page === pages.documentation );
    
    // Restore the scrollbar position for the page being moved into.
    // Except for play page - that one has dynamic content.
    if ( page != pages.play && global.scrollPositions[ page ] ) {
        $( window ).scrollTop( global.scrollPositions[ page ] );
    }
    
    // Update the last shown page.
    global.lastShownPage = page;
}

function goToPlayPage()
{
    showPage( pages.play );
}

function goToHistoryPage()
{
    showPage( pages.history );
}

function goToPublishStoryPage()
{
    // Load page contents if they haven't been already.
    loadPublishStoryPage();
    
    // Show the documentation.
    showPage( pages.publish );
}

function goToDocumentationPage()
{
    // Load documentation contents if they haven't been already.
    loadDocumentation();
    
    // Show the documentation.
    showPage( pages.documentation );
}

function warnBrowserLeavingPage()
{
    $( window ).off('beforeunload').on('beforeunload', function(){
        return "Your play progress will be lost.";
    });
}

// Called on start.
$(function() {
    
    // Set the initial buttons.
    $( html.loadStoryNavbarButton ).text("Create Story");
    $( html.loadStoryNavbarButton ).click( showCreateStoryDialog );
    $( html.createStoryJumbotronButton).click( showCreateStoryDialog );
    
    // Initialize tooltips.
    $('[data-toggle="tooltip"]').tooltip()
    
    // Load the story from the URL, if applicable.
    loadStoryFromUrl();

});
