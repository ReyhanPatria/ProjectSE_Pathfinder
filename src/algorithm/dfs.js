import { Node } from "../board/node.js";

export function dfs(board) {
    let visited = new Array(board.height);
    for(let i = 0; i < board.height; i++) {
        visited[i] = new Array(board.width);
        for(let j = 0; j < board.width; j++) {
            visited[i][j] = 0;
        }
    }

    let start = board.startNode;
    let end = board.endNode;

    let nodeHistory = []

    return search(board, visited, start, end, nodeHistory);
}

function search(board, visited, currentNode, end, nodeHistory) {
    if(visited[currentNode.y][currentNode.x] == 1) {
        return;
    }
    visited[currentNode.y][currentNode.x] = 1;
    if(currentNode.status != "startNode" &&
        currentNode.status != "endNode") {
        currentNode.status = "visited";
    }

    nodeHistory.push(currentNode);

    if(currentNode.x == end.x && currentNode.y == end.y) {
        return nodeHistory;
    }

    let moveX = [+0, -0, +1, -1];
    let moveY = [+1, -1, +0, -0];
    let moves = moveX.length;
    for(let i = 0; i < moves; i++) {
        let nextX = currentNode.x + moveX[i];
        if(nextX < 0 || nextX >= board.width) {
            continue;
        }

        let nextY = currentNode.y + moveY[i];
        if(nextY < 0 || nextY >= board.height) {
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
        let path = search(board, visited, nextNode, end, nodeHistory);
        if(path != null) {
            return path;
        }
    }
}