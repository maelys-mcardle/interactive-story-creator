"use strict";

function setupMarkdownEditor()
{
    $( html.inputStoryCode ).markdown({
        autofocus: false, 
        savable: false,
        fullscreen: false,
        hiddenButtons: ["cmdPreview", "cmdUrl", "cmdHeading"],
        additionalButtons: [[
            {
                name: "groupChapterPage",
                data: [
                    createMarkdownEditorButton( 
                        "cmdChapter", 
                        "New Chapter", 
                        "glyphicon glyphicon-book", 
                        "# ", "\n", 
                        "Chapter Title" ),
                        
                    createMarkdownEditorButton( 
                        "cmdPage", 
                        "New Page", 
                        "glyphicon glyphicon-file", 
                        "## ", "\n", 
                        "Time: Location" ),
                ]
            },
            {
                name: "groupChoices",
                data: [
                    createMarkdownEditorButton( 
                        "cmdChoiceLink", 
                        "Choice Link", 
                        "glyphicon glyphicon-share-alt", 
                        "[identifier:", "](page)\n", 
                        "link text" ),
                            
                    createMarkdownEditorButton( 
                        "cmdChoiceText", 
                        "Choice-Dependent Text", 
                        "glyphicon glyphicon-record", 
                        "### Chose \"identifier\" on page\n", "\n###\n", 
                        "This only shows when the given choice was made." ),
                ]
            }]]});
}

function createMarkdownEditorButton( name, title, icon, beforeSelection, afterSelection, defaultValue )
{
    return {
        name: name,
        toggle: false,
        title: title,
        icon: icon,
        callback: function(e){
            
            var chunk, cursor;
            var selected = e.getSelection();
            var content = e.getContent();
            
            // If the first character in the selection is:
            //   - The first character in the text
            //   - Preceded by a newline
            //
            // Then it shouldn't have a newline prepended to it.
            // Otherwise it should.
            //
            var prependNewline = ( 
                selected.start === 0 || (
                    selected.start - 1 >= 0 && 
                    content[ selected.start - 1 ] === '\n' ) ) ? 
                        "" : "\n"; 
                
            // Prepend the chapter header.
            if ( selected.text ) {
                chunk = prependNewline + beforeSelection + 
                        selected.text + afterSelection;
            } else {
                chunk = prependNewline + beforeSelection + 
                        defaultValue + afterSelection;
            }

            // transform selection and set the cursor into chunked text
            e.replaceSelection(chunk);
            cursor = selected.start;

            // Set the cursor
            e.setSelection(cursor, cursor+chunk.length);
        }
    }
}
