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
                        "\n# ", "\n", 
                        "Chapter Title" ),
                        
                    createMarkdownEditorButton( 
                        "cmdPage", 
                        "New Page", 
                        "glyphicon glyphicon-file", 
                        "\n## ", "\n", 
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
                        "\n[identifier:", "](page)\n", 
                        "link text" ),
                            
                    createMarkdownEditorButton( 
                        "cmdChoiceText", 
                        "Choice-Dependent Text", 
                        "glyphicon glyphicon-record", 
                        "\n### Chose \"identifier\" on page\n", "\n###\n", 
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

            // Prepend the chapter header.
            if ( selected.text ) {
                chunk = beforeSelection + selected.text + afterSelection;
            } else {
                chunk = beforeSelection + defaultValue + afterSelection;
            }

            // transform selection and set the cursor into chunked text
            e.replaceSelection(chunk);
            cursor = selected.start;

            // Set the cursor
            e.setSelection(cursor, cursor+chunk.length);
        }
    }
}
