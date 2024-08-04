// Canva setup

const canvas= document.getElementById("myCanvas");
const ctx= canvas.getContext("2d");
canvas.height = window.innerHeight-108                      // Set canvas height and width
canvas.width = window.innerWidth
const Height= canvas.height;
const Width= canvas.width;
var img = document.getElementById("image");
var img2 = document.getElementById("image2");
const che = document.querySelector('#checkdiag')            // for the diagonal checkbox

var weight=1;


var cSet=[]            // column indices
var rSet=[]            // row indices
var neighbors=[]       // containing neighbouring nodes
var gap= 3;
var cnt;
tileW= 25;          // width of each tile
tileH= 25;          // height of each tile
tileRow=(Height/28);        // number of rows in grid
tileColumn= (Width/28);                     // number of columns in grid
var sr=Math.floor(tileRow/2);               // starting row 
var sc=(Math.floor(tileColumn/2) -5);       // starting column
var ec= (Math.floor(tileColumn/2) +5);      // ending row
var er=Math.floor(tileRow/2);               // ending row
var start
var end
var X                                       // Variables for start and end cells, and for cell coordinates
var Y
boundX=0;                       // store the current position during mouse interactions.
boundY=0;


// grid initialization

var tiles=[];       // grid of tiles
for (c=0; c < tileColumn; c++)
{
    tiles[c]=[];

    for(r=0; r < tileRow; r++)
    {
        X =c
        Y =r
        tiles[c][r]= new cell(c,r)               // Each cell is instantiated with its column and row indices using the cell constructor.
    } 
}

function cell(c,r)                    // representing each tile in the grid.
{
    this.x = c*(tileW+3)     // x-coordinate of each tile, here we are adding 3 because gap is 3
    this.y = r*(tileH+3)     // y-coordinate of each tile
    this.c=c
    this.r =r
    this.state = 'e'                     // state of each tile is initially empty
    this.g=0                             // cost (distance from start to current tile)
    this.f=0                             // fitness number  f = g + h  (cost + heuristic)
    this.h=0                             // heuristic value (distance from current tile to destination)
    this.previous = undefined            // parent of tile
    this.visited =  false                // visited state of each tile
    this.distance = Infinity             // distance to start
    this.prevstate=undefined             // previous state of each tile
}


// Initialize start and end cells

start = tiles[sc][sr]           
end = tiles[ec][er]            
start.state= 's';
end.state= 'f';

// check if two cells are diagonal neighbors

function isDiagonal(a,b){                  
    if(Math.abs(a.c-b.c) === 1 && Math.abs(a.r - b.r) === 1){
        return true;
    }else{
        return false
    }
}
 

// This function is responsible for drawing individual tiles on the canvas based on their state.

function rect(x,y,w,h,state,c,r)
{     
    if (state==='s'){                         // state s corresponds to start        
        ctx.drawImage(img,x,y,tileW,tileH);              
    }
    else if (state==='f'){                    // state f corresponds to finish
        ctx.drawImage(img2,x,y,tileW,tileH);              
    }
    else if (state==='e'){                    // state e corresponds to empty
        ctx.fillStyle= '#E8E9EB';             // grey
    }
    else if(state==="w"){                     // state w corresponds to wall
        ctx.fillStyle= '#95A5A6';             // dark grey
    }
    else if(state==="x"){                     // state x corresponds to visited
        ctx.fillStyle="#FF6F61";              // baby blue
    }
    else if(state === 'p'){                   // tile has been identified as part of the optimal path from the start node to the end node.   
        ctx.fillStyle='#89cff0'
    }
    else if(state === 'l')                    // the tile has been visited or is being evaluated by the pathfinding algorithm, but it is not part of the final path.
    {
        ctx.fillStyle='#4fa8ff'  
    }
    
    ctx.beginPath();                          // Draw the tile
    if(state != 's' && state != 'f')
    {
        ctx.rect(x,y,w,h);
    }

    ctx.closePath();
    ctx.fill();   
}

// This function clears the entire canvas area.

function clear()
{
    ctx.clearRect(0,0,Width,Height);
}

// This function is responsible for rendering the entire grid on the canvas.

function draw()
{
    clear();
    for (c=0; c < tileColumn; c++)
    {
        for (r=0; r < tileRow; r++)
        {
            rect(tiles[c][r].x,tiles[c][r].y,tileW,tileH,tiles[c][r].state,c,r); 
        }
    }
}

