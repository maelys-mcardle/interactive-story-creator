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
            "content": "",
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
            
            story = endCurrentParagraph( story );
            story = addChoiceLink( story, trimmedLine );
            
        } else if ( trimmedLine.startsWith("###") ) {
            
            story = endCurrentParagraph( story );
            story = endCurrentChoice( story );
            story = startNewChoice( story, trimmedLine );
            
        } else if ( trimmedLine.startsWith("##") ) {
            
            story = endCurrentParagraph( story );
            story = endCurrentPage( story );
            story = startNewPage( story, trimmedLine );
            
        } else if ( trimmedLine.startsWith("#") ) {
            
            story = endCurrentParagraph( story );
            story = endCurrentPage( story );
            story = endCurrentChapter( story );
            story = startNewChapter( story, trimmedLine );

        } else {
            
            story = appendCurrentParagraph( story, line );
            
        }
        
    });
    
    // Terminate open paragraphs/page/chapters.
    story = endCurrentParagraph( story );
    story = endCurrentPage( story );
    story = endCurrentChapter( story );
    
    return story;
}

function startNewChapter( story, line )
{
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

function appendCurrentParagraph( story, line )
{
}

function endCurrentParagraph( story )
{
}

function addChoiceLink( story, line )
{
}
