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
            "paragraphs": [],
            "choice links": [],
        },
        
        "current paragraph": {
            "is choice": false,
            "choice id": "",
            "text": "",
        }
        
        "current choice": {
            "active": false,
            "choice id": "",
        }
    };
    
    // Go line by line.  
    storyCode.split("\n").forEach( function ( line ) {
        
        let trimmedLine = line.trim();
        
        if ( trimmedLine.startsWith("[") ) {
            
            // New choice link.
            story = endCurrentParagraph( story );
            story = addChoiceLink( story, trimmedLine );
            
        } else if ( trimmedLine.startsWith("###") ) {
            
            // New choice/paragraph.
            story = endCurrentParagraph( story );
            story = startNewParagraph( story );
            
        } else if ( trimmedLine.startsWith("##") ) {
            
            // New page/paragraph.
            story = endCurrentParagraph( story );
            story = endCurrentPage( story );
            story = startNewPage( story, trimmedLine );
            story = startNewParagraph( story );
            
        } else if ( trimmedLine.startsWith("#") ) {
            
            // New chapter.
            story = endCurrentParagraph( story );
            story = endCurrentPage( story );
            story = endCurrentChapter( story );
            story = startNewChapter( story, trimmedLine );

        } else {
            
            // Continued paragraph.
            story = appendCurrentParagraph( story, line );
            
        }
        
    });
    
    // Terminate open paragraphs/page/chapters.
    story = endCurrentParagraph( story );
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
        
       let choiceIdAndSource =  
    
    if ( choiceCode === "" ) {
        return { 
            "is choice": false, 
            "choice id": null,
            "choice target": null,
        }
    } else {
    
        
    }
}

function startNewChapter( story, line )
{
    var chapterTitle = everythingAfterSubstring( "#", line );
}

function endCurrentChapter( story )
{
}

function startNewPage( story, line )
{
}

function endCurrentPage( story )
{
}

function startNewChoice( story, line )
{
}

function endCurrentChoice( story )
{
}

function startNewParagraph( story )
{
}

function appendCurrentParagraph( story, line )
{
}

function endCurrentParagraph( story )
{
}

function addChoiceLink( story, line )
{
}
