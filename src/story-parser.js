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
        
        currentChapter: {
            day: "",
            pages: [],
        },
        
        currentPage: {
            time: "",
            location: "",
            text: [],
            links: [],
        },
        
        currentText: {
            content: "",
            choice: {
                id: "",
                target: "",
            },
        }
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

function everythingAfterSubstring( substring, line )
{
    return line.slice( substring.length ).trim();
}

function caseInsensitive( string )
{
    return string.toUpperCase()
}

function startNewChapter( story, chapterInfo )
{
}

function endCurrentChapter( story )
{
}

function startNewPage( story, pageInfo )
{
}

function endCurrentPage( story )
{
}

function startNewText( story, choiceInfo )
{
}

function appendCurrentText( story, line )
{
}

function endCurrentText( story )
{
}

function addChoiceLink( story, link )
{
}

function choiceInfoFromHeader( line )
{
    let fullChoice = everythingAfterSubstring( "###", line );
    let choiceId = "";
    let choiceTarget = "";
    
    if ( caseInsensitive( fullChoice ).startsWith( caseInsensitive( "Chose " ) ) {
        
       let choiceIdAndTarget = fullChoice.substring( "Chose ".length ).trim();
       
       // Choice ID either is:
       // 1. contained in bunny quotes, OR
       // 2. before the word "on", OR
       // 3. all text.
       if ( choiceIdAndTarget.startswith( '"' ) {
           choiceId = 
       }

    }
    
    return {
        id: targetId,
        target: targetPage,
    };
}

function choiceLinkFromLink( line )
{
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
    let {left, right} = splitInTwoParts( ":", line );
    
    return { 
        time: left,
        location: right,
    }
}

function splitInTwoParts( character, line )
{
    let splitString = string.split( character );
    let left = splitString[0].trim();
    let right = splitString.slice( 1 ).join( character ).trim();
    
    return { left: left, right: right };
}
