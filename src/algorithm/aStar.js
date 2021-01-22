export function aStar(board) {
    console.log("a star running");

    // Initialize current node list
    board.startNode.g = 0;
    let nodeList = [board.startNode];
    let nodeHistory = [];
    while(nodeList.length > 0) {
        // Select node with lowest F value
        let currentNode = nodeList[0];
        for(let i = 0; i < nodeList.length; i++) {
            let currentNodeF = currentNode.g + currentNode.getDistance(board.endNode);
            let nextNodeF = nodeList[i].g + nodeList[i].getDistance(board.endNode);
            if(nextNodeF <= currentNodeF) {
                currentNode = nodeList[i];
            }
        }

        // Delete current node from nodeList
        nodeList.splice(nodeList.indexOf(currentNode), 1);
        // Push current to nodeHistory
        nodeHistory.push(currentNode);

        // Update currentNode status to visited
        if(currentNode.status != "startNode" &&
            currentNode.status != "endNode") {
            currentNode.status = "visited";
        }

        // Check if currentNode is endNode
        if(board.endNode.x == currentNode.x && 
            board.endNode.y == currentNode.y) {
            return nodeHistory;
        }

        let moveX = [+0, +1, +0, -1];
        let moveY = [-1, -0, +1, -0];
        let moves = moveX.length;
        for(let i = 0; i < moves; i++) {
            let nextX = currentNode.x + moveX[i];
            let nextY = currentNode.y + moveY[i];
            if(nextX < 0 || nextX >= board.width || 
                nextY < 0 || nextY >= board.height) {
                continue;
            }

            let nextNode = board.array[nextY][nextX];
            if(nextNode.status == "wall") {
                continue;
            }

            let nextNodeTempG = 1 + currentNode.g;
            if(nextNodeTempG < nextNode.g) {
                nextNode.addParent(currentNode);
                nextNode.g = nextNodeTempG;

                nodeList.push(nextNode);
            }
        }
    }

    return nodeHistory;
}