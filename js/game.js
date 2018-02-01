var canvas = document.getElementById('game-space');
var ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;


function Game () {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = ctx;
}

var game = new Game();

var createTiles = function(size) {
    let tiles = [];
    for (let i = 0; i < 9; i++) {
        tiles.push(new Tile(i,canvas.width/3));
    }
    return tiles;
}

var clicked = function(e) {
}

var draw = function(state, tiles) {
    ctx.fillStyle = "#669999";
    ctx.fillRect(0, 0, 600, 600);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tiles[state[i][j]].draw(j,i);
        }
    }
}

var h1 = function(state, goal) {
    function manhattenDistance(num, state, goal) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (state[i][j] == num) {
                    x = j;
                    y = i;
                }
            }
        }
        let ans = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (goal[i][j] == num) {
                    ans += Math.abs(x - j);
                    ans += Math.abs(y - i);
                }
            }
        }
        return ans;
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += manhattenDistance(i, state, goal);
    }
    return sum;
}

var actions = function(state) {
    let actions = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (j > 0) {
                if (state[i][j-1] == 0) {
                    actions.push({x: j, y: i, direction: "left"});
                    continue;
                }
            }
            if (j < 2) {
                if (state[i][j+1] == 0) {
                    actions.push({x: j, y: i, direction: "right"});
                    continue;
                }
            }
            if (i > 0) {
                if (state[i-1][j] == 0) {
                    actions.push({x: j, y: i, direction: "up"});
                    continue;
                }
            }
            if (i < 2) {
                if (state[i+1][j] == 0) {
                    actions.push({x: j, y: i, direction: "down"});
                    continue;
                }
            }
        }
    }
    return actions;
}

var nextState = function(state, x, y, direction) {
    let ns = JSON.parse(JSON.stringify(state));
    if (direction == "left") {
        ns[y][x-1] = state[y][x];
        ns[y][x] = 0;
    }
    if (direction == "right") {
        ns[y][x+1] = state[y][x];
        ns[y][x] = 0;
    }
    if (direction == "up") {
        ns[y-1][x] = state[y][x];
        ns[y][x] = 0;
    }
    if (direction == "down") {
        ns[y+1][x] = state[y][x];
        ns[y][x] = 0;
    }
    return ns;
}

var moveToState = function(ns) {
    state = ns;
}

var moveCheck = function(state, x, y, direction) {
    let a = {x: x, y: y, direction: direction};
    let as = actions(state);
    for (i = 0; i < as.length; i++) {
        if (as[i].x == a.x && as[i].y == a.y && as[i].direction == a.direction) return true;
    }
    return false;
}

var shuffle = function() {
    for (let i = 0; i < 100; i++) {
        setTimeout(function () {
            let as = actions(state);
            let move = as[Math.floor(Math.random() * as.length)];
            moveToState(nextState(state, move.x, move.y, move.direction));
            draw(state, tiles);
        }, i * 10)
    }
}

var checkGoal = function(state) {
    return JSON.stringify(state) == JSON.stringify(goal);
};

//  function BREADTH-FIRST-SEARCH(problem) returns a solution, or failure
//      node ← a node with STATE = problem.INITIAL-STATE, PATH-COST = 0
//      if problem.GOAL-TEST(node.STATE) then return SOLUTION(node)
//      frontier ← a FIFO queue with node as the only element
//      explored ← an empty set
//      loop do
//          if EMPTY?(frontier) then return failure
//          node←POP(frontier) /*choosestheshallowestnodeinfrontier */ add node.STATE to explored
//          for each action in problem.ACTIONS(node.STATE) do
//              child ←CHILD-NODE(problem,node,action)
//              if child.STATE is not in explored or frontier then
//                  if problem.GOAL-TEST(child.STATE) then
//                  return SOLUTION(child)
//                  frontier ←INSERT(child,frontier)

var Node = function(parent, state) {
    this.parent = parent;
    this. state = state;
}

var solve = async function(state) {
    document.getElementById("solve-button").disabled = true;
    document.getElementById("shuffle-button").disabled = true;
    var node = new Node(null, state);
    if (checkGoal(node.state)) solution(node);
    var frontier = [node];
    var frontierHashSet ={};
    frontierHashSet[JSON.stringify(node.state)] = 1;
    var explored = {};
    while (frontier.length != 0) {
        if (frontier.length == 0) return;
        node = frontier.shift();
        delete frontierHashSet[JSON.stringify(node.state)];
        explored[JSON.stringify(node.state)] = 1;
        as = actions(node.state);
        for(let i = 0; i < as.length; i++) {
            action = as[i];
            let child = new Node(node, nextState(node.state, action.x, action.y, action.direction));
            if (!(JSON.stringify(child.state) in explored) && !(JSON.stringify(child.state) in frontierHashSet)) {
                if (checkGoal(child.state)) {
                    solution(child);
                    return;
                }
                frontier.push(child);
                frontierHashSet[JSON.stringify(node.state)] = 1;
            }
        }
    }
}

var containsNode = function(frontier, n1) {
    for (let i = 0; i < frontier.length; i++) {
        let n2 = frontier[i];
        if (JSON.stringify(n1.state) == JSON.stringify(n2.state)) return true;
    }
    return false;
}


var solution = function(node) {
    let moveStack = [];
    let n = node;
    while (n != null) {
        moveStack.push(n.state);
        n = n.parent;
    }
    for (let i = 0; i < moveStack.length; i++) {
        setTimeout(() => {
            let state = moveStack[moveStack.length - i - 1];
            moveToState(state);
            draw(state, tiles);
        }, i * 300)
    }
    document.getElementById("solve-button").disabled = false;
    document.getElementById("shuffle-button").disabled = false;
    return moveStack;
}

var compareS = function(s1, s2) {
    return JSON.stringify(s1) == JSON.stringify(s2);
}

let state = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
];

let goal = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
];

let tiles = createTiles();

draw(state, tiles);

canvas.addEventListener('mousedown', clicked, false);