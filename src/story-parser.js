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
        "chapters" : [],
        
        "current chapter" : {
            "day": "",
            "pages": [],
        },
        
        "current page" : {
            "time" : "",
            "location": "",
            "text": [],
            "choice links": [],
        },
        
        "current text": {
            "choice" : {
                "id": "",
                "page": "",
                "chapter": "",
            },
            "content": "",
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

function isChoiceStart( line )
{
    let choiceCode = everythingAfterSubstring( "###", line );
    
    if ( caseInsensitive( choiceCode ).startsWith( caseInsensitive( "Chose " ) ) {
        
       let choiceIdAndTarget = choiceCode.slice( "Chose ".length )
    
    if ( choiceCode === "" ) {
        return { 
            "is choice": false, 
            "choice id": null,
            "choice target": null,
        }
    } else {
    
        
    }
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
}

function choiceLinkFromLink( line )
{
}

function chapterInfoFromHeader( line )
{
    var chapterTitle = everythingAfterSubstring( "#", line );
}

function pageInfoFromHeader( line )
{
    var chapterTitle = everythingAfterSubstring( "#", line );
}
