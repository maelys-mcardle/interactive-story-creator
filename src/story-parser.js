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
    };
    
    // Go line by line.  
    storyCode.split("\n").forEach( function ( line ) {
        
        let trimmedLine = line.trim();
        
        if ( trimmedLine.startsWith("[") ) {
            
            story = addChoiceLink( story, trimmedLine );
            
        } else if ( trimmedLine.startsWith("###") ) {
            
            story = endCurrentChoiceParagraph( story );
            story = startNewChoiceParagraph( story, trimmedLine );
            
        } else if ( trimmedLine.startsWith("##") ) {
            
            story = endCurrentPage( story );            
            story = startNewPage( story, trimmedLine );
            
        } else if ( trimmedLine.startsWith("#") ) {
            
            story = endCurrentChapter( story );
            story = startNewChapter( story, trimmedLine );

        } else {
            
            story = loadContentInPageOrChoiceParagraph( story, line );
            
        }
        
    });
    
    return story;
}

function startNewChapter( story, trimmedLine )
{
}

function endCurrentChapter( story )
{
}

function addChoiceLink( story, trimmedLine )
{
}

function startNewPage( story, trimmedLine )
{
}

function endCurrentPage( story )
{
}

function startNewChoiceParagraph( story, trimmedLine )
{
}

function endCurrentChoiceParagraph( story )
{
}

function loadContentInPageOrChoiceParagraph( story, line )
{
}

