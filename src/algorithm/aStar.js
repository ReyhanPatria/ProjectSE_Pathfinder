export function aStar(board) {
    // Initialize start node g value as 0
    board.startNode.g = 0;
    
    // Initialize current node list
    let nodeList = [board.startNode];
    let nodeHistory = [];

    // Algorithm loop
    while(nodeList.length > 0) {
        // Select node with lowest F value
        let currentNode = nodeList[0];
        for(let i = 0; i < nodeList.length; i++) {
            let currentNodeF = currentNode.g + currentNode.getDistance(board.endNode);
            let nextNodeF = nodeList[i].g + nodeList[i].getDistance(board.endNode);
            if(nextNodeF < currentNodeF) {
                currentNode = nodeList[i];
            }
            else if(nextNodeF == currentNodeF) {
                if(nodeList[i].getDistance(board.endNode) < currentNode.getDistance(board.endNode)) {
                    currentNode = nodeList[i];
                }
            }
        }

        // Delete current node from nodeList
        nodeList.splice(nodeList.indexOf(currentNode), 1);
        // Push current to nodeHistory
        nodeHistory.push(currentNode);

        // Update currentNode status to visited
        if(currentNode.status != "startNode" && currentNode.status != "endNode") {
            currentNode.status = "visited";
        }

        // Check if currentNode is endNode
        if(board.endNode.x == currentNode.x && 
            board.endNode.y == currentNode.y) {
            return nodeHistory;
        }

        // Define movement
        let moveX = [+0, +1, +0, -1];
        let moveY = [-1, -0, +1, -0];
        let moves = moveX.length;
        // Loop through currentNode neighbours
        for(let i = 0; i < moves; i++) {
            // Next node x and y
            let nextX = currentNode.x + moveX[i];
            let nextY = currentNode.y + moveY[i];

            // Check if next node is out of bounds
            if(nextX < 0 || nextX >= board.width || 
                nextY < 0 || nextY >= board.height) {
                continue;
            }

            // Get nextNode object
            let nextNode = board.array[nextY][nextX];
            
            // Check if nextNode is a wall
            if(nextNode.status == "wall") {
                continue;
            }

            // Define nextNode temporary g value
            let nextNodeTempG = 1 + currentNode.g;
            // Check if nextNode's temporary g value is lower than actual g value
            if(nextNodeTempG < nextNode.g) {
                // Update nextNode's parent to currentNode
                nextNode.setParent(currentNode);
                // Update nextNode's g value
                nextNode.g = nextNodeTempG;

                // If nextNode is not in nodeList, then add it
                if(nodeList.includes(nextNode) == false) {
                    nodeList.push(nextNode);
                }
            }
        }
    }

    return nodeHistory;
}