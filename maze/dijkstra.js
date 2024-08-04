function solve_using_dijkstra()
{ 
    clear_path();                                       // function present in grid.js file
    var set=[]                                          // to store examined elements
    var path =[]                                        // store the final path
    var num=53*23                                       // grid dimensions
    var flag =0                                         // Check the destination is reached or not
    tiles[sc][sr].distance = 0                          // initialising start distance to be 0
    var time_s = new Date().getTime();                  // record the start time of the algorithm

    // Loop until all nodes are examined.

    while(num>0)
    {
        var min = Infinity
        for(var i=0;i<tileColumn;i++)
        {
            for(var j=0;j<tileRow;j++)
            {    
                if(tiles[i][j].distance < min   && tiles[i][j].visited === false){
                    min = tiles[i][j].distance
                    cur = tiles[i][j]                   // Set the current tile as the one with the minimum distance
                }
            }
        }
        cur.visited=true                                // Mark the current tile as visited.
        set.push(cur)
        if(cur == tiles[ec][er])                        // if destination is found
        {             
            flag =1;
            path =path_f(cur)                 // function present in path.js
            break;                            // then break
        }

        var neighbors= addNeighbors(cur,cur.c,cur.r)           //function present in grid.js file

        for(var i=0;i<neighbors.length;i++)
        {
            var neighbor = neighbors[i]
            if(neighbor.visited === false && neighbor.state!='w')
            {
                var temp = neighbor.distance
                // Update the distance and previous tile if it is shorter via diagonal path   
                if(isDiagonal(neighbor,cur))                   // function present in grid.js file
                {             
                    if(temp <  cur.distance+Math.sqrt(2))
                    {
                        // if temp is smaller, update it with temp
                        neighbor.distance = temp
                    }               
                    else
                    {
                        neighbor.distance=cur.distance+Math.sqrt(2)
                        neighbor.previous = cur
                    }
                }
                // Update the distance and previous tile if it is shorter via non-diagonal path
                else
                {
                    if(temp <  cur.distance+1)
                    {
                        neighbor.distance = temp
                    }
                    else
                    {
                        neighbor.distance=cur.distance+1
                        neighbor.previous = cur
                    }  
                }
            } 
        }
        // decrement the count of unexamined tiles
        num--  
    }
    var time_e = new Date().getTime();         //  record the end time of the algorithm

    if(flag == 1)
    {
        var time= time_e-time_s 
        closed(set,path)                  //function present in animation.js file
        pathvisual(path, time,set)            //function present in animation.js file
    }
    else
    {
        alert('solution does not exist')
        console.log('solution does not exist')
    }
}