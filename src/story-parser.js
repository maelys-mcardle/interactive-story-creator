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
    let chapters = [];
    
    let linesOfStoryCode = storyCode.split("\n");
    let currentChapter = "Untitled";
    
    let doNothing = function() {};
    let startNewChoiceLink = doNothing;
    let startNewChoiceParagraph = doNothing;
    let startNewPage = doNothing;
    let startNewChapter = doNothing;
    let loadIntoParagraph = doNothing;
    
    linesOfStoryCode.forEach( function ( line ) {
        
        let trimmedLine = line.trim();
        
        if ( trimmedLine.startsWith("[") ) {
            
            startNewChoiceLink( trimmedLine );
            
        } else if ( trimmedLine.startsWith("###") ) {
            
            startNewChoiceParagraph( trimmedLine );
            
        } else if ( trimmedLine.startsWith("##") ) {
            
            startNewPage( trimmedLine );
            
        } else if ( trimmedLine.startsWith("#") ) {
            
            startNewChapter( trimmedLine );
            
        } else if ( trimmedLine.startsWith("[") ) {
            
            startNewChoiceLink( trimmedLine );
            
        } else {
            
            loadIntoParagraph( line );
            
        }
        
    });
    
}