// This function is an event handler for the mouse move event (mousemove) on the canvas.
// To change the position of start and end point

function myMove(e)
{
    // Get the x and y coordinates of the mouse relative to the canvas

    x= e.pageX - canvas.offsetLeft;
    y= e.pageY - canvas.offsetTop;
    
    for (c=0; c < tileColumn; c++)
    {
        for (r=0; r < tileRow; r++)
        {
            // Check if the mouse is within the bounds of the current tile

            if (c*(tileW+gap)<x && x < c*(tileW+gap)+tileW && r*(tileH+gap)<y && y < r*(tileH+gap)+tileH)
            {

                // If the current tile state is 'e' (empty), and it's not the tile where the mouse down started, and cnt is 2 (moving start)

                if (tiles[c][r].state === 'e' && (c != boundX || r != boundY) && cnt === 2) 
                {
                    tiles[c][r].state = 's';
                    tiles[boundX][boundY].state = 'e';
                    boundX = c;
                    boundY = r;
                    sc=c;
                    sr=r;
                }
                // If the current tile state is 'e' (empty), and it's not the tile where the mouse down started, and cnt is 4 (moving finish)

                else if (tiles[c][r].state === 'e' && (c != boundX || r != boundY) && cnt === 4) 
                {
                    tiles[c][r].state = 'f';
                    tiles[boundX][boundY].state = 'e';
                    boundX = c;
                    boundY = r;
                    ec=c;
                    er=r;
                }
                // If the current tile state is 'e', 'p' (path), 'l' (last path), or 'x' (visited), and it's not the tile where the mouse down started, and cnt is '1' (drawing walls)

                else if ((tiles[c][r].state === 'e' || tiles[c][r].state === 'p' || tiles[c][r].state === 'l'|| tiles[c][r].state=='x') && (c != boundX || r != boundY) && cnt === '1') 
                {
                    tiles[c][r].prevstate = tiles[c][r].state                     
                    tiles[c][r].state = 'w';
                    boundX = c;
                    boundY = r;
                }
                // If the current tile state is 'w' (wall), and it's not the tile where the mouse down started, and cnt is '1' (erasing walls)

                else if (tiles[c][r].state === 'w' && (c != boundX || r != boundY) && cnt === '1') 
                {
                    if (tiles[c][r].prevstate=='p'|| tiles[c][r].prevstate=='l'|| tiles[c][r].prevstate=='x')
                    {
                        tiles[c][r].state=tiles[c][r].prevstate
                    }
                    else
                    {
                        tiles[c][r].state = 'e';
                    }
                    boundX = c;
                    boundY = r;                 
                }
                 // If the current tile state is 'w' (wall), and it's not the tile where the mouse down started, and cnt is '3' (a different action, possibly erasing walls in a specific mode)

                else if (tiles[c][r].state === 'w' && (c != boundX || r != boundY) && cnt === '3') 
                {
                    tiles[c][r].state = 'e';
                    boundX = c;
                    boundY = r;
                }
            }
        }
    }
}


function myDown(e)
{    
    // Assigning the myMove function to handle mouse movement events

    canvas.onmousemove= myMove;

    // getting mouse pointers coordinates

    x= e.pageX - canvas.offsetLeft;
    y= e.pageY - canvas.offsetTop;
    

    // Iterate over each column and row of the grid

    for (c=0; c < tileColumn; c++)
    { 
        for (r=0; r < tileRow; r++)
        {
            if (c*(tileW+gap)<x && x < c*(tileW+gap)+tileW && r*(tileH+gap)<y && y < r*(tileH+gap)+tileH)         // Check if the mouse pointer is within the bounds of the current tile
            {
                // If the tile is empty, set it as a wall, update cnt, boundX, and boundY

                if (tiles[c][r].state==='e')
                {
                    tiles[c][r].state='w';
                    cnt='1';
                    boundX=c;
                    boundY=r;
                }
                // If the tile is a wall, toggle it to its previous state if it was a path or visited; otherwise, set it as empty

                else if (tiles[c][r].state==='w')
                {
                    if( tiles[c][r].prevstate=='p'||tiles[c][r].prevstate=='l'|| tiles[c][r].prevstate=='x')
                    {
                        tiles[c][r].state=tiles[c][r].prevstate
                    }
                    else
                    {
                        tiles[c][r].state='e';
                    }
                    cnt='1';
                    boundX=c;
                    boundY=r;
                }
                // if it is the starting node
                else if (tiles[c][r].state==='s')
                {
                    boundX=c;
                    boundY=r;
                    cnt=2;
                    sc=c;
                    sr=r;
                }
                // if it is the finish node
                else if (tiles[c][r].state==='f')
                {
                    boundX=c;
                    boundY=r;
                    cnt=4;
                    ec=c;
                    er=r;
                }
                // If the tile is neither empty, a wall, start, nor finish, save its previous state, set it as a wall
                // This implies that the algorithm treat this tile as an obstacle and avoid passing through it during pathfinding.
                else
                {
                    tiles[c][r].prevstate= tiles[c][r].state
                    tiles[c][r].state='w';
                    boundX=c;
                    boundY=r;
                    cnt='1';
                }
            }
        }
    }
    // Assigning the myMove function to handle mouse movement events
    canvas.onmousemove= myMove;
}

