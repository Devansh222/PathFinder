// open list contains nodes that have been discovered but not yet evaluated.
// The closed list contains nodes that have already been evaluated.


function closed(closedList,path)
{

    var i=0
    
    // we set up an interval using window.setInterval, which will execute the given function repeatedly with a delay of 10 milliseconds.

    let timerId= window.setInterval(function(){      
        if(i === closedList.length)
        {
            i=0
            clearInterval(timerId)
        }
        else
        {
            if(!path.includes(closedList[i]))
            {
                closedList[i].state='p'
                tiles[sc][sr].state='s'        // start
                tiles[ec][er].state='f'        // finish
            }
        }
        i++
    },10)                                      // Interval delay of 10 milliseconds
}

function open(openList,closedList,path)
{

    var j=0
    
    let timerId1= window.setInterval(function(){
        if(j === openList.length)
        {
            j=0
            clearInterval(timerId1)            // Clear the interval to stop further execution
    
        }
        else
        {
            if(!path.includes(openList[j])){
                openList[j].state ='l'
                tiles[sc][sr].state='s'        // Ensure the start and end tiles retain their respective states
                tiles[ec][er].state='f'
            }
        }
        j++
    },(closedList.length*11)/(openList.length))     // Interval delay calculated based on list lengths

}

function pathvisual(path,time, closedList)
{
    // Start from begining

    path.reverse()
    var k=0
    // calculating the length of the path and formats it to 2 decimal places

    var len= length(path).toFixed(2)

    // Set up an interval to repeatedly execute the given function with a delay based on the length of the closed list and path

    let timerId2= window.setInterval(function(){
        if(k=== path.length)
        {
            k=0
            
            // Display the length and time of the path visualization in the HTML element with ID "outcome"

            document.getElementById("outcome").innerHTML = ` Length= ${len} and Time= ${(time).toFixed(3)}ms`;
            clearInterval(timerId2)
        }
        else
        {
            path[k].state='x'             // mark visited
            tiles[sc][sr].state='s'
            tiles[ec][er].state='f'
        }
        k++;   
    },(closedList.length*11)/(path.length))
}
