// The path_f function traces back from the current node to the starting node, forming a path.

function path_f(current)
{    
    var path =[]                              // array to store the path
    var temp = current
    path.push(temp)

    while(temp.previous){
        path.push(temp.previous)
        temp = temp.previous
    }
    // returning the path array containing the nodes from current to the starting node.
    return path
}

function length(path)
{
    
    var i=0
    var len=0

    // If the distance is equal to 2 (which implies a diagonal movement), incrementing the length by the square root of 2 (approximating the diagonal distance).
    // If the distance is not equal to 2 (which implies a horizontal or vertical movement), incrementing the length by 1.

    while (i<path.length-1)
    {
        if (((path[i].c-path[i+1].c)**2 + (path[i].r-path[i+1].r)**2) == 2 )
        {
            len=len+Math.sqrt(2)
        }
        else
        {
            len=len+1
        }
        i++
    }
    return len
}

// The remove function removes a specific node from the open list.

function remove(openList,current)
{    
    // If we find a node in the openList that matches with the current node, removing that node from the openList using the splice method.

    for(var i=openList.length-1;i>=0;i--)
    {
        if(openList[i] == current)
        {
            openList.splice(i,1)
        }
    }
}
