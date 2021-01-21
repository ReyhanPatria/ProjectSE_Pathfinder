export function bfs(board) {
    // Initialize visited array
    let visited = new Array(board.height);
    for(let i = 0; i < board.height; i++) {
        visited[i] = new Array(board.width);
        for(let j = 0; j < board.width; j++) {
            visited[i][j] = 0;
        }
    }

    // Initialize current node list
    let nodeList = [board.startNode];
    let nodeHistory = [];
    while(nodeList.length > 0) {
        let currentNode = nodeList.shift();
        nodeHistory.push(currentNode);

        if(visited[currentNode.y][currentNode.x] == 1) {
            continue;
        }
        visited[currentNode.y][currentNode.x] = 1;
        if(currentNode.status != "startNode" &&
            currentNode.status != "endNode") {
            currentNode.status = "visited";
        }
        

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

            if(visited[nextY][nextX] == 1) {
                continue;
            }

            let nextNode = board.array[nextY][nextX];
            if(nextNode.status == "wall") {
                continue;
            }

            nextNode.addParent(currentNode);
            nodeList.push(nextNode);
        }
    }

    return nodeHistory;
}