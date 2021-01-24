export function dijkstra(board) {
    // Create visited array
    let visited = new Array(board.height);
    for(let i = 0; i < board.height; i++) {
        visited[i] = new Array(board.width);
        for(let j = 0; j < board.width; j++) {
            visited[i][j] = 0;
        }
    }

    // Set start node g value to 0
    board.startNode.g = 0;
    // Add start node to nodeList
    let nodeList = [board.startNode];
    // Array for keeping visited node
    let nodeHistory = [];

    // Algorithm loop
    while(nodeList.length > 0) {
        // Choose node with lowest g value
        let currentNode = nodeList[0];
        for(let i = 0; i < nodeList.length; i++) {
            if(nodeList[i].g < currentNode.g) {
                currentNode = nodeList[i];
            }
        }
        // Remove current node from nodeList
        nodeList.splice(nodeList.indexOf(currentNode), 1);
        // Add current node to nodeHistory
        nodeHistory.push(currentNode);

        // Check if current node has been visited
        if(visited[currentNode.y][currentNode.x] == 1) {
            continue;
        }
        // Set current node as visited
        visited[currentNode.y][currentNode.x] = 1;
        // Mark current node as visited
        if(currentNode.status != "startNode" &&
            currentNode.status != "endNode") {
            currentNode.status = "visited";
        }

        // Check if endNode has been found
        if(currentNode == board.endNode) {
            // Return nodeHistory if path is found
            return nodeHistory;
        }

        // Available movement direction
        let moveX = [+0, +1, +0, -1];
        let moveY = [-1, -0, +1, -0];
        let moves = moveX.length;
        // Loop through currentNode's neighbours
        for(let i = 0; i < moves; i++) {
            // Determine next node's location
            let nextX = currentNode.x + moveX[i];
            let nextY = currentNode.y + moveY[i];
            
            // Check if next node location is out of bounds
            if(nextX < 0 || nextX >= board.width || 
                nextY < 0 || nextY >= board.height) {
                continue;
            }

            // Check if next node has been visited
            if(visited[nextY][nextX] == 1) {
                continue;
            }

            // Get next node object
            let nextNode = board.array[nextY][nextX];
            // Check if nextNode is a wall
            if(nextNode.status == "wall") {
                continue;
            }

            // Calculate tentative g value for nextNode
            let tentativeG = currentNode.g + nextNode.cost;
            // Check if tentative g value is lower than next node's actual g value
            if(tentativeG < nextNode.g) {
                // Set nextNode's actual g value to be tentative g value
                nextNode.g = tentativeG;
                // Set nextNode's parent to be currentNode
                nextNode.setParent(currentNode);
                // Push nextNode to nodeList to be evaluated
                nodeList.push(nextNode);
            }
        }
    }

    // Return nodeHistory if path is not found
    return nodeHistory;
}