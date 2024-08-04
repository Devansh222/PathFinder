function ManhattanHeu(dx, dy) {
    return (dx + dy);
}

function EuclideanHeu(dx, dy) {
    return (Math.sqrt(dx * dx + dy * dy));
}

function OctileHeu(dx, dy) {
    var F = Math.SQRT2 - 1;
    return (dx < dy) ? F * dx + dy : F * dy + dx;
}

function ChebyshevHeu(dx, dy) {
    return (Math.max(dx, dy));
}

// function MinkowskiHeu(dx, dy, p) {
//     return Math.pow(Math.pow(Math.abs(dx), p) + Math.pow(Math.abs(dy), p), 1/p);
// }

// function DiagonalHeu(dx, dy) {
//     var D = 1;
//     var D2 = Math.SQRT2;
//     return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
// }

// function WeightedManhattanHeu(dx, dy, weight) {
//     return weight * (dx + dy);
// }

function heuristic(curr, end, heu, p = 1, weight = 1) {
    var dx = Math.abs(curr.c - end.c);
    var dy = Math.abs(curr.r - end.r);

    var val;

    if (heu === 'manhattan') {
        val = ManhattanHeu(dx, dy);
    } else if (heu === 'euclidean') {
        val = EuclideanHeu(dx, dy);
    } else if (heu === 'octile') {
        val = OctileHeu(dx, dy);
    } else if (heu === 'chebyshev') {
        val = ChebyshevHeu(dx, dy);
    }
    return val;
}



// function ManhattanHeu(dx,dy)                //all heuristic functions
// {           
//     return (dx+dy)
// }

// function EuclideanHeu(dx,dy)
// {
//     return (Math.sqrt(dx * dx + dy * dy))
// }

// function OctileHeu(dx,dy)
// {
//     // F is a constant representing sqrt(2) - 1
//     var F = Math.SQRT2 - 1;

//     // Octile distance is a combination of horizontal and vertical distances
//     // If dx < dy, it uses F * dx + dy, else F * dy + dx

//     return (dx < dy) ? F * dx + dy : F * dy + dx;
// }

// function ChebyshevHeu(dx,dy)
// {
//     // Chebyshev distance is the maximum of horizontal and vertical distances
//     return (Math.max(dx, dy))
// }


// function heuristic(curr,end,heu)                            // checking which heuristic is selected
// {           
//     var dx = Math.abs(curr.c - end.c)                       // from the current node to the end node
//     var dy = Math.abs(curr.r - end.r)

//     var val

//     if (heu=='manhattan'){
//         val = ManhattanHeu(dx,dy) 
//     }
//     else if (heu=='euclidean'){
//         val = EuclideanHeu(dx,dy) 
//     }
//     else if (heu=='octile'){
//         val = OctileHeu(dx,dy) 
//     }
//     else if (heu=='chebyshev'){
//         val = ChebyshevHeu(dx,dy) 
//     }
//     return val
// }
