var history = [];

function appendHistory( page, clickedChoice )
{
    history.push({
        page: page,
        choice: clickedChoice });
        
    return history;
}

function showStoryPage( story, link )
{
    
}

function parseLink( story, link )
{
    // Link Examples:
    //
    //   last
    //   next
    //   [Day]
    //   [Time]
    //   [Time] #2
    //   [Day] > [Time]
    //   [Day] > [Time] : [Location]
    //   [Day] > [Time] : [Location] #2
    //
    
    
}
