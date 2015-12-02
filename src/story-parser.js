"use strict";

const NEWLINE_CHARACTER = "\n";

/*
 * # Level 1 Headers are Chapters (they get title pages)
 * 
 * ## Level 2 Headers represent pages ("Time Of Day: Location")
 * 
 * [ID: Text](path) at the end represent choices
 * 
 * ### Level 3 Headers are optional paragraphs, that show depending on choices
 * and terminated by an empty level 3 header (###)
 * 
 * Standard markdown formatting otherwise applies.
 */
 
function parseStory( storyCode )
{
    var story = {
        chapters: [],
        currentChapter: emptyChapter(), 
        currentPage: emptyPage(),        
        currentText: emptyText(),
    };
    
    // Go line by line.  
    storyCode.split( NEWLINE_CHARACTER ).forEach( function ( line ) {
        
        var trimmedLine = rightTrim( line );
        
        if ( trimmedLine.startsWith("[") ) {
            
            // New choice link.
            story = endCurrentText( story );
            story = addChoiceLink( story, 
                choiceLinkFromLink( trimmedLine ) );
            
        } else if ( trimmedLine.startsWith("###") ) {
            
            // New choice/content.
            story = endCurrentText( story );
            story = startNewText( story, 
                choiceInfoFromHeader( trimmedLine ) );
            
        } else if ( trimmedLine.startsWith("##") ) {
            
            // New page/paragraph.
            story = endCurrentText( story );
            story = endCurrentPage( story );
            story = startNewPage( story, 
                pageInfoFromHeader( trimmedLine ) );
            story = startNewText( story, emptyChoice() );
            
        } else if ( trimmedLine.startsWith("#") ) {
            
            // New chapter.
            story = endCurrentText( story );
            story = endCurrentPage( story );
            story = endCurrentChapter( story );
            story = startNewChapter( story, 
                chapterInfoFromHeader( trimmedLine ) );

        } else {
            
            // Continued text.
            story = appendCurrentText( story, line );
            
        }
        
    });
    
    // Terminate open paragraphs/page/chapters.
    story = endCurrentText( story );
    story = endCurrentPage( story );
    story = endCurrentChapter( story );
    
    return story;
}

function emptyChapter()
{
    return {
        day: "",
        pages: [],
    };
}

function emptyPage()
{
    return {
        time: "",
        location: "",
        texts: [],
        links: [],
    };
}

function emptyText()
{
    return {
        content: "",
        choice: emptyChoice(),
    };
}

function emptyChoice()
{
    return {
        id: "",
        target: {
            path: "",
        },
    };
}

function isChapterEmpty( chapter )
{
    return !( chapter.pages.length || chapter.day.length );
}

function isPageEmpty( page )
{
    return !( page.texts.length || page.links.length ||
              page.time.length  || page.location.length );
}

function isTextEmpty( text )
{
    return !( text.content.length );
}

function startNewChapter( story, chapterInfo )
{
    story.currentChapter = emptyChapter();
    story.currentChapter.day = chapterInfo.day;
    return story;
}

function endCurrentChapter( story )
{
    if( !isChapterEmpty( story.currentChapter ) ) {
        story.chapters.push( story.currentChapter );
    }
    
    story.currentChapter = emptyChapter();
    return story;
}

function startNewPage( story, pageInfo )
{
    story.currentPage = emptyPage();
    story.currentPage.time = pageInfo.time;
    story.currentPage.location = pageInfo.location;
    return story;
}

function endCurrentPage( story )
{
    if ( !isPageEmpty( story.currentPage ) ) {
        story.currentChapter.pages.push( story.currentPage );
    }
    
    story.currentPage = emptyPage();
    return story;
}

function startNewText( story, textInfo )
{
    story.currentText = emptyText();
    story.currentText.choice.id = textInfo.id;
    story.currentText.choice.target = textInfo.target;
    return story;
}

function appendCurrentText( story, line )
{
    story.currentText.content += line + NEWLINE_CHARACTER;
    return story;
}

function endCurrentText( story )
{
    if ( !isTextEmpty( trimText( story.currentText ) ) ) {
        story.currentPage.texts.push( trimText( story.currentText ) );
    }
    
    story.currentText = emptyText();
    return story;
}

function trimText( text )
{
    return {
        content: rightTrim( text.content ),
        choice: text.choice,
    }
}

function addChoiceLink( story, link )
{
    story.currentPage.links.push( link );
    return story;
}

function choiceInfoFromHeader( line )
{
    var fullChoice = everythingAfterSubstring( "###", line );
    var choiceId = "";
    var choicePath = "";
    
    if ( caseInsensitive( fullChoice ).startsWith( caseInsensitive( "Chose " ) ) ) {
        
        // Get everything after the opening keyword "Chose"
        var choiceIdAndPath = fullChoice.substring( "Chose ".length ).trim();
       
        // Choice ID either is:
        // 1. contained in bunny quotes, OR
        // 2. before the word "on", OR
        // 3. all text.
        if ( choiceIdAndPath.startsWith( '"' ) ) {

            var choiceIdAndOnAndPath = splitInTwoParts( '"', 
                choiceIdAndPath.substring(1) );

            var onAndPath = splitInTwoParts( "on ", 
                choiceIdAndOnAndPath.right );
            
            choiceId = choiceIdAndOnAndPath.left;
            choicePath = onAndPath.right;
           
        } else {
           
            var splitChoiceIdAndPath = splitInTwoParts( " on ", 
                choiceIdAndPath );
            
            choiceId = splitChoiceIdAndPath.left;
            choicePath = splitChoiceIdAndPath.right;
        }

    }
    
    return {
        id: choiceId,
        target: {
            path: choicePath,
        },
    };
}

function choiceLinkFromLink( line )
{
    // [link id: link text](target page)
    // [link text](target page)
    var linkTextAndPath = splitInTwoParts( "](", line );
    var linkText = everythingAfterSubstring( "[", linkTextAndPath.left ).trim();
    var linkPath = linkTextAndPath.right.substring( 
        0, linkTextAndPath.right.indexOf( ")" ) ).trim();
    var linkId = "";
    
    if ( linkText.includes( ":" ) ) {
        var linkIdAndText = splitInTwoParts( ":", linkText );
        linkId = linkIdAndText.left.trim();
        linkText = linkIdAndText.right.trim();
    }
    
    return {
        id: linkId,
        text: linkText,
        target: {
            path: linkPath,
        }
    }
}

function chapterInfoFromHeader( line )
{
    return { 
        day: everythingAfterSubstring( "#", line ) 
    }; 
}

function pageInfoFromHeader( line )
{
    var pageTitle = everythingAfterSubstring( "##", line );
    var timeAndLocation = splitInTwoParts( ":", pageTitle );
    
    return { 
        time: timeAndLocation.left,
        location: timeAndLocation.right,
    }
}
