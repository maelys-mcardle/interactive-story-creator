"use strict";

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
    let story = {
        chapters: [],
        currentChapter: emptyChapter(), 
        currentPage: emptyPage(),        
        currentText: emptyText(),
    };
    
    // Go line by line.  
    storyCode.split("\n").forEach( function ( line ) {
        
        let trimmedLine = line.trim();
        
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
            story = startNewText( story, {} );
            
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
        text: [],
        links: [],
    };
}

function emptyText()
{
    return {
        content: "",
        choice: {
            id: "",
            target: "",
        },
    };
}

function everythingAfterSubstring( substring, line )
{
    return line.slice( substring.length ).trim();
}

function caseInsensitive( string )
{
    return string.toUpperCase();
}

function startNewChapter( story, chapterInfo )
{
    story.currentChapter = emptyChapter();
    story.currentChapter.day = chapterInfo.day;
}

function endCurrentChapter( story )
{
    story.chapters.push( story.currentChapter );
    story.currentChapter = emptyChapter();
}

function startNewPage( story, pageInfo )
{
    story.currentPage = emptyPage();
    story.currentPage.time = pageInfo.time;
    story.currentPage.location = pageInfo.location;
}

function endCurrentPage( story )
{
    story.currentChapter.pages.push( story.currentPage );
    story.currentPage = emptyPage();
}

function startNewText( story, textInfo )
{
    story.currentText = emptyText();
    story.currentText.choice.id = textInfo.id;
    story.currentText.choice.target = textInfo.target;
}

function appendCurrentText( story, line )
{
    story.currentText.content.concat( line );
}

function endCurrentText( story )
{
    story.currentPage.text.push( story.currentText );
    story.currentText = emptyText();
}

function addChoiceLink( story, link )
{
    story.currentPage.links.push( link );
}

function choiceInfoFromHeader( line )
{
    let fullChoice = caseInsensitive( everythingAfterSubstring( "###", line ) );
    let choiceId = "";
    let choiceTarget = "";
    
    if ( fullChoice.startsWith( caseInsensitive( "Chose " )  ) ) {
        
        // Get everything after the opening keyword "Chose"
       let choiceIdAndTarget = fullChoice.substring( "Chose ".length ).trim();
       
       // Choice ID either is:
       // 1. contained in bunny quotes, OR
       // 2. before the word "on", OR
       // 3. all text.
       if ( choiceIdAndTarget.startswith( '"' ) ) {
           
            let splitChoiceIdAndTarget = splitInTwoParts( '"', 
                choiceIdAndTarget.substring(1) );
            choiceId = choiceIdOnAndTarget.left.trim();
           
            let onAndTarget = splitInTwoParts( 
                caseInsensitive( " on " ), choiceIdOnAndTarget.right );
            choiceTarget = onAndTarget.right.trim();
           
       } else {
           
            let splitChoiceIdAndTarget = splitInTwoParts( 
                caseInsensitive( " on " ), choiceIdAndTarget );
            
            choiceId = splitChoiceIdAndTarget.left.trim();
            choiceTarget = splitChoiceIdAndTarget.right.trim();
       }

    }
    
    return {
        id: choiceId,
        target: choiceTarget,
    };
}

function choiceLinkFromLink( line )
{
    // [link id: link text](target page)
    // [link text](target page)
    let linkTextAndTarget = splitInTwoParts( "](", line );
    let linkText = linkTextAndTarget.left.trim();
    let linkTarget = linkTextAndTarget.right.substring( 
        0, right.indexOf( ")" ) ).trim();
    let linkId = "";
    
    if ( linkText.includes( ":" ) ) {
        let linkIdAndText = splitInTwoParts( ":", linkText );
        linkId = linkIdAndText.left.trim();
        linkText = linkIdAndText.right.trim();
    }
    
    return {
        id: linkId,
        text: linkText,
        target: linkTarget,
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
    let pageTitle = everythingAfterSubstring( "#", line );
    let timeAndLocation = splitInTwoParts( ":", line );
    
    return { 
        time: timeAndLocation.left,
        location: timeAndLocation.right,
    }
}

function splitInTwoParts( divider, line )
{
    let splitString = string.split( divider );
    let left = splitString[0].trim();
    let right = splitString.slice( 1 ).join( divider ).trim();
    
    return { left: left, right: right };
}