// This function is triggered when the mouse button is released.
// It sets the onmousemove event handler of the canvas to null, effectively removing the event listener.This means that when the mouse button is released, there would not be any further handling of mouse movement events until the mouse button is clicked again.

function myUp()
{
    canvas.onmousemove= null;
}

// This function is responsible for clearing the path (removing the path drawn on the grid)

function reset()
{
    neighbors=[]
    for (c=0; c < tileColumn; c++)
    {
        tiles[c]=[];
    
        for(r=0; r < tileRow; r++)
        {
            tiles[c][r]= new cell(c,r)
        }
    }
    start = tiles[sc][sr]
    end = tiles[ec][er]
    start.state= 's';
    end.state= 'f';
    output.innerHTML="";
}

// This function is adding the neighbours from all the directions

function addNeighbors(cur,c,r)
{
    neighbors=[]
    if(c >0)
    {
        neighbors.push(tiles[c-1][r])
    }
    if(c < tileColumn-1 )
    {
        neighbors.push(tiles[c+1][r])
    }
    if(r > 0)
    {
        neighbors.push(tiles[c][r-1])
    }
    if(r < tileRow-1 )
    {
       neighbors.push(tiles[c][r+1])
    }

    // if checkbox is clicked, it add neighbours in the diagonal directions
    if(che.checked === true)
    {
        if(c >0  && r<tileRow-1)
        {
            neighbors.push(tiles[c-1][r+1])
        }
        if(c < tileColumn-1 && r < tileRow-1){
            neighbors.push(tiles[c+1][r+1])
        }
        if(r > 0  && c>0 ){
            neighbors.push(tiles[c-1][r-1])
        }
        if(r>0 && c < tileColumn-1 ){
            neighbors.push(tiles[c+1][r-1])
        }     
    }
    return neighbors
}

function clear_path()
{
    
    neighbors=[]

    // Finding and storing wall coordinates in cSet and rSet arrays
    for(var c=0;c<tileColumn;c++)
    {
        for(var r=0;r<tileRow;r++)
        {
            if(tiles[c][r].state === 'w')
            {
                cSet.push(c)
                rSet.push(r)
            }
        }
    }
    // Reset each tile in the grid to empty state e
    for (c=0; c < tileColumn; c++)
    {
        tiles[c]=[];
        for(r=0; r < tileRow; r++)
        {
            tiles[c][r]= new cell(c,r)
        }
    }
    // Setting the tiles stored in cSet and rSet arrays as walls again
    for(i=0,j=0;i<cSet.length,j<rSet.length;i++,j++)
    {
        var a = cSet[i]
        var b = rSet[j]
        tiles[a][b].state='w'
    }
    cSet=[]
    rSet=[]

    start = tiles[sc][sr]
    end = tiles[ec][er]
    start.state= 's';
    end.state= 'f';

    output.innerHTML=""; 
}

// This function initializes the application.
// It first retrieves the HTML element with the id "outcome"
function init()
{
    output= document.getElementById("outcome");
    // it sets up a recurring call to the draw() function using setInterval(). 
    // The draw() function is called every 10 milliseconds, which likely updates the display of the grid on the canvas.
    return setInterval(draw,10);
}

// initialize the application.
init();

// When the mouse button is pressed (mousedown event),the myDown() function is called, and when the mouse button is released (mouseup event), the myUp() function is called.
// These event handlers likely control the behavior of drawing walls, setting the start and end points, and other interactions with the grid on the canvas.

canvas.onmousedown= myDown;
canvas.onmouseup= myUp;
